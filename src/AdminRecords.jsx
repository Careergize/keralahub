import {useEffect, useState} from 'react';
import {adminApi, sessionKey} from './adminApi';
import cmsSchema from './cmsSchema.json';
import {useSetting} from './siteContent';

const statuses = {Bookings:['Pending','Confirmed','Completed','Cancelled'], Enquiries:['Open','Follow-up','Converted','Closed'], Packages:['Active','Inactive'],Subscribers:['Subscribed','Unsubscribed']};
const multiline = ['Itinerary','Inclusions','Exclusions','Notes','Message','Description','Body','Quote','Value','Options'];

export default function AdminRecords({view}) {
  const brandName=useSetting('brandName'),address=useSetting('address'),currency=useSetting('currency');
  const [data, setData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [query,setQuery]=useState('');
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

  function printRecord(row) {
    const win = window.open('', '_blank');
    if (!win) { setError('Allow popups to print this document.'); return; }
    const doc = win.document;
    const add = (tag, text) => { const el = doc.createElement(tag); el.textContent = text; doc.body.append(el); return el; };
    doc.title = view + ' ' + row[0];
    const style = doc.createElement('style');
    style.textContent = 'body{font:15px system-ui;max-width:800px;margin:40px auto;color:#203625}h1{border-bottom:3px solid #285138}p{white-space:pre-wrap;overflow-wrap:anywhere}@media print{button{display:none}body{margin:15mm}}';
    doc.head.append(style);
    if(brandName)add('h1',brandName);
    if(address)add('p',address);
    add('h2',view === 'Invoices' ? 'Invoice' : 'Tour quotation');
    data.columns.forEach((key,i) => {
      add('h3', key);
      const customer = key === 'Customer ID' && customers.find(c => c[0] === row[i]);
      add('p', customer ? customer.slice(1).filter(Boolean).join(' | ') : ['Amount','Paid','Balance'].includes(key) ? currency+' '+Number(row[i]).toFixed(2) : row[i]);
    });
    add('button','Print / Save as PDF').onclick = () => win.print();
    doc.close();
  }

  return <div className="admin-records">
    {error && <p role="alert" className="my-4 text-red-700">{error} <button onClick={() => setRevision(n => n+1)}>Retry loading</button></p>}
    {!data && !error && <p role="status" className="mt-4">Loading records…</p>}
    {data?.counts && <dl className="mt-8 grid gap-4 sm:grid-cols-2">{data.counts.map(([label,count]) => <div key={label} className="rounded-xl bg-white p-5"><dt>{label}</dt><dd className="text-3xl font-semibold">{count}</dd></div>)}</dl>}
    {data?.columns && <>
      {cms&&<p className="my-4 rounded-xl bg-white p-4 text-sm">Only Published records appear publicly. Sort order controls display order. Changes appear within 30 seconds or on refresh.{view==='Pages'&&' All public pages use PageSections. Paths use leading and trailing slashes, such as /about-us/.'}{view==='PageSections'&&' Page is the page path. Type controls the layout. Cards, Gallery and FAQ use Media rows whose Group matches this section Key. Override is legacy and not rendered.'}{view==='FormFields'&&' Form is the form Key. Select Options are separated with |. The name, email, destination and message fields must remain published for the form to work.'}{view==='Navigation'&&' Location selects the menu. Group creates a submenu. Links to unpublished pages are hidden automatically.'}{view==='Media'&&' Group matches a Cards, Gallery or FAQ section Key. Use credits for reusable image attribution.'}</p>}
      <div className="admin-toolbar"><label className="admin-search">Search records<input type="search" className="rounded-lg border bg-white p-2" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records…"/></label>
      <button className="pill admin-new-record" disabled={busy} onClick={() => setEditing({})}>+ New record</button></div>
      {editing && <form className="admin-editor admin-record-editor" onSubmit={save} aria-label={editing.ID?'Edit record':'New record'}>
        <h2>{editing.ID ? 'Edit record' : 'New record'}</h2>
        {data.columns.filter(key => !['ID','Balance','Created','Submission ID'].includes(key)).map(key => {
          const required = (cms?['Status']:['Name','Customer ID','Service','Status','Date','Description','Amount','Paid']).includes(key);
          const selections={Status:cms?['Draft','Published','Archived']:statuses[view],Mode:['Built-in','Custom'],Featured:['Yes','No'],'Show in menu':['Yes','No'],WhatsApp:['Yes','No'],Required:['Yes','No'],Collection:['Tours','Experiences','Destinations','Hotels','Vehicles','VisaOptions','Offers','Testimonials'],Target:['_self','_blank']};
          if(view==='Navigation')selections.Location=['Header','Header actions','Footer explore','Footer plan','Footer social'];
          if(key==='Type')selections.Type=view==='FormFields'?['text','email','tel','date','number','textarea','select']:['Hero','Search','Text','Split','Image','Video','Collection','Gallery','Cards','FAQ','Map','Form','Override'];
          const options = key === 'Customer ID' ? customers.map(c => [c[0],c[1] + ' — ' + c[0]]) : selections[key]?.map(s=>[s,s]);
          const attrs = {name:key, value:editing[key] ?? (key === 'Paid' ? '0' : key==='Status'&&cms?'Draft':''), required, onChange:e => setEditing(prev => ({...prev, [key]:e.target.value}))};
          return <label key={key}>{key}{['Amount','Paid'].includes(key) && ' (INR)'}
            {options ? <select {...attrs}><option value="">Choose…</option>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>
              : multiline.includes(key) ? <textarea {...attrs} maxLength={10000}/>
              : <input {...attrs} maxLength={500} type={key === 'Date' ? 'date' : ['Amount','Paid'].includes(key) ? 'number' : key === 'Email' ? 'email' : 'text'} min={['Amount','Paid'].includes(key) ? '0' : undefined} step={['Amount','Paid'].includes(key) ? '0.01' : undefined}/>}
          </label>;
        })}
        <div className="admin-editor-actions flex gap-3"><button className="pill" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</button></div>
      </form>}
      {!data.rows.filter(row=>row.join(' ').toLowerCase().includes(query.toLowerCase())).length ? <p className="admin-empty">{query?'No matching records. Try another search.':'No records yet. Create your first record above.'}</p> : <div className="admin-table-scroll"><table className="admin-table"><thead><tr>{data.columns.filter(c => c !== 'Submission ID').map(c => <th scope="col" key={c}>{c}</th>)}<th scope="col">Actions</th></tr></thead><tbody>{data.rows.filter(row=>row.join(' ').toLowerCase().includes(query.toLowerCase())).map(row => <tr key={row[0]}>{row.map((value,i) => data.columns[i] === 'Submission ID' ? null : <td key={i} data-label={data.columns[i]} className={data.columns[i]==='ID'?'record-id':data.columns[i]==='Status'?'record-status':undefined}><span>{value||'—'}</span></td>)}<td className="record-actions" data-label="Actions"><button className="underline" disabled={busy} onClick={() => setEditing(Object.fromEntries(data.columns.map((key,i) => [key,row[i]])))}>Edit</button><button className="ml-3 text-red-700 underline" disabled={busy} onClick={()=>remove(row)}>Delete</button>{['Invoices','Quotations'].includes(view) && <button className="ml-3 underline" onClick={() => printRecord(row)}>Print / PDF</button>}</td></tr>)}</tbody></table></div>}
    </>}
  </div>;
}
