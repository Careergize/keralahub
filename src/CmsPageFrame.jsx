import HouseboatHero from './HouseboatHero';
import ContactSection from './ContactSection';
import TestimonialsSection from './TestimonialsSection';
import BestSellingTours from './BestSellingTours';
import HeaderSearch from './HeaderSearch';
import ExploreSection from './ExploreSection';
import React,{useState,useEffect,useRef} from 'react';
import {ArrowRight,Search,X,BadgeDollarSign,ShieldCheck,Map,Headset,TrainFront,Ship} from 'lucide-react';
import {useCollection,useSetting,safeUrl,mediaUrl} from './siteContent';
import {pageSections} from './contentModel';
import {useSiteContent} from './siteContent';
import {ContentCollection,SheetImage,Credit} from './ContentCollection';
import CmsForm from './CmsForm';
import OffersCarousel from './OffersCarousel';

function MediaGroup({group,type,onImage}){
  const rows=useCollection('Media').filter(row=>row.Group===group);
  if(!rows.length)return null;
  if(type==='Cards'&&group==='benefits')return <ul className="benefit-grid">{rows.map((row,index)=>{const Icon=[BadgeDollarSign,ShieldCheck,Map,Headset][index%4];return <li className="benefit-card" key={row.ID}><Icon size={40} strokeWidth={1.5} aria-hidden="true"/>{row.Title&&<h3>{safeUrl(row.Link)?<a href={safeUrl(row.Link)}>{row.Title}</a>:row.Title}</h3>}{row.Description&&<p>{row.Description.split(/(\*\*.*?\*\*)/g).map((part,i)=>part.startsWith('**')&&part.endsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part)}</p>}</li>})}</ul>;
  if(type==='FAQ')return <div className="grid gap-3">{rows.map(row=><details className="rounded-xl border bg-white p-5" key={row.ID}><summary className="cursor-pointer font-semibold">{row.Title}</summary><p className="mt-3 whitespace-pre-wrap">{row.Description}</p>{safeUrl(row.Link)&&<a href={safeUrl(row.Link)}>{row.Alt}</a>}</details>)}</div>;
  return <div className={type==='Gallery'?'grid grid-cols-2 gap-4 md:grid-cols-5':'cards'}>{rows.map(row=><article className={type==='Gallery'?'':'tour p-5'} key={row.ID}>
    {mediaUrl(row['Image URL'])&&(type==='Gallery'?<button className="w-full" aria-label={row.Alt||row.Title} onClick={()=>onImage(row.ID)}><SheetImage url={row['Image URL']} alt={row.Alt} className="aspect-square w-full rounded-xl object-cover" loading="lazy"/></button>:<SheetImage url={row['Image URL']} alt={row.Alt} className="mb-4 aspect-video w-full rounded-xl object-cover" loading="lazy"/>)}
    {row.Title&&<h3>{safeUrl(row.Link)?<a href={safeUrl(row.Link)}>{row.Title}</a>:row.Title}</h3>}
    {row.Description&&<p className="mt-3 whitespace-pre-wrap leading-7">{row.Description}</p>}
    <Credit image={row}/>
  </article>)}</div>;
}
function FooterGallery({section,onImage}){
 const rows=useCollection('Media').filter(row=>row.Group===section.Key&&mediaUrl(row['Image URL']));
 if(!rows.length)return null;
 return <div id={section.Key} className="gallery" aria-label={section.Title||undefined}>{rows.slice(0,5).map(row=><button key={row.ID} aria-label={row.Alt||row.Title||'Open gallery image'} onClick={()=>onImage(row.ID)}><SheetImage url={row['Image URL']} alt={row.Alt||''} loading="lazy"/></button>)}</div>;
}
function CoverageSection({section}){
 const rows=useCollection('Media').filter(row=>row.Group===section.Key);
 const resources=section.Key.startsWith('resources-');
 const Icon=section.Page==='/train-bus-tickets/'?TrainFront:section.Page==='/houseboat-cruising/'?Ship:ShieldCheck;
 return <section id={section.Key} className={resources?'wrap coverage-resources':'wrap section coverage-guide'} aria-label={resources?section.Title:undefined}>{!resources&&section.Title&&<h2>{section.Title}</h2>}{section.Body&&<p className="mt-4">{section.Body}</p>}{resources?<ul>{rows.filter(row=>safeUrl(row.Link)).map(row=><li key={row.ID}><a className="outline" href={safeUrl(row.Link)}>{row.Title}</a></li>)}</ul>:<div className="coverage-grid">{rows.map(row=><article key={row.ID}><Icon size={24} aria-hidden="true"/>{row.Title&&<h3>{row.Title}</h3>}{row.Description&&<p>{row.Description}</p>}{safeUrl(row.Link)&&<a className="outline mt-4" href={safeUrl(row.Link)}>{row.Alt||row.Title}</a>}</article>)}</div>}</section>;
}
function SheetSection({section,onOpen,onEnquire,onImage,onSearch}){
 if(['/travel-insurance/','/train-bus-tickets/','/houseboat-cruising/'].includes(section.Page)&&section.Type==='Cards'&&['guide-travel-insurance','resources-travel-insurance','guide-train-bus-tickets','resources-train-bus-tickets','guide-houseboat-cruising','resources-houseboat-cruising'].includes(section.Key))return <CoverageSection section={section}/>;
 if(section.Page==='/contact/'&&['Hero','Cards','Form','Map','FAQ'].includes(section.Type))return <ContactSection section={section}/>;
 if(section.Type==='Gallery'&&section.Key==='gallery')return <FooterGallery section={section} onImage={onImage}/>;
  if(section.Type==='Cards'&&section.Key==='benefits')return <section id={section.Key} className="wrap benefits-section" aria-label={section.Title||undefined}><MediaGroup group={section.Key} type="Cards"/></section>;
  if(section.Type==='Split'&&section.Key==='explore')return <ExploreSection section={section}/>;
  if(section.Type==='Collection'&&section.Collection==='Testimonials')return <TestimonialsSection section={section}/>;
  if(section.Type==='Collection'&&['Tours','Destinations','Experiences','Hotels','VisaOptions'].includes(section.Collection))return <BestSellingTours section={section} onOpen={onOpen}/>;
  if(section.Type==='Collection'&&section.Collection==='Offers')return <OffersCarousel section={section} onEnquire={onEnquire}/>;
  if(section.Type==='Search')return <HeaderSearch section={section} onSearch={onSearch}/>;
  if(section.Type==='Hero')return <section id={section.Key} className="hero" style={mediaUrl(section['Image URL'])?{backgroundImage:'linear-gradient(#0007,#0007),url('+mediaUrl(section['Image URL'])+')',backgroundSize:'cover',backgroundPosition:'center'}:undefined}>
    {mediaUrl(section['Video URL'])&&<video src={mediaUrl(section['Video URL'])} autoPlay muted loop playsInline aria-hidden="true"/>}
    <div className="hero-content">{section.Title&&<h1>{section.Title}</h1>}{section.Body&&<p className="hero-copy whitespace-pre-wrap">{section.Body}</p>}{safeUrl(section.Link)&&section['Button label']&&<a className="hero-button" href={safeUrl(section.Link)}>{section['Button label']}<ArrowRight size={16}/></a>}</div>
  </section>;
  return <section id={section.Key} className={'wrap section '+(section.Type==='Split'?'grid items-center gap-8 lg:grid-cols-2':'')}>
    <div>{section.Title&&<h2 className="mb-5">{section.Title}</h2>}{section.Body&&<p className="mb-6 whitespace-pre-wrap leading-7">{section.Body}</p>}
      {section.Type==='Collection'&&<ContentCollection name={section.Collection} buttonLabel={section['Button label']} onOpen={onOpen} onEnquire={onEnquire}/>}
      {['Gallery','Cards','FAQ'].includes(section.Type)&&<MediaGroup group={section.Key} type={section.Type} onImage={onImage}/>}
      {section.Type==='Form'&&section.Form&&<CmsForm formKey={section.Form}/>}
      {section.Type==='Video'&&mediaUrl(section['Video URL'])&&<video className="w-full rounded-xl" src={mediaUrl(section['Video URL'])} controls playsInline/>}
      {section.Type==='Map'&&/^https:\/\/(maps\.google\.com|www\.google\.com)\/maps[/?]/.test(section.Link)&&<iframe className="h-96 w-full rounded-xl border-0" title={section.Title} loading="lazy" src={section.Link} referrerPolicy="no-referrer"/>}
      {section.Type!=='Map'&&safeUrl(section.Link)&&section['Button label']&&<a className="pill mt-5" href={safeUrl(section.Link)}>{section['Button label']}<ArrowRight size={16}/></a>}
    </div>
    {!['Hero','Gallery','Cards','FAQ','Collection'].includes(section.Type)&&<SheetImage url={section['Image URL']} alt={section.Title} className="max-h-[560px] w-full rounded-xl object-cover" loading="lazy"/>}
  </section>;
}
export function Dialog({title,children,onClose}){
  const ref=useRef(null),closeLabel=useSetting('ui.close');
  useEffect(()=>{if(ref.current&&!ref.current.open)ref.current.showModal();},[]);
  return <dialog ref={ref} onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===ref.current)onClose();}}><div className="dialog-content"><div className="section-head"><h2>{title}</h2><button aria-label={closeLabel||'Close'} onClick={onClose}><X/></button></div>{children}</div></dialog>;
}
export default function CmsPageFrame({path}){
  const {collections}=useSiteContent();
  const page=useCollection('Pages').find(row=>row.Path===path);
  const media=useCollection('Media');
  const forms=useCollection('Forms');
  const enquireLabel=useSetting('ui.enquire'),formTitle=useSetting('ui.enquiryTitle'),searchTitle=useSetting('ui.searchResults'),formContact=useSetting('contactFormKey'),formRental=useSetting('rentalFormKey'),formTrip=useSetting('tripFormKey');
  const [selected,setSelected]=useState(null),[search,setSearch]=useState(null);
  if(!page)return <main className="section wrap"><h1>Page unavailable</h1><p>This page is not published.</p></main>;
  const sections=pageSections(collections,path);
  const selectedRow=selected?.kind==='image'?media.find(row=>row.ID===selected.id):selected?.collection?collections[selected.collection]?.find(row=>row.ID===selected.id):null;
  const onOpen=(collection,id)=>setSelected({kind:'detail',collection,id});
  const onEnquire=(collection,id,travelDate='')=>setSelected({kind:'enquiry',collection,id,travelDate});
  const formKey=selected?.collection==='Vehicles'?formRental:['Tours','Experiences'].includes(selected?.collection)?formTrip:formContact;
  const searchRows=search?(collections[search.collection]||[]).filter(row=>(!search.destination||(row.Places||'').split(',').map(s=>s.trim()).includes(search.destination))&&(!search.category||row.Category===search.category)):[];
  return <main>
    {!sections.some(section=>section.Type==='Hero')&&<section className="wrap section"><h1 className="text-4xl font-semibold">{page.Title}</h1>{page.Description&&<p>{page.Description}</p>}</section>}
    {sections.filter(section=>!(path==='/houseboat-cruising/'&&section.Type==='Form'&&sections.some(row=>row.Type==='Hero'))).map(section=>path==='/houseboat-cruising/'&&section.Type==='Hero'?<HouseboatHero key={section.ID} section={section} formSection={sections.find(row=>row.Type==='Form')}/>:<SheetSection key={section.ID} section={section} onOpen={onOpen} onEnquire={onEnquire} onImage={id=>setSelected({kind:'image',id})} onSearch={setSearch}/>)}
    {selected&&selectedRow&&<Dialog title={selectedRow.Title||selectedRow.Name||selectedRow.Country||''} onClose={()=>setSelected(null)}>
      {selected.kind==='image'?<><SheetImage url={selectedRow['Image URL']} alt={selectedRow.Alt} className="w-full rounded-xl"/><Credit image={selectedRow}/></>:selected.kind==='enquiry'?<CmsForm formKey={formKey} initial={{'travel-date':selected.travelDate||'',destination:selectedRow.Location||(selectedRow.Places||'').split(',')[0]||selectedRow.Country||'',message:selectedRow.Title||selectedRow.Name||selectedRow.Country||''}} context={selectedRow.Title||selectedRow.Name||selectedRow.Country||''}/>:<><SheetImage url={selectedRow['Image URL']} alt={selectedRow.Title} className="w-full rounded-xl"/>{selectedRow.Description&&<p className="my-5 whitespace-pre-wrap">{selectedRow.Description}</p>}{forms.some(form=>form.Key===formKey)&&enquireLabel&&<button className="pill" onClick={()=>setSelected({...selected,kind:'enquiry'})}>{enquireLabel}</button>}</>}
    </Dialog>}
    {search&&<Dialog title={searchTitle} onClose={()=>setSearch(null)}><div className="cards">{searchRows.map(row=><article key={row.ID} className="tour p-5"><h3>{row.Title}</h3>{row.Description&&<p className="my-3">{row.Description}</p>}{enquireLabel&&<button className="pill" onClick={()=>{onEnquire(search.collection,row.ID,search.travelDate);setSearch(null);}}>{enquireLabel}</button>}</article>)}</div></Dialog>}
  </main>;
}
