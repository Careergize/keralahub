// Public content has no local business-data or sample-content fallback.
export function publishedRows(collections, name) {
  return Array.isArray(collections?.[name]) ? collections[name] : [];
}
export function settingValue(collections, key) {
  return publishedRows(collections, 'SiteSettings').find(row => row.Key === key)?.Value ?? '';
}
export function pageSections(collections, path) {
  const sections = publishedRows(collections, 'PageSections').filter(row => row.Page === path && row.Type !== 'Override' && !(path === '/' && row.Key === 'about'));
  if (path !== '/') return sections;
  const explore = sections.find(row => row.Key === 'explore');
  const offers = sections.find(row => row.Type === 'Collection' && row.Collection === 'Offers');
  if (!explore || !offers) return sections;
  const ordered = sections.filter(row => row !== explore);
  ordered.splice(ordered.indexOf(offers) + 1, 0, explore);
  const benefits=ordered.find(row=>row.Key==='benefits'&&row.Type==='Cards');
  if(benefits){ordered.splice(ordered.indexOf(benefits),1);ordered.splice(ordered.indexOf(explore)+1,0,benefits);}
  return ordered;
}
export function safeUrl(value, fallback='') {
  return typeof value === 'string' && /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(value) ? value : fallback;
}
export function mediaUrl(value) {
  return typeof value === 'string' && /^(https?:\/\/|\/(?!\/))/i.test(value) ? value : '';
}
export function linkedPageIsPublished(link, pages) {
  if (!link?.startsWith('/') || link.startsWith('//') || /^\/(login|dashboard)(\/|$)/.test(link)) return true;
  const path=link.split(/[?#]/)[0].replace(/\/?$/, '/');
  return pages.some(page => page.Path === path);
}
export function navigationRows(collections, location) {
  const pages=publishedRows(collections,'Pages');
  return publishedRows(collections,'Navigation').filter(row=>{
    if(row.Location!==location||!safeUrl(row.Link)||!linkedPageIsPublished(row.Link,pages))return false;
    if(row.Link.startsWith('/')&&row.Link.includes('#')){
      const [path,hash]=row.Link.split('#');
      return pageSections(collections,path.replace(/\/?$/,'/')).some(section=>section.Key===hash);
    }
    return true;
  });
}
export function validateSiteResponse(result) {
  if (result?.schemaVersion !== 4 || !result.collections || typeof result.collections !== 'object') {
    throw new Error('Deploy the version 4 Apps Script API and run upgradeWebsiteContent.');
  }
  return result;
}

// Sheets returns display values, including currency symbols and grouping separators.
export function vehicleDailyRate(row) {
  const raw=row?.['Daily rate'];
  if(raw==null||String(raw).trim()==='')return null;
  const cleaned=String(raw).trim().replace(/^(?:INR|Rs\.?|₹)\s*/i,'').replace(/[,\s\u00a0]/g,'');
  if(!/^\d+(?:\.\d+)?$/.test(cleaned))return null;
  const rate=Number(cleaned);
  return Number.isFinite(rate)?rate:null;
}
