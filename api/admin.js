const defaultUrl = 'https://script.google.com/macros/s/AKfycbzcfRMFpUjbjHfoLCua_iSczW5iYBnEm56Ia0u0sHF5anyJSBiJLHGKfWkiSuNosY9l7g/exec';

function createHandler(configuredUrl) {
return async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status, value) => { res.statusCode = status; res.end(JSON.stringify(value)); };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(405, {ok:false, error:'Use POST for the admin API.'});
  }
  let data;
  try {
    let body = req.body;
    if (body == null) {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += Buffer.byteLength(chunk);
        if (size > 100000) throw new Error('Too large');
        chunks.push(Buffer.from(chunk));
      }
      body = Buffer.concat(chunks).toString('utf8');
    }
    if (Buffer.isBuffer(body)) body = body.toString('utf8');
    data = typeof body === 'string' ? JSON.parse(body) : body;
    if (!data || Buffer.byteLength(JSON.stringify(data)) > 100000 ||
        !['login','signIn','loadView','saveRecord','deleteRecord','getSiteContent','signOut','submitContact','subscribe',
          'getCustomers','saveCustomer','getEnquiries','saveEnquiry',
          'getInvoices','saveInvoice','getQuotations','saveQuotation',
          'getBookings','saveBooking','getPackages','savePackage'].includes(data.action)) throw new Error('Invalid request');
  } catch { return send(400, {ok:false, error:'Invalid admin API request.'}); }
  const url = configuredUrl || process.env.APPS_SCRIPT_URL || process.env.VITE_ADMIN_WEB_APP_URL || defaultUrl;
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(url)) {
    return send(500, {ok:false, error:'Configure APPS_SCRIPT_URL with your deployed Apps Script /exec URL.'});
  }
  try {
    const upstream = await fetch(url, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(data), redirect:'follow', signal:AbortSignal.timeout(25000),
    });
    let result;
    try { result = await upstream.json(); }
    catch {
      const deployment = url.split('/').at(-2);
      return send(502, {ok:false, error:'Apps Script returned a page instead of JSON. Check deployment access and restart the local server after changing its URL.', deployment});
    }
    if (!upstream.ok || typeof result?.ok !== 'boolean') {
      return send(502, {ok:false, error:'Unexpected Apps Script response. Check the deployment URL and deploy the latest API Code.gs.'});
    }
    return send(200, result);
  } catch {
    return send(502, {ok:false, error:'The server could not reach Apps Script. Check the deployment URL, access and Google service availability.'});
  }
};
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
