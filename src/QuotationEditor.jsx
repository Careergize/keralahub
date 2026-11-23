import QuotationTripEditor,{itineraryText,accommodationText} from './QuotationTripEditor';
import {munnarQuotationExample} from './munnarQuotationExample';
import {useState} from 'react';
import {readQuotationDetails, quotationAmount} from './quotationDetails';
import {quotationDocument} from './quotationDocument';
import {readTravelDates,writeTravelDates} from './invoiceTravelDates';

export default function QuotationEditor({record,onChange,customers,busy,onSave,onCancel,brand}) {
  const [previewError,setPreviewError]=useState('');
  const manual=record.__customerMode==='manual';
  const customer=manual?['',record.__customerName||'',record.__customerEmail||'',record.__customerPhone||'']:customers.find(c=>c[0]===record['Customer ID']);
  const storedDates=readTravelDates(record['Travel dates']);
  const travelFrom=record.__travelFrom??storedDates.from,travelTo=record.__travelTo??storedDates.to;
  const details=record.__quotation ?? {...readQuotationDetails(record.Notes),rate:readQuotationDetails(record.Notes).rate??record.Amount??'',pricing:readQuotationDetails(record.Notes).pricing||'group',travellers:readQuotationDetails(record.Notes).travellers||'1'};
  const days=details.days??[{title:'',description:record.Itinerary||'',stay:'',meals:''}];
  const hotels=details.stays??[{destination:'',name:details.hotels||'',nights:'',room:'',meals:''}];
  function updateDays(next){onChange(p=>({...p,Itinerary:itineraryText(next),__quotation:{...details,days:next}}));}
  function updateHotels(next){onChange(p=>({...p,__quotation:{...details,stays:next,hotels:accommodationText(next)}}));}
  function useMunnarExample(){
    const example=structuredClone(munnarQuotationExample);
    onChange(previous=>({...previous,Description:example.Description,Pax:example.Pax,Inclusions:example.Inclusions,Exclusions:example.Exclusions,Itinerary:itineraryText(example.details.days),__quotation:{...example.details,hotels:accommodationText(example.details.stays)}}));
    setPreviewError('');
  }
  const update=(key,value)=>onChange(previous=>({...previous,__quotation:{...details,[key]:value}}));
  function field(key,label,{extra=false,area=false,required=false,type='text',...props}={}) {
    return <label className={'invoice-field'+(area?' invoice-field-wide':'')}><span>{label}{required?' *':''}</span>{area?<textarea aria-label={label} rows={4} maxLength={6000} value={(extra?details[key]:record[key])||''} onChange={e=>extra?update(key,e.target.value):onChange(p=>({...p,[key]:e.target.value}))} required={required} {...props}/>:<input aria-label={label} type={type} maxLength={500} value={(extra?details[key]:record[key])??''} onChange={e=>extra?update(key,e.target.value):onChange(p=>({...p,[key]:e.target.value}))} required={required} {...props}/>}</label>;
  }
  const section=(number,title,children)=><fieldset className="invoice-section"><legend><span>{number}</span> {title}</legend><div className="invoice-field-grid">{children}</div></fieldset>;
  function preview(){
    let travelDates=record['Travel dates'];
    try {if(travelFrom||travelTo||record.__travelFrom!==undefined||record.__travelTo!==undefined)travelDates=writeTravelDates(travelFrom,travelTo);}catch(error){setPreviewError(error.message);return;}
    setPreviewError('');
    const win=window.open('','_blank');
    if(!win){setPreviewError('Allow popups to preview the quotation.');return;}
    const url=URL.createObjectURL(new Blob([quotationDocument({record:{...record,'Travel dates':travelDates,Amount:quotationAmount(details)},details,customer:customer||[],brand})],{type:'text/html'}));
    win.location.replace(url);
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  return <form className="admin-editor admin-record-editor invoice-editor" onSubmit={onSave}>
    <header className="invoice-editor-heading"><div><p className="invoice-eyebrow">CUSTOMER TRAVEL PROPOSAL</p><h2>{record.ID?'Edit quotation':'Create quotation'}</h2><p>Build an itinerary and quote, then print or save it as a PDF for your customer.</p></div></header>
    {!record.ID&&<div className="quotation-example"><div><strong>Start with a Munnar trip example</strong><p>2 nights / 3 days · 2 adults · sample price INR 19,000. Replaces tour details; review before sharing.</p></div><button type="button" disabled={busy} onClick={useMunnarExample}>Use Munnar example</button></div>}
    <div className="invoice-layout"><div className="invoice-sections">
      {section(1,'Customer & tour',<>
        <div className="invoice-customer-mode invoice-field-wide" role="group" aria-label="Customer entry method"><button type="button" aria-pressed={!manual} disabled={busy} onClick={()=>onChange(p=>({...p,__customerMode:'existing'}))}>Choose existing customer</button><button type="button" aria-pressed={manual} disabled={busy} onClick={()=>onChange(p=>({...p,__customerMode:'manual'}))}>Enter customer manually</button></div>
        {manual?field('__customerName','Customer name',{required:true,placeholder:'Enter the customer’s full name'}):<label className="invoice-field"><span>Customer *</span><select aria-label="Customer" required disabled={busy} value={record['Customer ID']||''} onChange={e=>onChange(p=>({...p,'Customer ID':e.target.value}))}><option value="">Choose customer</option>{customers.map(c=><option key={c[0]} value={c[0]}>{c[1]||c[0]}</option>)}{record['Customer ID']&&!customer&&<option value={record['Customer ID']}>{record['Customer ID']} (existing customer reference)</option>}</select></label>}
        {field('Date','Quotation date',{type:'date',required:true})}
        {manual&&field('__customerPhone','Phone (optional)',{type:'tel',placeholder:'Customer phone number'})}
        {manual&&field('__customerEmail','Email (optional)',{type:'email',placeholder:'Customer email address'})}
        {manual?<p className="invoice-section-help invoice-field-wide">This customer will be added to Customers when you save the quotation.</p>:!customers.length&&<p className="invoice-section-help invoice-field-wide">No customers yet. Choose “Enter customer manually” to add one here.</p>}
        {field('Description','Tour / package title',{required:true,placeholder:'e.g. 4 nights / 5 days - Kerala escape'})}
        {field('validUntil','Valid until',{extra:true,type:'date',min:record.Date||undefined})}
        <fieldset className="invoice-field-wide invoice-travel-dates"><legend>Travel dates</legend><div className="invoice-field-grid"><label className="invoice-field"><span>From</span><input name="__travelFrom" type="date" value={travelFrom} max={travelTo||undefined} required={Boolean(travelTo)} onChange={e=>onChange(p=>({...p,__travelFrom:e.target.value}))}/></label><label className="invoice-field"><span>To</span><input name="__travelTo" type="date" value={travelTo} min={travelFrom||undefined} required={Boolean(travelFrom)} onChange={e=>onChange(p=>({...p,__travelTo:e.target.value}))}/></label></div>{record['Travel dates']&&!storedDates.from&&<p className="invoice-section-help">Previously entered: {record['Travel dates']}. Select both dates to replace it.</p>}</fieldset>
        {field('Pax','Traveller details',{placeholder:'e.g. 8 adults, twin sharing'})}
        {field('overview','Tour introduction',{extra:true,area:true})}
        {field('coverImage','Destination cover image URL',{extra:true,type:'url',pattern:'https?://.+',placeholder:'https://example.com/kerala.jpg'})}
        {/^https?:\/\//i.test(details.coverImage||'')&&<img key={details.coverImage} className="quotation-image-preview invoice-field-wide" src={details.coverImage} alt="Destination cover preview" onError={e=>{e.currentTarget.style.display='none';}}/>}
        <p className="invoice-section-help invoice-field-wide">Paste a direct, publicly accessible image URL. The cover photo and optional day photos appear in the quotation PDF.</p>
      </>)}
      {section(2,'Itinerary & accommodation',<>
        <QuotationTripEditor days={days} hotels={hotels} onDays={updateDays} onHotels={updateHotels} busy={busy}/>
      </>)}
      {section(3,'Package pricing',<>
        <label className="invoice-field"><span>Pricing basis</span><select value={details.pricing} onChange={e=>update('pricing',e.target.value)}><option value="group">Total package / group</option><option value="person">Per person</option></select></label>
        {field('travellers','Number of travellers',{extra:true,required:true,type:'number',min:1,max:10000,step:1})}
        {field('rate',details.pricing==='person'?'Rate per person (INR)':'Package price (INR)',{extra:true,required:true,type:'number',min:0,max:999999999.99,step:'0.01'})}
        {field('Inclusions','Inclusions',{area:true,placeholder:'One inclusion per line. Specify whether taxes are included.'})}
        {field('Exclusions','Exclusions',{area:true})}
      </>)}
      {section(4,'Terms & travel notes',<>
        {field('terms','Payment, cancellation & booking terms',{extra:true,area:true,placeholder:'Enter your approved payment schedule, cancellation policy, refund conditions and booking terms.'})}
        {field('tips','Traveller tips & essentials',{extra:true,area:true})}
        {field('notes','Additional customer notes',{extra:true,area:true})}
      </>)}
    </div><aside className="invoice-summary"><p className="invoice-eyebrow">QUOTATION SUMMARY</p><h3>{record.Description||'Your travel proposal'}</h3><p>{customer?.[1]||(manual?'Enter a customer name':'Choose a customer')}</p><dl><div><dt>Travellers</dt><dd>{details.travellers}</dd></div><div><dt>Pricing</dt><dd>{details.pricing==='person'?'Per person':'Group total'}</dd></div><div className="invoice-summary-balance"><dt>Package total</dt><dd>INR {quotationAmount(details).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</dd></div></dl><p className="invoice-summary-note">Review the proposal before sharing. Preview opens a printable document; use Save as PDF in the print dialog.</p><button type="button" onClick={preview}>Preview / PDF</button>{previewError&&<p role="alert">{previewError}</p>}</aside></div>
    <div className="admin-editor-actions invoice-actions"><button type="button" disabled={busy} onClick={onCancel}>Cancel</button><button className="pill" type="submit" disabled={busy}>{busy?'Saving…':'Save quotation'}</button></div>
  </form>;
}
