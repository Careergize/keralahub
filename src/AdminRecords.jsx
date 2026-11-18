import {useEffect, useState} from 'react';
import {adminApi, sessionKey} from './adminApi';

const statuses = {Bookings:['Pending','Confirmed','Completed','Cancelled'], Enquiries:['Open','Follow-up','Converted','Closed'], Packages:['Active','Inactive']};
const multiline = ['Itinerary','Inclusions','Exclusions','Notes'];

export default function AdminRecords({view}) {
  const [data, setData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
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
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (editing.ID) values.ID = editing.ID;
    try {
      await adminApi('saveRecord', {token, table:view, values});
      setEditing(null); setRevision(n => n + 1);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
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
    add('h1','KERALA HUB HOLIDAYS'); add('h2',view === 'Invoices' ? 'Invoice' : 'Tour quotation');
    data.columns.forEach((key,i) => {
      add('h3', key);
      const customer = key === 'Customer ID' && customers.find(c => c[0] === row[i]);
      add('p', customer ? customer.slice(1).filter(Boolean).join(' | ') : ['Amount','Paid','Balance'].includes(key) ? 'INR ' + Number(row[i]).toFixed(2) : row[i]);
    });
    add('button','Print / Save as PDF').onclick = () => win.print();
    doc.close();
  }

  return <div>
    {error && <p role="alert" className="my-4 text-red-700">{error} <button onClick={() => setRevision(n => n+1)}>Retry loading</button></p>}
    {!data && !error && <p role="status" className="mt-4">Loading records…</p>}
    {data?.counts && <dl className="mt-8 grid gap-4 sm:grid-cols-2">{data.counts.map(([label,count]) => <div key={label} className="rounded-xl bg-white p-5"><dt>{label}</dt><dd className="text-3xl font-semibold">{count}</dd></div>)}</dl>}
    {data?.columns && <>
      <button className="pill mt-4" disabled={busy} onClick={() => setEditing({})}>New record</button>
      {editing && <form className="admin-editor" onSubmit={save}>
        <h2>{editing.ID ? 'Edit record' : 'New record'}</h2>
        {data.columns.filter(key => !['ID','Balance'].includes(key)).map(key => {
          const required = ['Name','Customer ID','Service','Status','Date','Description','Amount','Paid'].includes(key);
          const options = key === 'Customer ID' ? customers.map(c => [c[0],c[1] + ' — ' + c[0]]) : key === 'Status' ? statuses[view].map(s => [s,s]) : null;
          const attrs = {name:key, value:editing[key] ?? (key === 'Paid' ? '0' : ''), required, onChange:e => setEditing(prev => ({...prev, [key]:e.target.value}))};
          return <label key={key}>{key}{['Amount','Paid'].includes(key) && ' (INR)'}
            {options ? <select {...attrs}><option value="">Choose…</option>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>
              : multiline.includes(key) ? <textarea {...attrs} maxLength={10000}/>
              : <input {...attrs} maxLength={500} type={key === 'Date' ? 'date' : ['Amount','Paid'].includes(key) ? 'number' : key === 'Email' ? 'email' : 'text'} min={['Amount','Paid'].includes(key) ? '0' : undefined} step={['Amount','Paid'].includes(key) ? '0.01' : undefined}/>}
          </label>;
        })}
        <div className="flex gap-3"><button className="pill" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</button></div>
      </form>}
      {!data.rows.length ? <p className="mt-4">No records yet.</p> : <div className="overflow-auto"><table className="admin-table"><thead><tr>{data.columns.map(c => <th scope="col" key={c}>{c}</th>)}<th scope="col">Actions</th></tr></thead><tbody>{data.rows.map(row => <tr key={row[0]}>{row.map((value,i) => <td key={i}>{value}</td>)}<td><button className="underline" disabled={busy} onClick={() => setEditing(Object.fromEntries(data.columns.map((key,i) => [key,row[i]])))}>Edit</button>{['Invoices','Quotations'].includes(view) && <button className="ml-3 underline" onClick={() => printRecord(row)}>Print / PDF</button>}</td></tr>)}</tbody></table></div>}
    </>}
  </div>;
}
