export function searchTravelRows(rows,search){
  const destination=String(search.destination||'').trim().toLowerCase();
  return rows.filter(row=>(!destination||[...(row.Places||'').split(','),row.Location,row.Region,row.Name].filter(Boolean).some(value=>value.trim().toLowerCase()===destination))&&(!search.category||row.Category===search.category));
}
export function travelPrice(value){
  const number=Number(String(value??'').replace(/^(?:INR|Rs\.?|₹)\s*/i,'').replace(/[,\s]/g,''));
  return String(value??'').trim()&&Number.isFinite(number)&&number>=0?number:null;
}
export function sortTravelRows(rows,sort){
  return [...rows].sort((a,b)=>sort==='name'?String(a.Title||a.Name||a.Country||'').localeCompare(String(b.Title||b.Name||b.Country||'')):sort.startsWith('price')?((travelPrice(a.Price)===null?1:0)-(travelPrice(b.Price)===null?1:0))||((travelPrice(a.Price)??0)-(travelPrice(b.Price)??0))*(sort==='price-high'?-1:1):0);
}
