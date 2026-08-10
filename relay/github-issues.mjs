const projectId = process.env.FIREBASE_PROJECT_ID || 'shipmate-cruise-social-2026';
const apiKey = process.env.FIREBASE_API_KEY;
const relayEmail = process.env.FIREBASE_RELAY_EMAIL;
const relayPassword = process.env.FIREBASE_RELAY_PASSWORD;
const githubToken = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPO || 'chartmann1590/shipmate-cruise-social';

const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: relayEmail, password: relayPassword, returnSecureToken: true }) });
if (!authResponse.ok) throw new Error(`Relay auth failed: ${authResponse.status}`);
const { idToken } = await authResponse.json();
const root = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const headers = { Authorization: `Bearer ${idToken}`, 'content-type': 'application/json' };
const queryResponse = await fetch(`${root}:runQuery`, { method: 'POST', headers, body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'supportTickets' }], where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'open' } } }, limit: 25 } }) });
if (!queryResponse.ok) throw new Error(`Support query failed: ${queryResponse.status}`);
const rows = (await queryResponse.json()).filter((row) => row.document);
const value = (fields, key) => fields?.[key]?.stringValue || '';

for (const row of rows) {
  const fields = row.document.fields || {};
  const title = value(fields, 'title');
  const description = value(fields, 'description');
  const appUrl = value(fields, 'appUrl');
  const issueResponse = await fetch(`https://api.github.com/repos/${repo}/issues`, { method: 'POST', headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'content-type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body: JSON.stringify({ title: `[User report] ${title}`, body: `${description}\n\nReported from: ${appUrl}\n\nThis issue was submitted through ShipMate support.` }) });
  if (!issueResponse.ok) throw new Error(`GitHub issue creation failed: ${issueResponse.status} ${await issueResponse.text()}`);
  const issue = await issueResponse.json();
  await fetch(`${root}/${row.document.name.split('/documents/')[1]}?updateMask.fieldPaths=status&updateMask.fieldPaths=issueNumber&updateMask.fieldPaths=issueUrl`, { method: 'PATCH', headers, body: JSON.stringify({ name: row.document.name, fields: { status: { stringValue: 'filed' }, issueNumber: { integerValue: String(issue.number) }, issueUrl: { stringValue: issue.html_url } } }) });
}
console.log(JSON.stringify({ submitted: rows.length }));
