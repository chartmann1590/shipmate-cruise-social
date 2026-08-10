const projectId = process.env.FIREBASE_PROJECT_ID || 'shipmate-cruise-social-2026';
const apiKey = process.env.FIREBASE_API_KEY;
const relayEmail = process.env.FIREBASE_RELAY_EMAIL;
const relayPassword = process.env.FIREBASE_RELAY_PASSWORD;
const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: relayEmail, password: relayPassword, returnSecureToken: true }) });
if (!authResponse.ok) throw new Error(`Relay auth failed: ${authResponse.status} ${await authResponse.text()}`);
const { idToken: accessToken } = await authResponse.json();

const firestoreRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const firestoreHeaders = { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' };
const runQuery = await fetch(`${firestoreRoot}:runQuery`, {
  method: 'POST', headers: firestoreHeaders,
  body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'notificationOutbox' }], where: { fieldFilter: { field: { fieldPath: 'sent' }, op: 'EQUAL', value: { booleanValue: false } } }, limit: 100 } })
});
if (!runQuery.ok) throw new Error(`Firestore query failed: ${runQuery.status} ${await runQuery.text()}`);
const rows = (await runQuery.json()).filter((row) => row.document);

const fieldValue = (fields, key) => fields?.[key]?.stringValue || fields?.[key]?.integerValue || '';
const markSent = async (documentName) => fetch(`https://firestore.googleapis.com/v1/${documentName}?updateMask.fieldPaths=sent&updateMask.fieldPaths=sentAt`, { method: 'PATCH', headers: firestoreHeaders, body: JSON.stringify({ name: documentName, fields: { sent: { booleanValue: true }, sentAt: { timestampValue: new Date().toISOString() } } }) });
let delivered = 0;

for (const row of rows) {
  const document = row.document;
  const uid = fieldValue(document.fields, 'recipientId');
  if (!uid) continue;
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
