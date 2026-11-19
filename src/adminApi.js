export const sessionKey = 'kerala-hub-session';

export async function adminApi(action, payload = {}) {
  const url = '/api/admin';
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'omit',
      redirect: 'follow',
      body: JSON.stringify({...payload, action}),
      signal: AbortSignal.timeout(35000),
    });
  } catch {
    throw new Error('Cannot reach the website API. Run npm run dev locally or deploy the complete UI project with its api folder.');
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error('The website API is missing. Deploy the complete UI project to Vercel, including api/admin.js.'); }
  if (!response.ok || !data.ok) throw new Error(data.error || 'API request failed.');
  if (data.result?.expired) {
    sessionStorage.removeItem(sessionKey);
    window.location.replace('/login/');
    throw new Error('Session expired. Sign in again.');
  }
  return data.result;
}
