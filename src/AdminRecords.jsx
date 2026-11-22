import {invoiceDocument} from './invoiceDocument';
import InvoiceEditor from './InvoiceEditor';
import {readInvoiceItems,writeInvoiceItems,invoiceItemsTotal} from './invoiceItems';
import {writeTravelDates} from './invoiceTravelDates';
import {useEffect, useState} from 'react';
import {adminApi, sessionKey} from './adminApi';
import cmsSchema from './cmsSchema.json';
import {useSetting} from './siteContent';

const statuses = {Bookings:['Pending','Confirmed','Completed','Cancelled'], Enquiries:['New','Processing','Pending','Converted','Closed'], Packages:['Active','Inactive'],Subscribers:['Subscribed','Unsubscribed']};
const multiline = ['Itinerary','Inclusions','Exclusions','Notes','Message','Description','Body','Quote','Value','Options'];

export default function AdminRecords({view}) {
  const brandName=useSetting('brandName'),address=useSetting('address'),currency=useSetting('currency');
  const logoUrl=useSetting('logoUrl'),phone=useSetting('phone'),email=useSetting('email');
  const [data, setData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [query,setQuery]=useState('');
  const [enquiryTab,setEnquiryTab]=useState('All');
  const enquiryStatus=value=>value==='Open'||!value?'New':value==='Follow-up'?'Processing':value;
  const enquiryRows=(data?.rows||[]).map(row=>Object.fromEntries((data?.columns||[]).map((key,i)=>[key,row[i]])));
  const visibleEnquiries=enquiryRows.filter(record=>(enquiryTab==='All'||enquiryStatus(record.Status)===enquiryTab)&&Object.values(record).concat(customers.find(c=>c[0]===record['Customer ID'])||[]).join(' ').toLowerCase().includes(query.toLowerCase()));
  const cms=Object.prototype.hasOwnProperty.call(cmsSchema,view);
  const token = sessionStorage.getItem(sessionKey);

  useEffect(() => {
    let active = true;
    setData(null); setEditing(null); setError('');
    Promise.all([
      adminApi('loadView', {token, view}),
      view === 'Dashboard' ? Promise.resolve({rows:[]}) : adminApi('loadView', {token, view:'Customers'}),
    ]).then(([result, customerData]) => {
      if (active) { setData(result); setCustomers(customerData.rows); }
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [view, token, revision]);

  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    const values = {...editing, ...Object.fromEntries(new FormData(event.currentTarget))};
    if (editing.ID) values.ID = editing.ID;
    try {
      if(view==='Invoices'){
        const from=values.__travelFrom||'',to=values.__travelTo||'';
        if(from||to||Object.prototype.hasOwnProperty.call(editing,'__travelFrom')||Object.prototype.hasOwnProperty.call(editing,'__travelTo'))values['Travel dates']=writeTravelDates(from,to);
        delete values.__travelFrom;
        delete values.__travelTo;
        const stored=readInvoiceItems(editing.Description);
        const items=values.__tripItems??stored.items;
        values.Description=writeInvoiceItems(values.Description,items);
        if(items.length)values.Amount=invoiceItemsTotal(items).toFixed(2);
        delete values.__tripItems;
        if(values.Description.length>10000)throw new Error('Please shorten the invoice description or trip details.');
      }
      if(view==='Invoices'&&values.__customerMode==='manual'){
        const customerValues={Name:String(values.__customerName||'').trim(),Email:String(values.__customerEmail||'').trim(),Phone:String(values.__customerPhone||'').trim()};
        if(!customerValues.Name)throw new Error('Enter the customer’s name.');
        const result=await adminApi('saveRecord',{token,table:'Customers',values:customerValues});
        if(!result?.id)throw new Error('The customer could not be linked. Please try again.');
        values['Customer ID']=result.id;
        values.__customerMode='existing';
        setCustomers(previous=>[...previous,[result.id,customerValues.Name,customerValues.Email,customerValues.Phone]]);
        // Keep the saved customer on retry if saving the invoice fails.
        setEditing(previous=>({...previous,'Customer ID':result.id,__customerMode:'existing'}));
      }
      for(const key of Object.keys(values))if(key.startsWith('__customer'))delete values[key];
      await adminApi('saveRecord', {token, table:view, values});
      window.dispatchEvent(new Event('kerala-content-changed'));
      setEditing(null); setRevision(n => n + 1);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function remove(row) {
    if (!window.confirm('Delete '+view+' record "'+(row[1]||row[0])+'"? This cannot be undone.')) return;
    setBusy(true);setError('');
    try {
      await adminApi('deleteRecord',{token,table:view,id:row[0]});
      setRevision(n=>n+1);window.dispatchEvent(new Event('kerala-content-changed'));
    } catch(e){setError(e.message);} finally{setBusy(false);}
  }

  async function changeEnquiryStatus(record,status) {
    setBusy(true);setError('');
    try {
      await adminApi('saveRecord',{token,table:'Enquiries',values:{...record,Status:status}});
      setData(previous=>({...previous,rows:previous.rows.map(row=>row[0]===record.ID?row.map((value,i)=>previous.columns[i]==='Status'?status:value):row)}));
      window.dispatchEvent(new Event('kerala-content-changed'));
    } catch(e){setError(e.message);} finally{setBusy(false);}
  }

  function printRecord(row) {
    const win = window.open('', '_blank');
    if (!win) { setError('Allow popups to print this document.'); return; }
    const record = Object.fromEntries(data.columns.map((key, i) => [key, row[i]]));
    const customer = customers.find(c => c[0] === record['Customer ID']) || [];
    win.document.open();
    win.document.write(invoiceDocument({record, customer, brand:{name:brandName,address,currency,logoUrl,phone,email}, quotation:view === 'Quotations'}));
    win.document.close();
  }

  return <div className="admin-records">
    {error && <p role="alert" className="my-4 text-red-700">{error} <button onClick={() => setRevision(n => n+1)}>Retry loading</button></p>}
    {!data && !error && <p role="status" className="mt-4">Loading records…</p>}
    {data?.counts && <dl className="mt-8 grid gap-4 sm:grid-cols-2">{data.counts.map(([label,count]) => <div key={label} className="rounded-xl bg-white p-5"><dt>{label}</dt><dd className="text-3xl font-semibold">{count}</dd></div>)}</dl>}
    {data?.columns && <>
      {cms&&<p className="my-4 rounded-xl bg-white p-4 text-sm">Only Published records appear publicly. Sort order controls display order. Changes appear within 30 seconds or on refresh.{view==='Pages'&&' All public pages use PageSections. Paths use leading and trailing slashes, such as /about-us/.'}{view==='PageSections'&&' Page is the page path. Type controls the layout. Cards, Gallery and FAQ use Media rows whose Group matches this section Key. Override is legacy and not rendered.'}{view==='FormFields'&&' Form is the form Key. Select Options are separated with |. The name, email, destination and message fields must remain published for the form to work.'}{view==='Navigation'&&' Location selects the menu. Group creates a submenu. Links to unpublished pages are hidden automatically.'}{view==='Media'&&' Group matches a Cards, Gallery or FAQ section Key. Use credits for reusable image attribution.'}</p>}
      <div className="admin-toolbar"><label className="admin-search">Search records<input type="search" className="rounded-lg border bg-white p-2" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records…"/></label>
      <button className="pill admin-new-record" disabled={busy||Boolean(editing)} onClick={() => setEditing(view==='Enquiries'?{Status:'New'}:view==='Invoices'?{Date:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),Paid:'0'}:{})}>{view==='Invoices'?'+ Create invoice':'+ New record'}</button></div>
      {editing && (view==='Invoices'?<InvoiceEditor record={editing} onChange={setEditing} customers={customers} busy={busy} onSave={save} onCancel={()=>setEditing(null)}/>:<form className="admin-editor admin-record-editor" onSubmit={save} aria-label={editing.ID?'Edit record':'New record'}>
        <h2>{editing.ID ? 'Edit record' : 'New record'}</h2>
        {data.columns.filter(key => !['ID','Balance','Created','Submission ID'].includes(key)).map(key => {
          const required = (cms?['Status']:['Name','Customer ID','Service','Status','Date','Description','Amount','Paid']).includes(key);
          const selections={Status:cms?['Draft','Published','Archived']:statuses[view],Mode:['Built-in','Custom'],Featured:['Yes','No'],'Show in menu':['Yes','No'],WhatsApp:['Yes','No'],Required:['Yes','No'],Collection:['Tours','Experiences','Destinations','Hotels','Vehicles','VisaOptions','Offers','Testimonials'],Target:['_self','_blank']};
          if(view==='Navigation')selections.Location=['Header','Header actions','Footer explore','Footer plan','Footer social'];
          if(key==='Type')selections.Type=view==='FormFields'?['text','email','tel','date','number','textarea','select']:['Hero','Search','Text','Split','Image','Video','Collection','Gallery','Cards','FAQ','Map','Form','Override'];
          const options = key === 'Customer ID' ? customers.map(c => [c[0],c[1] + ' — ' + c[0]]) : selections[key]?.map(s=>[s,s]);
          const attrs = {name:key, value:(view==='Enquiries'&&key==='Status'?enquiryStatus(editing[key]):editing[key]) ?? (key === 'Paid' ? '0' : key==='Status'&&cms?'Draft':''), required, onChange:e => setEditing(prev => ({...prev, [key]:e.target.value}))};
          return <label key={key}>{key}{['Amount','Paid'].includes(key) && ' (INR)'}
            {options ? <select {...attrs}><option value="">Choose…</option>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>
              : multiline.includes(key) ? <textarea {...attrs} maxLength={10000}/>
              : <input {...attrs} maxLength={500} type={key === 'Date' ? 'date' : ['Amount','Paid'].includes(key) ? 'number' : key === 'Email' ? 'email' : 'text'} min={['Amount','Paid'].includes(key) ? '0' : undefined} step={['Amount','Paid'].includes(key) ? '0.01' : undefined}/>}
          </label>;
        })}
        <div className="admin-editor-actions flex gap-3"><button className="pill" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</button></div>
      </form>)}
      {view==='Enquiries'?<>
        <div className="enquiry-tabs" role="group" aria-label="Filter enquiries by status">{['All','New','Processing','Pending'].map(status=><button key={status} type="button" aria-pressed={enquiryTab===status} onClick={()=>setEnquiryTab(status)}>{status}<span>{enquiryRows.filter(record=>status==='All'||enquiryStatus(record.Status)===status).length}</span></button>)}</div>
        {!visibleEnquiries.length?<p className="admin-empty">No enquiries match this view.</p>:<div className="enquiry-cards">{visibleEnquiries.map(record=>{const customer=customers.find(c=>c[0]===record['Customer ID']);return <article className="enquiry-card" key={record.ID}><div className="enquiry-card-top"><div><h3>{customer?.[1]||record['Customer ID']}</h3><p className="enquiry-reference">{record.ID}</p></div><span className={'enquiry-badge enquiry-badge-'+enquiryStatus(record.Status).toLowerCase()}>{enquiryStatus(record.Status)}</span></div><p className="enquiry-contact">{customer?.slice(2).filter(Boolean).join(' · ')}</p><h4>{record.Destination||record.Service||'Travel enquiry'}</h4>{record.Created&&<p className="enquiry-reference">Received: {record.Created}</p>}<details className="enquiry-details"><summary>View enquiry details</summary><p>{record.Message||'No message provided.'}</p>{record.Service&&<p>Source: {record.Service}</p>}</details><div className="enquiry-card-actions"><label>Status<select value={enquiryStatus(record.Status)} disabled={busy} onChange={e=>changeEnquiryStatus(record,e.target.value)}>{statuses.Enquiries.map(status=><option key={status}>{status}</option>)}</select></label><button type="button" className="underline" disabled={busy} onClick={()=>setEditing({...record,Status:enquiryStatus(record.Status)})}>Edit</button><button type="button" className="text-red-700 underline" disabled={busy} onClick={()=>remove(data.rows.find(row=>row[0]===record.ID))}>Delete</button></div></article>;})}</div>}
      </>:<>{!data.rows.filter(row=>row.join(' ').toLowerCase().includes(query.toLowerCase())).length ? <p className="admin-empty">{query?'No matching records. Try another search.':'No records yet. Create your first record above.'}</p> : <div className="admin-table-scroll"><table className="admin-table"><thead><tr>{data.columns.filter(c => c !== 'Submission ID').map(c => <th scope="col" key={c}>{c}</th>)}<th scope="col">Actions</th></tr></thead><tbody>{data.rows.filter(row=>row.join(' ').toLowerCase().includes(query.toLowerCase())).map(row => <tr key={row[0]}>{row.map((value,i) => data.columns[i] === 'Submission ID' ? null : <td key={i} data-label={data.columns[i]} className={data.columns[i]==='ID'?'record-id':data.columns[i]==='Status'?'record-status':undefined}><span>{value||'—'}</span></td>)}<td className="record-actions" data-label="Actions"><button className="underline" disabled={busy} onClick={() => setEditing(Object.fromEntries(data.columns.map((key,i) => [key,row[i]])))}>Edit</button><button className="ml-3 text-red-700 underline" disabled={busy} onClick={()=>remove(row)}>Delete</button>{['Invoices','Quotations'].includes(view) && <button className="ml-3 underline" onClick={() => printRecord(row)}>Print / PDF</button>}</td></tr>)}</tbody></table></div>}</>}
    </>}
  </div>;
}
