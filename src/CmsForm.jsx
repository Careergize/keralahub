import React,{useRef,useState} from 'react';
import {adminApi} from './adminApi';
import {useCollection,useSetting} from './siteContent';
import {whatsappUrl} from './whatsapp';
const coreNames=['name','email','phone','destination','message'];
export default function CmsForm({formKey,initial={},context='',variant=''}) {
  const configured=useCollection('Forms').find(row=>row.Key===formKey);
  const fields=useCollection('FormFields').filter(row=>row.Form===formKey);
  const phone=useSetting('whatsappNumber').replace(/\D/g,'');
  const choose=useSetting('ui.choose'),saving=useSetting('ui.saving'),savedText=useSetting('ui.enquirySaved');
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
  const submission=useRef('');
  if(!configured)return null;
  if(!['name','email','destination','message'].every(name=>fields.some(field=>field.Name===name)))return <p role="status">This form is not configured completely. Please contact the site administrator.</p>;
  async function submit(event){
    event.preventDefault();if(busy)return;
    const values=Object.fromEntries(new FormData(event.currentTarget));
    if(!submission.current)submission.current=crypto.randomUUID();
    const extras=fields.filter(field=>!coreNames.includes(field.Name)).map(field=>field.Label+': '+(values[field.Name]||'')).join('\n');
    const message=[context,values.message,extras].filter(Boolean).join('\n\n');
    setBusy(true);setError('');
    try{
      const result=await adminApi('submitContact',{...values,message,form:formKey,submissionId:submission.current});
      if(!result?.saved)throw new Error('Unable to save your enquiry. Please retry.');
      setSaved(true);
      if(configured.WhatsApp==='Yes'&&phone){
        const text=[configured.Title,...fields.map(field=>field.Label+': '+(values[field.Name]||'')),context].filter(Boolean).join('\n');
        window.location.assign(whatsappUrl(text,phone));
      }
    }catch(error){setError(error.message);}finally{setBusy(false);}
  }
  return <form className={variant==='contact'?'contact-sheet-form text-left text-neutral-900':'admin-editor text-left text-neutral-900'} onSubmit={submit} onChange={()=>{submission.current='';setSaved(false);}}>
    {configured.Title&&<h2 className="text-2xl">{configured.Title}</h2>}
    {configured.Description&&<p className="whitespace-pre-wrap">{configured.Description}</p>}
    <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
      {fields.map(field=>{
        const attrs={name:field.Name,defaultValue:initial[field.Name]||'',required:field.Required==='Yes'||['name','email','destination','message'].includes(field.Name)};
        return <label className={field.Type==='textarea'?'sm:col-span-2':''} key={field.ID}>{field.Label}
          {field.Type==='select'?<select {...attrs}><option value="">{choose}</option>{(field.Options||'').split('|').filter(Boolean).map(value=><option key={value}>{value}</option>)}</select>:field.Type==='textarea'?<textarea {...attrs} rows={variant==='contact'?5:undefined} maxLength={field.Name==='message'?6000:1000}/>:<input {...attrs} type={['text','email','tel','date','number'].includes(field.Type)?field.Type:'text'} maxLength={field.Name==='email'?254:field.Name==='phone'?50:150}/>}
        </label>;
      })}
      <input name="website" hidden tabIndex={-1} autoComplete="off"/>
      {configured['Button label']&&<button className="pill justify-self-start" disabled={busy}>{busy?saving:configured['Button label']}</button>}
    </fieldset>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    {saved&&savedText&&<p role="status">{savedText}</p>}
  </form>;
}
