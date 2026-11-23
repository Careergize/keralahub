const prefix = 'KeralaHub quotation v1\n';
export function readQuotationDetails(notes = '') {
  if (String(notes).startsWith(prefix)) {
    try { const value = JSON.parse(String(notes).slice(prefix.length)); if(value && typeof value === 'object' && !Array.isArray(value)) return value; } catch {}
  }
  return {notes:String(notes)};
}
export function quotationAmount(details) {
  const rate = Math.round(Number(details.rate || 0) * 100);
  return rate * (details.pricing === 'person' ? Number(details.travellers || 1) : 1) / 100;
}
export function writeQuotationDetails(details) {
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(String(details.rate))) throw new Error('Enter a valid package rate with up to two decimal places.');
  if (!/^\d+$/.test(String(details.travellers)) || Number(details.travellers) < 1 || Number(details.travellers) > 10000) throw new Error('Enter between 1 and 10,000 travellers.');
  if (!['group','person'].includes(details.pricing)) throw new Error('Choose a pricing basis.');
  if(quotationAmount(details)>999999999.99)throw new Error('Quotation total is too large.');
  const text = prefix + JSON.stringify(details);
  if (text.length > 10000) throw new Error('Please shorten the quotation details.');
  return text;
}
