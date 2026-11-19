import React,{useState} from 'react';
import {MessageCircle} from 'lucide-react';
import {useCollection,useSetting,mediaUrl} from './siteContent';
import {Dialog} from './CmsPageFrame';
import CmsForm from './CmsForm';
import {Credit} from './ContentCollection';
export default function HouseboatHero({section,formSection}){
 const fields=useCollection('FormFields').filter(row=>row.Form===formSection?.Form&&!['name','email','phone'].includes(row.Name));
 const forms=useCollection('Forms'),media=useCollection('Media'),choose=useSetting('ui.choose');
 const form=forms.find(row=>row.Key===formSection?.Form),[initial,setInitial]=useState(null);
 return <><section id={section.Key} className="houseboat-hero" style={mediaUrl(section['Image URL'])?{backgroundImage:`linear-gradient(#0009,#0009),url(${mediaUrl(section['Image URL'])})`}:undefined}>{section.Title&&<h1>{section.Title}</h1>}{section.Body&&<p>{section.Body}</p>}{form&&fields.length>0&&<form className="houseboat-trip-form" onSubmit={event=>{event.preventDefault();setInitial(Object.fromEntries(new FormData(event.currentTarget)));}}>{fields.map(field=><label key={field.ID}>{field.Label}{field.Type==='select'?<select name={field.Name} required={field.Required==='Yes'}><option value="">{choose}</option>{(field.Options||'').split('|').filter(Boolean).map(option=><option key={option}>{option}</option>)}</select>:<input name={field.Name} type={['date','number','email','tel'].includes(field.Type)?field.Type:'text'} min={field.Type==='number'?1:undefined} required={field.Required==='Yes'}/>}</label>)}{form['Button label']&&<button className="pill"><MessageCircle size={17}/>{form['Button label']}</button>}</form>}</section><div className="wrap houseboat-credit"><Credit image={media.find(row=>row['Image URL']===section['Image URL'])}/></div>{initial&&<Dialog title={form?.Title} onClose={()=>setInitial(null)}><CmsForm formKey={formSection.Form} initial={initial}/></Dialog>}</>;
}
