export const sessionKey = 'kerala-hub-session';

export async function adminApi(action, payload = {}) {
  const url = import.meta.env.VITE_ADMIN_WEB_APP_URL;
  if (!url) throw new Error('The Apps Script API URL is not configured.');
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      // A simple POST avoids an unsupported Apps Script OPTIONS preflight.
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      credentials: 'omit',
      redirect: 'follow',
      body: JSON.stringify({...payload, action}),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error('Cannot reach the API. Check your connection and Apps Script deployment access.');
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error('The API did not return JSON. Deploy the updated Code.gs with access set to Anyone.'); }
  if (!response.ok || !data.ok) throw new Error(data.error || 'API request failed.');
  if (data.result?.expired) {
    sessionStorage.removeItem(sessionKey);
    window.location.replace('/login/');
    throw new Error('Session expired. Sign in again.');
  }
  return data.result;
}
