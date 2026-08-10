import crypto from 'node:crypto';

const projectId = process.env.FIREBASE_PROJECT_ID || 'shipmate-cruise-social-2026';
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');

if (!serviceAccount.client_email || !serviceAccount.private_key) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing client_email or private_key');

const encode = (value) => Buffer.from(value).toString('base64url');
const assertion = [
  encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
  encode(JSON.stringify({ iss: serviceAccount.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }))
].join('.');
const signature = crypto.createSign('RSA-SHA256').update(assertion).sign(serviceAccount.private_key, 'base64url');
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${assertion}.${signature}` }) });
if (!tokenResponse.ok) throw new Error(`OAuth token request failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();

const firestoreRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const firestoreHeaders = { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' };
const runQuery = await fetch(`${firestoreRoot}:runQuery`, {
  method: 'POST', headers: firestoreHeaders,
  body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'notifications', allDescendants: true }], where: { fieldFilter: { field: { fieldPath: 'sent' }, op: 'EQUAL', value: { booleanValue: false } } }, limit: 100 } })
});
if (!runQuery.ok) throw new Error(`Firestore query failed: ${runQuery.status} ${await runQuery.text()}`);
const rows = (await runQuery.json()).filter((row) => row.document);

const fieldValue = (fields, key) => fields?.[key]?.stringValue || fields?.[key]?.integerValue || '';
const markSent = async (documentName) => fetch(`https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=sent&updateMask.fieldPaths=sentAt`, { method: 'PATCH', headers: firestoreHeaders, body: JSON.stringify({ name: documentName, fields: { sent: { booleanValue: true }, sentAt: { timestampValue: new Date().toISOString() } } }) });
let delivered = 0;

for (const row of rows) {
  const document = row.document;
  const match = document.name.match(/\/documents\/users\/([^/]+)\/notifications\//);
  if (!match) continue;
  const uid = match[1];
  const tokensResponse = await fetch(`${firestoreRoot}/users/${uid}/pushTokens?pageSize=100`, { headers: { Authorization: `Bearer ${accessToken}` } });
  const tokensPayload = tokensResponse.ok ? await tokensResponse.json() : { documents: [] };
  const tokens = (tokensPayload.documents || []).map((item) => item.fields?.token?.stringValue).filter(Boolean);
  const fields = document.fields || {};
  const text = fieldValue(fields, 'text') || 'You have a new ShipMate update.';
  const url = fieldValue(fields, 'url') || '/?tab=chats';
  for (const token of tokens) {
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' }, body: JSON.stringify({ message: { token, notification: { title: 'ShipMate', body: text }, webpush: { fcmOptions: { link: `https://shipmate-cruise-social-2026.web.app${url}` } } } }) });
    if (response.ok) delivered += 1;
  }
  await markSent(document.name);
}

console.log(JSON.stringify({ notifications: rows.length, delivered }));
