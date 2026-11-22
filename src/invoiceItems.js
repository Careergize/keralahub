const separator='\n\nTrip pricing:\n';

// Keep item details in the existing Description column so saved invoices work
// with the current spreadsheet and remain readable outside the dashboard.
export function readInvoiceItems(description=''){
  const text=String(description),index=text.lastIndexOf(separator);
  if(index<0)return {description:text,items:[]};
  const lines=text.slice(index+separator.length).split('\n');
  const items=lines.map(line=>{
    const match=/^• (.+) — INR (\d{1,9}\.\d{2})$/.exec(line);
    return match?{details:match[1],price:match[2]}:null;
  });
  return items.length&&items.every(Boolean)?{description:text.slice(0,index),items}:{description:text,items:[]};
}
export function invoiceItemsTotal(items){
  return items.reduce((sum,item)=>sum+Math.round((Number(item.price)||0)*100),0)/100;
}
export function writeInvoiceItems(description,items){
  if(!items.length)return description;
  for(const item of items){
    if(!String(item.details||'').trim()||/[\r\n]/.test(item.details))throw new Error('Enter destination or service details for each trip row.');
    if(!/^\d{1,9}(\.\d{1,2})?$/.test(String(item.price)))throw new Error('Enter a valid price with up to 2 decimal places for each trip row.');
  }
  return description.trim()+separator+items.map(item=>`• ${item.details.trim()} — INR ${Number(item.price).toFixed(2)}`).join('\n');
}
