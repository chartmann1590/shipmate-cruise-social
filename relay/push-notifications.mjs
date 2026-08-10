const projectId = process.env.FIREBASE_PROJECT_ID || 'shipmate-cruise-social-2026';
const webPush = (await import('web-push')).default;
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
  const subscriptionsResponse = await fetch(`${firestoreRoot}/users/${uid}/pushSubscriptions?pageSize=100`, { headers: { Authorization: `Bearer ${accessToken}` } });
  const subscriptionsPayload = subscriptionsResponse.ok ? await subscriptionsResponse.json() : { documents: [] };
  const subscriptions = (subscriptionsPayload.documents || []).map((item) => item.fields).filter(Boolean).map((fields) => ({ endpoint: fields.endpoint?.stringValue, expirationTime: fields.expirationTime?.doubleValue || null, keys: { p256dh: fields.keys?.mapValue?.fields?.p256dh?.stringValue, auth: fields.keys?.mapValue?.fields?.auth?.stringValue } })).filter((item) => item.endpoint && item.keys.p256dh && item.keys.auth);
  const fields = document.fields || {};
  const text = fieldValue(fields, 'text') || 'You have a new ShipMate update.';
  const url = fieldValue(fields, 'url') || '/?tab=chats';
  let allDelivered = true;
  for (const subscription of subscriptions) {
    try { await webPush.sendNotification(subscription, JSON.stringify({ title: 'ShipMate', body: text, url: `https://shipmate-cruise-social-2026.web.app${url}` }), { vapidDetails: { subject: 'mailto:shipmate-push-relay@shipmate-social.dev', publicKey: process.env.WEB_PUSH_PUBLIC_KEY, privateKey: process.env.WEB_PUSH_PRIVATE_KEY } }); delivered += 1; }
    catch (error) { allDelivered = false; console.error(`Web Push delivery failed for ${uid}: ${error.message}`); }
  }
  if (allDelivered) await markSent(document.name);
}

console.log(JSON.stringify({ notifications: rows.length, delivered }));

const expiredQuery = await fetch(`${firestoreRoot}:runQuery`, { method: 'POST', headers: firestoreHeaders, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'messages', allDescendants: true }], where: { fieldFilter: { field: { fieldPath: 'audioExpiresAt' }, op: 'LESS_THAN', value: { timestampValue: new Date().toISOString() } } }, limit: 100 } }) });
if (expiredQuery.ok) {
  const expiredRows = (await expiredQuery.json()).filter((row) => row.document);
  for (const row of expiredRows) await fetch(`https://firestore.googleapis.com/v1/${row.document.name}`, { method: 'DELETE', headers: firestoreHeaders });
  console.log(JSON.stringify({ expiredAudioDeleted: expiredRows.length }));
}
