import {vehicleDailyRate} from './contentModel';
import React,{useEffect,useState} from 'react';
import {ArrowRight,ChevronLeft,ChevronRight,Heart,MapPin,Users,CalendarDays,Search,Star,CarFront,SlidersHorizontal,Wallet} from 'lucide-react';
import {useCollection,useSetting,mediaUrl,safeUrl} from './siteContent';

export function Credit({image}){
  if(!image?.Credit)return null;
  return <p className="mt-2 text-xs text-neutral-500">{safeUrl(image.Source)?<a className="underline" href={safeUrl(image.Source)}>{image.Credit}</a>:image.Credit}{image.License&&<> · {safeUrl(image.License)?<a className="underline" href={safeUrl(image.License)}>{image.License}</a>:image.License}</>}</p>;
}
export function SheetImage({url,alt='',className='',...props}){
  if(!mediaUrl(url))return null;
  return <img src={mediaUrl(url)} alt={alt} className={className} {...props}/>;
}
export function ContentCard({row,collection,onOpen,onEnquire,buttonLabel}){
  const media=useCollection('Media');
  const currency=useSetting('currency');
  const dayLabel=useSetting('ui.days'),capacityLabel=useSetting('ui.seats'),perDay=useSetting('ui.perDay');
  const viewLabel=useSetting('ui.viewDetails'),enquireLabel=useSetting('ui.enquire');
  const title=row.Title||row.Name||row.Country||'';
  const image=media.find(item=>item['Image URL']===row['Image URL']);
  const price=row.Price||row['Daily rate'];
  return <article className="tour flex flex-col">
    <SheetImage url={row['Image URL']} alt={image?.Alt||title} className="aspect-[1.55] w-full object-cover" loading="lazy"/>
    <div className="grid flex-1 content-start gap-3 p-5">
      {row.Category&&<span className="text-sm font-semibold text-brand">{row.Category}</span>}
      {title&&<h3>{title}</h3>}
      {(row.Location||row.Places)&&<p className="flex items-center gap-2 text-sm text-neutral-600"><MapPin size={16}/>{row.Location||row.Places}</p>}
      {row.Days&&<p className="flex items-center gap-2 text-sm"><CalendarDays size={16}/>{row.Days} {dayLabel}</p>}
      {row.Seats&&<p className="flex items-center gap-2 text-sm"><Users size={16}/>{row.Seats} {capacityLabel}</p>}
      {(row.Description||row.Quote)&&<p className="whitespace-pre-wrap text-sm leading-6">{row.Description||row.Quote}</p>}
      {row.Categories&&<p className="text-sm">{row.Categories}</p>}
      {collection==='Testimonials'&&row.Rating&&<span className="flex gap-1 text-brand-gold-deep" aria-label={String(row.Rating)}>{Array.from({length:Math.max(0,Math.min(5,Math.round(Number(row.Rating))))},(_,i)=><Star key={i} fill="currentColor" size={16}/>)}</span>}
      {price&&<p className="font-semibold">{currency} {Number(price).toLocaleString('en-IN')}{row['Daily rate']&&perDay?' '+perDay:''}</p>}
      <Credit image={image}/>
      {safeUrl(row.Link)?<a className="outline mt-auto" href={safeUrl(row.Link)}>{buttonLabel||viewLabel}<ArrowRight size={16}/></a>:collection!=='Testimonials'&&<div className="flex flex-wrap gap-2 pt-2">
        {['Tours','Experiences'].includes(collection)?<button className="pill" onClick={()=>onOpen?.(collection,row.ID)}>{buttonLabel||viewLabel}<ArrowRight size={16}/></button>:<button className="outline" onClick={()=>onEnquire?.(collection,row.ID)}>{buttonLabel||enquireLabel}<ArrowRight size={16}/></button>}
      </div>}
    </div>
  </article>;
}
export function ContentCollection({name,sectionKey='',buttonLabel='',onOpen,onEnquire}){
  const rows=useCollection(name),currencyLabel=useSetting('currency');
  const [query,setQuery]=useState(''),[category,setCategory]=useState(''),[capacity,setCapacity]=useState(''),[budget,setBudget]=useState('');
  const searchLabel=useSetting('ui.search'),categoryLabel=useSetting('ui.category'),capacityLabel=useSetting('ui.minimumSeats'),budgetLabel=useSetting('ui.maxPrice'),allLabel=useSetting('ui.all');
  const categories=[...new Set(rows.flatMap(row=>row.Category?[row.Category]:row.Region?[row.Region]:row.Categories?row.Categories.split(',').map(s=>s.trim()):[]))];
  useEffect(()=>{if(category&&!categories.includes(category))setCategory('');},[rows,category]);
  const visible=rows.filter(row=>{
    const text=[row.Title,row.Name,row.Country,row.Location,row.Places,row.Category,row.Description].filter(Boolean).join(' ').toLowerCase();
    return (!query||text.includes(query.toLowerCase()))&&(!category||[row.Category,row.Region,...(row.Categories||'').split(',').map(s=>s.trim())].includes(category))&&(!capacity||Number(row.Seats)>=Number(capacity))&&(!budget||(name==='Vehicles'?vehicleDailyRate(row)!==null&&vehicleDailyRate(row)<=Number(budget):Number(row.Price||row['Daily rate']||0)<=Number(budget)));
  });
  if(name==='Vehicles')return <div className="rental-browser">
    {rows.length>0&&<div className="rental-filters"><div className="rental-filter-icon" aria-hidden="true"><SlidersHorizontal size={22}/></div>{searchLabel&&<label><span><Search size={16}/>{searchLabel}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label>}{capacityLabel&&<label><span><Users size={16}/>{capacityLabel}</span><input type="number" min="1" step="1" value={capacity} onChange={e=>setCapacity(e.target.value)}/></label>}{budgetLabel&&<label><span><Wallet size={16}/>{budgetLabel}{currencyLabel&&<small>{currencyLabel}</small>}</span><input type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)}/></label>}{(query||capacity||budget)&&<button className="rental-reset" onClick={()=>{setQuery('');setCapacity('');setBudget('');}}>Clear filters</button>}</div>}
    <div className="rental-results" role="status">{visible.length} / {rows.length}</div>
    <div className="cards rental-grid">{visible.map(row=><RentalCard key={row.ID} row={row} buttonLabel={buttonLabel} onEnquire={onEnquire}/>)}</div>
    {rows.length>0&&!visible.length&&<div className="rental-empty"><Search size={28}/><p>No vehicles match these filters.</p><button className="outline" onClick={()=>{setQuery('');setCapacity('');setBudget('');}}>Clear filters</button></div>}
  </div>;
  return <>
    {rows.length>0&&<div className="mb-6 flex flex-wrap gap-3">
      {searchLabel&&<label className="text-sm">{searchLabel}<input className="ml-2 rounded-lg border bg-white p-2" value={query} onChange={e=>setQuery(e.target.value)}/></label>}
      {categories.length>0&&categoryLabel&&<label className="text-sm">{categoryLabel}<select className="ml-2 rounded-lg border bg-white p-2" value={category} onChange={e=>setCategory(e.target.value)}><option value="">{allLabel}</option>{categories.map(value=><option key={value}>{value}</option>)}</select></label>}
      {name==='Vehicles'&&capacityLabel&&<label className="text-sm">{capacityLabel}<input className="ml-2 w-20 rounded-lg border p-2" type="number" min="1" value={capacity} onChange={e=>setCapacity(e.target.value)}/></label>}
      {['Tours','Experiences','Hotels','Vehicles'].includes(name)&&budgetLabel&&<label className="text-sm">{budgetLabel}<input className="ml-2 w-28 rounded-lg border p-2" type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)}/></label>}
    </div>}
    <div className="cards">{visible.map(row=><ContentCard key={row.ID} row={row} collection={name} buttonLabel={buttonLabel} onOpen={onOpen} onEnquire={onEnquire}/>)}</div>
  </>;
}

function RentalCard({row,buttonLabel,onEnquire}){
 const currency=useSetting('currency'),seats=useSetting('ui.seats'),perDay=useSetting('ui.perDay'),enquire=useSetting('ui.enquire');
 const rate=vehicleDailyRate(row);
 const media=useCollection('Media'),image=media.find(item=>item['Image URL']===row['Image URL']);
 return <article className="rental-card"><div className="rental-photo">{mediaUrl(row['Image URL'])?<SheetImage url={row['Image URL']} alt={image?.Alt||row.Name} loading="lazy"/>:<CarFront size={64} aria-hidden="true"/>}{row.Seats&&<span className="rental-capacity"><Users size={15}/>{row.Seats} {seats}</span>}</div><div className="rental-body">{row.Name&&<h3>{row.Name}</h3>}{row.Description&&<p className="rental-description">{row.Description}</p>}<Credit image={image}/><div className="rental-bottom">{rate!==null&&<p className="rental-price"><strong>{currency} {rate.toLocaleString('en-IN')}</strong><span>{perDay||'Daily rate'}</span></p>}{(buttonLabel||enquire)&&<button className="pill" onClick={()=>onEnquire?.('Vehicles',row.ID)}>{buttonLabel||enquire}</button>}</div></div></article>;
}
