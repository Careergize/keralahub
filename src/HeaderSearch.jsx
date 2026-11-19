import React,{useState} from 'react';
import {ArrowRight,Binoculars,CalendarDays,Compass,Globe,MapPin,Search} from 'lucide-react';
import {useCollection,useSetting,safeUrl} from './siteContent';

export default function HeaderSearch({section,onSearch}){
  const tours=useCollection('Tours'),experiences=useCollection('Experiences'),destinations=useCollection('Destinations');
  const [mode,setMode]=useState('Tours'),[destination,setDestination]=useState(''),[category,setCategory]=useState(''),[travelDate,setTravelDate]=useState('');
  const experienceLabel=useSetting('ui.experience'),legacyExperienceLabel=useSetting('ui.experiences');
  const labels={tours:useSetting('ui.tours'),experience:experienceLabel||legacyExperienceLabel,visa:useSetting('ui.visa'),destination:useSetting('ui.destination'),date:useSetting('ui.travelDate'),category:useSetting('ui.category'),selectDestination:useSetting('ui.selectDestination'),selectCategory:useSetting('ui.selectCategory'),before:useSetting('ui.customPromptBefore'),create:useSetting('ui.create'),after:useSetting('ui.customPromptAfter'),visaPrompt:useSetting('ui.visaPrompt'),visaButton:useSetting('ui.visaButton')};
  const customLink=safeUrl(useSetting('searchCustomLink')),visaLink=safeUrl(useSetting('searchVisaLink'));
  const collection=mode==='Experiences'?'Experiences':'Tours';
  const categories=[...new Set((collection==='Tours'?tours:experiences).map(row=>row.Category).filter(Boolean))];
  return <div className="wrap search-wrap" id={section.Key}><div className="search-box">
    {section.Title&&<h2 className="mb-5 text-2xl">{section.Title}</h2>}
    {section.Body&&<p className="mb-5">{section.Body}</p>}
    <div className="flex flex-wrap gap-3 sm:gap-4" role="group" aria-label="Travel type">
      {[["Tours",labels.tours,Globe],["Experiences",labels.experience,Binoculars],["Visa",labels.visa,Compass]].map(([key,label,Icon])=>label&&<button type="button" key={key} className={'tab '+(mode===key?'active':'')} aria-pressed={mode===key} onClick={()=>{setMode(key);setCategory('');}}><Icon size={19}/>{label}</button>)}
    </div>
    {mode==='Visa'?<div className="visa-panel">{labels.visaPrompt}{visaLink&&labels.visaButton&&<a className="pill" href={visaLink}>{labels.visaButton}<ArrowRight size={16}/></a>}</div>:<form className="finder" onSubmit={event=>{event.preventDefault();const fields=new FormData(event.currentTarget);onSearch({collection,destination:String(fields.get('destination')||''),category:String(fields.get('category')||''),travelDate:String(fields.get('travelDate')||'')});}}>
      <label><MapPin/><span>{labels.destination}<select name="destination" aria-label={labels.destination||'Destination'} value={destination} onChange={event=>setDestination(event.target.value)}><option value="">{labels.selectDestination}</option>{destinations.map(row=><option key={row.ID} value={row.Name}>{row.Name}</option>)}</select></span></label>
      <label><CalendarDays/><span>{labels.date}<input name="travelDate" aria-label={labels.date||'Travel date'} type="date" value={travelDate} onChange={event=>setTravelDate(event.target.value)}/></span></label>
      <label><Compass/><span>{labels.category}<select name="category" aria-label={labels.category||'Category'} value={category} onChange={event=>setCategory(event.target.value)}><option value="">{labels.selectCategory}</option>{categories.map(value=><option key={value}>{value}</option>)}</select></span></label>
      {section['Button label']&&<button className="pill" type="submit"><Search size={18}/>{section['Button label']}</button>}
    </form>}
    {(labels.before||labels.after||customLink)&&<p className="search-note">{labels.before}{customLink&&labels.create&&<> <a className="font-semibold text-brand underline" href={customLink}>{labels.create}</a> </>}{labels.after}</p>}
  </div></div>;
}
