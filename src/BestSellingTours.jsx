import React,{useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight,Heart,MapPin,CalendarDays} from 'lucide-react';
import {useCollection,useSetting,mediaUrl,safeUrl} from './siteContent';
import {SheetImage,Credit} from './ContentCollection';

function TourCard({row,collection,buttonLabel,onOpen}){
  const media=useCollection('Media'),currency=useSetting('currency'),days=useSetting('ui.days'),itinerary=useSetting('ui.tourItinerary');
  const isDestination=collection==='Destinations',title=row.Title||row.Name||row.Country,places=row.Places||row.Location||row.Region,category=row.Category||row.Region||row.Categories;
  const isExperience=collection==='Experiences',isHotel=collection==='Hotels',isVisa=collection==='VisaOptions';
  const savedKey=isDestination?'saved-destination-ids':isExperience?'saved-experience-ids':isHotel?'saved-hotel-ids':isVisa?'saved-visa-ids':'saved-tour-ids';
  const images=[...new Set([row['Image URL'],...media.filter(item=>item.Group===(isDestination?'destination-':isExperience?'experience-':isHotel?'hotel-':isVisa?'visa-':'tour-')+row.ID).map(item=>item['Image URL'])].filter(mediaUrl))];
  const [photo,setPhoto]=useState(0),[saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(savedKey)||'[]').includes(row.ID);}catch{return false;}});
  const index=photo%Math.max(images.length,1),image=media.find(item=>item['Image URL']===images[index]);
  function toggleSaved(){setSaved(value=>{const next=!value;try{const ids=JSON.parse(localStorage.getItem(savedKey)||'[]');localStorage.setItem(savedKey,JSON.stringify(next?[...new Set([...ids,row.ID])]:ids.filter(id=>id!==row.ID)));}catch{}return next;});}
  return <article className="tour selling-tour">
    {images.length>0&&<div className="tour-photo"><SheetImage url={images[index]} alt={image?.Alt||title} loading="lazy"/>{category&&<span className="tag">{category}</span>}<button className="save" aria-label={isDestination?'Save destination':isExperience?'Save experience':isHotel?'Save hotel':isVisa?'Save visa destination':'Save tour'} aria-pressed={saved} onClick={toggleSaved}><Heart size={17} fill={saved?'currentColor':'none'}/></button>{images.length>1&&<><button className="slide prev" aria-label="Previous photo" onClick={()=>setPhoto((index+images.length-1)%images.length)}><ChevronLeft size={17}/></button><button className="slide next" aria-label="Next photo" onClick={()=>setPhoto((index+1)%images.length)}><ChevronRight size={17}/></button><div className="dots">{images.map((url,i)=><button key={url} aria-label={'Show photo '+(i+1)} aria-pressed={i===index} className={i===index?'selected':''} onClick={()=>setPhoto(i)}/>)}</div></>}</div>}
    <div className="selling-tour-body"><div className="meta">{places&&<span><MapPin size={15}/>{places.split(',')[0].trim()}</span>}{row.Days&&<span><CalendarDays size={15}/>{row.Days} {days}</span>}</div>{title&&<h3><button className="tour-title" onClick={()=>onOpen(collection,row.ID)}>{title}</button></h3>}<Credit image={image}/>{!isHotel&&places&&<p className="selling-tour-route">{places.split(',').map(place=>place.trim()).join('  ›  ')}</p>}<div className="tour-bottom"><span>{(isDestination||isVisa)?row.Description:row.Price?`${currency} ${Number(row.Price).toLocaleString('en-IN')}`:isHotel?row.Description:itinerary}</span>{buttonLabel&&<button className="pill" onClick={()=>onOpen(collection,row.ID)}>{buttonLabel}</button>}</div></div>
  </article>;
}
export default function BestSellingTours({section,onOpen}){
  const collection=section.Collection,isDestination=collection==='Destinations';
  const rows=useCollection(collection),viewAll=useSetting(isDestination?'ui.viewAllDestinations':collection==='Experiences'?'ui.viewAllExperiences':collection==='Hotels'?'ui.viewAllHotels':collection==='VisaOptions'?'ui.viewAllVisaDestinations':'ui.viewAllPackages'),viewLabel=useSetting('ui.viewDetails'),categoryLabel=useSetting('ui.category');
  const [category,setCategory]=useState('');
  const rowCategories=row=>collection==='VisaOptions'?(row.Categories||'').split(',').map(value=>value.trim()).filter(Boolean):[row.Category||row.Region||(collection==='Hotels'?row.Location:'')].filter(Boolean);
  const categories=[...new Set(rows.flatMap(rowCategories))].sort((a,b)=>a.localeCompare(b));
  useEffect(()=>{if(category&&!categories.includes(category))setCategory('');},[rows,category]);
  const visible=rows.filter(row=>!category||rowCategories(row).includes(category));
  return <section id={section.Key} className="wrap section best-selling-tours"><div className="selling-heading">{section.Title&&<h2>{section.Title}</h2>}{viewAll&&(safeUrl(section.Link)?<a className="outline" href={safeUrl(section.Link)}>{viewAll}</a>:<button className="outline" onClick={()=>setCategory('')}>{viewAll}</button>)}</div>{section.Body&&<p className="mb-6">{section.Body}</p>}{categories.length>0&&<div className="selling-categories" role="group" aria-label={categoryLabel||(isDestination?'Destination region':collection==='Experiences'?'Experience category':collection==='Hotels'?'Hotel location':collection==='VisaOptions'?'Visa category':'Tour category')}>{categories.map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(category===value?'':value)}>{value}</button>)}</div>}<div className="cards">{visible.map(row=><TourCard key={row.ID} row={row} collection={collection} buttonLabel={section['Button label']||viewLabel} onOpen={onOpen}/>)}</div></section>;
}
