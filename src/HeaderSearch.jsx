import React,{useState} from 'react';
import {Binoculars,CalendarDays,Compass,Globe,MapPin,Search,Hotel,Check} from 'lucide-react';
import {useCollection,useSetting,safeUrl} from './siteContent';

export default function HeaderSearch({section,onSearch}){
  const tours=useCollection('Tours'),experiences=useCollection('Experiences'),destinations=useCollection('Destinations'),hotels=useCollection('Hotels');
  const [mode,setMode]=useState('Tours'),[destination,setDestination]=useState(''),[category,setCategory]=useState(''),[travelDate,setTravelDate]=useState('');
  const visaLink=safeUrl(useSetting('searchVisaLink'));
  const collection=mode==='Experiences'?'Experiences':mode==='Hotels'?'Hotels':'Tours';
  const rows=collection==='Hotels'?hotels:collection==='Tours'?tours:experiences;
  const categories=[...new Set(rows.map(row=>row.Category).filter(Boolean))];
  const locations=collection==='Hotels'?[...new Set(hotels.map(row=>row.Location).filter(Boolean))]:[...new Set(destinations.map(row=>row.Name).filter(Boolean))];
  return <div className="wrap search-wrap" id={section.Key}><div className="search-box">
    <div className="search-title"><div><span className="search-eyebrow">LET’S FIND YOUR NEXT GETAWAY</span><h2>{section.Title||'Where would you like to go?'}</h2></div><span className="search-reassurance"><Check size={16}/>Personal plans. Local expertise.</span></div>
    {section.Body&&<p className="search-description">{section.Body}</p>}
    <div className="search-tabs" role="group" aria-label="Travel type">
      {[["Tours","Tour packages",Globe],["Hotels","Hotels & stays",Hotel],["Experiences","Experiences",Binoculars],...(visaLink?[["Visa","Visa assistance",Compass]]:[])].map(([key,label,Icon])=><button type="button" key={key} className={'tab '+(mode===key?'active':'')} aria-pressed={mode===key} onClick={()=>{setMode(key);setCategory('');setDestination('');}}><Icon size={18}/>{label}</button>)}
    </div>
    {mode==='Visa'?<div className="visa-panel"><p>Planning to travel abroad? Explore our visa assistance services.</p><a className="pill" href={visaLink}>Explore visa services</a></div>:<form className={'finder '+(collection==='Hotels'?'finder-hotels':'')} onSubmit={event=>{event.preventDefault();onSearch({collection,destination,category,travelDate});}}>
      <label><MapPin size={22}/><span>Where to?<select name="destination" aria-label="Destination" value={destination} onChange={event=>setDestination(event.target.value)}><option value="">Explore all destinations</option>{locations.map(name=><option key={name}>{name}</option>)}</select></span></label>
      <label><CalendarDays size={22}/><span>{collection==='Hotels'?'Preferred check-in':'Preferred travel date'}<input name="travelDate" aria-label="Preferred travel date" type="date" value={travelDate} onChange={event=>setTravelDate(event.target.value)}/></span></label>
      {collection!=='Hotels'&&<label><Compass size={22}/><span>Your travel style<select name="category" aria-label="Travel style" value={category} onChange={event=>setCategory(event.target.value)}><option value="">All travel styles</option>{categories.map(value=><option key={value}>{value}</option>)}</select></span></label>}
      <button className="pill" type="submit"><Search size={19}/>Search {collection==='Hotels'?'stays':collection==='Experiences'?'experiences':'trips'}</button>
    </form>}
    <div className="search-note"><span><Check size={14}/>Send an enquiry before you book</span><span>Have something else in mind? <a href="/customize-trip/">Build your own itinerary</a></span></div>
  </div></div>;
}
