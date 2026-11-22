import {useEffect,useRef} from 'react';
import {readInvoiceItems,invoiceItemsTotal} from './invoiceItems';
import {readTravelDates} from './invoiceTravelDates';

export default function InvoiceEditor({record,onChange,customers,busy,onSave,onCancel}){
  const heading=useRef(null);
  useEffect(()=>{heading.current?.focus();},[]);
  const customer=customers.find(row=>row[0]===record['Customer ID']);
  const manual=record.__customerMode==='manual';
  const storedDates=readTravelDates(record['Travel dates']);
  const travelFrom=record.__travelFrom??storedDates.from,travelTo=record.__travelTo??storedDates.to;
  const legacyDates=record['Travel dates']&&!storedDates.from;
  const stored=readInvoiceItems(record.Description);
  const items=record.__tripItems??stored.items;
  const description=record.__tripItems===undefined?stored.description:record.Description;
  const amount=items.length?invoiceItemsTotal(items):Number(record.Amount)||0,paid=Number(record.Paid)||0;
  function updateItems(next){onChange(previous=>({...previous,Description:description,__tripItems:next,Amount:next.length?invoiceItemsTotal(next).toFixed(2):amount.toFixed(2)}));}
  const balance=(Math.round(amount*100)-Math.round(paid*100))/100;
  const money=value=>`INR ${value.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  function field(key,label,{required=false,type='text',placeholder,help,multiline=false}={}){
    const id='invoice-'+key.toLowerCase().replaceAll(' ','-');
    const props={id,name:key,value:(key==='Description'?description:record[key])??(key==='Paid'?'0':''),required,
      onChange:event=>onChange(previous=>({...previous,...(key==='Description'?{__tripItems:items}:{}),[key]:event.target.value})),
      'aria-describedby':help?id+'-help':undefined};
    return <label className={multiline?'invoice-field invoice-field-wide':'invoice-field'} htmlFor={id}>
      <span>{label}{required&&<span className="invoice-required"> *</span>}</span>
      {multiline?<textarea {...props} rows={3} maxLength={10000} placeholder={placeholder}/>:<input {...props} type={type} placeholder={placeholder} maxLength={500} min={type==='number'?'0':undefined} max={key==='Paid'?amount:undefined} step={type==='number'?'0.01':undefined} inputMode={type==='number'?'decimal':undefined}/>}
      {help&&<small id={id+'-help'}>{help}</small>}
    </label>;
  }
  return <form className="admin-editor admin-record-editor invoice-editor" onSubmit={onSave} aria-labelledby="invoice-editor-title">
    <header className="invoice-editor-heading"><div><p className="invoice-eyebrow">INVOICE DETAILS</p><h2 id="invoice-editor-title" ref={heading} tabIndex={-1}>{record.ID?'Edit invoice':'Create invoice'}</h2><p>Choose a customer, describe the booking, and enter the payment amounts.</p></div>{record.ID&&<span className="invoice-reference">{record.ID}</span>}</header>
    <div className="invoice-layout"><div className="invoice-sections">
      <fieldset className="invoice-section"><legend><span>1</span> Customer & invoice date</legend><p className="invoice-section-help">Fields marked * are required.</p>
      <div className="invoice-customer-mode" role="group" aria-label="Customer entry method"><button type="button" aria-pressed={!manual} disabled={busy} onClick={()=>onChange(previous=>({...previous,__customerMode:'existing'}))}>Choose existing customer</button><button type="button" aria-pressed={manual} disabled={busy} onClick={()=>onChange(previous=>({...previous,__customerMode:'manual'}))}>Enter customer manually</button></div>
      <div className="invoice-field-grid">
        {manual?field('__customerName','Customer name',{required:true,placeholder:'Enter the customer’s full name'}):<label className="invoice-field" htmlFor="invoice-customer"><span>Bill to <span className="invoice-required">*</span></span><select id="invoice-customer" name="Customer ID" value={record['Customer ID']||''} required onChange={event=>onChange(previous=>({...previous,'Customer ID':event.target.value}))}><option value="">Select a customer</option>{customers.map(row=><option key={row[0]} value={row[0]}>{row[1]||row[0]}{row[2]?' — '+row[2]:''}</option>)}{record['Customer ID']&&!customer&&<option value={record['Customer ID']}>{record['Customer ID']} (existing customer reference)</option>}</select></label>}
        {field('Date','Invoice date',{required:true,type:'date'})}
        {manual&&field('__customerPhone','Phone (optional)',{type:'tel',placeholder:'Customer phone number'})}
        {manual&&field('__customerEmail','Email (optional)',{type:'email',placeholder:'Customer email address'})}
      </div>{manual?<p className="invoice-section-help">This customer will be added to Customers when you save the invoice.</p>:customer&&<div className="invoice-customer-details"><strong>{customer[1]}</strong><p>{customer.slice(2).filter(Boolean).join(' · ')}</p></div>}{!manual&&!customers.length&&<p className="invoice-section-help">No customers yet. Choose “Enter customer manually” to add one here.</p>}</fieldset>
      <fieldset className="invoice-section"><legend><span>2</span> Travel & service</legend><div className="invoice-field-grid">
        {field('Description','Service description',{required:true,multiline:true,placeholder:'e.g. 5-day Kerala holiday package for 2 adults',help:'This description appears on the printed invoice.'})}
        <fieldset className="invoice-field-wide invoice-travel-dates"><legend>Travel dates</legend><div className="invoice-field-grid"><label className="invoice-field" htmlFor="invoice-travel-from"><span>From</span><input id="invoice-travel-from" name="__travelFrom" type="date" value={travelFrom} required={Boolean(travelTo)} max={travelTo||undefined} onChange={event=>onChange(previous=>({...previous,__travelFrom:event.target.value}))}/></label><label className="invoice-field" htmlFor="invoice-travel-to"><span>To</span><input id="invoice-travel-to" name="__travelTo" type="date" value={travelTo} required={Boolean(travelFrom)} min={travelFrom||undefined} onChange={event=>onChange(previous=>({...previous,__travelTo:event.target.value}))}/></label></div>{legacyDates&&<p className="invoice-section-help">Previously entered: {record['Travel dates']}. Choose both dates to replace it.</p>}</fieldset>
        {field('Pax','Travellers',{placeholder:'e.g. 2 adults, 1 child'})}
      </div></fieldset>
      <fieldset className="invoice-section"><legend><span>3</span> Amount & payment</legend>
      <p className="invoice-section-help">Add a destination, route or service with its price. For example: Kochi airport → Munnar, sedan cab transfer.</p>
      <div className="invoice-trip-items">{items.map((item,index)=><div className="invoice-trip-item" key={index}><label className="invoice-field"><span>Trip / service {index+1} *</span><input required maxLength={500} value={item.details} placeholder="Destination, route & service details" onChange={event=>updateItems(items.map((row,i)=>i===index?{...row,details:event.target.value}:row))}/></label><label className="invoice-field"><span>Price (INR) *</span><input required type="number" min="0" max="999999999.99" step="0.01" inputMode="decimal" value={item.price} placeholder="0.00" onChange={event=>updateItems(items.map((row,i)=>i===index?{...row,price:event.target.value}:row))}/></label><button type="button" disabled={busy} aria-label={'Remove trip / service '+(index+1)} onClick={()=>updateItems(items.filter((_,i)=>i!==index))}>Remove</button></div>)}</div>
      <button className="invoice-add-item" type="button" disabled={busy} onClick={()=>updateItems([...items,{details:'',price:''}])}>+ Add trip / service</button>
      <div className="invoice-field-grid">
        {items.length?<label className="invoice-field"><span>Total invoice amount (INR)</span><input name="Amount" value={amount.toFixed(2)} readOnly/><small>Calculated from the trip and service prices above.</small></label>:field('Amount','Total invoice amount (INR)',{required:true,type:'number',placeholder:'0.00',help:'Enter a total directly, or add trip / service rows above.'})}
        {field('Paid','Amount received (INR)',{required:true,type:'number',help:'Enter 0 if unpaid. Payment cannot exceed the invoice total.'})}
      </div><p className="invoice-section-help">The balance is calculated automatically.</p></fieldset>
      <details className="invoice-extra"><summary>Itinerary, inclusions & notes <span>Optional</span></summary><div className="invoice-field-grid">
        {field('Itinerary','Itinerary',{multiline:true,placeholder:'Day-by-day travel plan'})}
        {field('Inclusions','Included in the package',{multiline:true})}
        {field('Exclusions','Excluded from the package',{multiline:true})}
        {field('Notes','Invoice notes',{multiline:true,help:'These notes also appear on the printed invoice.'})}
      </div></details>
    </div><aside className="invoice-summary" aria-label="Invoice summary"><p className="invoice-eyebrow">AT A GLANCE</p><h3>Invoice summary</h3><p className="invoice-summary-customer">{manual?(record.__customerName||'Enter a customer name'):(customer?.[1]||'Select a customer')}</p><dl><div><dt>Invoice total</dt><dd>{money(amount)}</dd></div><div><dt>Amount received</dt><dd>{money(paid)}</dd></div><div className="invoice-summary-balance"><dt>{balance<0?'Credit balance':'Balance due'}</dt><dd><output aria-live="polite">{money(Math.abs(balance))}</output></dd></div></dl><p className="invoice-summary-note">Review the amounts before saving. You can print or download a PDF from the invoice list after saving.</p></aside></div>
    <div className="admin-editor-actions invoice-actions"><p>{record.ID?'Update this invoice when you’re ready.':'The invoice number is assigned when you save.'}</p><button type="button" disabled={busy} onClick={onCancel}>Cancel</button><button type="submit" className="pill" disabled={busy||(!manual&&!customers.length&&!record['Customer ID'])}>{busy?'Saving invoice…':record.ID?'Save changes':'Save invoice'}</button></div>
  </form>;
}
