import React,{useRef} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {useCollection,useSetting,mediaUrl,safeUrl} from './siteContent';

export default function OffersCarousel({section,onEnquire}){
  const track=useRef(null);
  const offers=useCollection('Offers').filter(row=>mediaUrl(row['Image URL']));
  const previousLabel=useSetting('ui.previousOffer');
  const nextLabel=useSetting('ui.nextOffer');
  if(!offers.length)return null;

  function move(direction){
    const element=track.current;
    if(!element||element.children.length<2)return;
    const distance=element.children[1].offsetLeft-element.children[0].offsetLeft;
    const end=element.scrollWidth-element.clientWidth;
    let next=element.scrollLeft+direction*distance;
    if(direction>0&&element.scrollLeft>=end-2)next=0;
    if(direction<0&&element.scrollLeft<=2)next=end;
    element.scrollTo({left:next,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }

  const headingId='offers-heading-'+section.ID;
  return <section className="wrap pt-14 md:pt-20" id={section.Key} aria-labelledby={section.Title?headingId:undefined}>
    {section.Title&&<h2 id={headingId} className="mb-5 text-center">{section.Title}</h2>}
    {section.Body&&<p className="mb-5 text-center whitespace-pre-wrap">{section.Body}</p>}
    <div className="mb-7 flex justify-center"><a className="pill" href="/customize-trip/">Customize your trip</a></div>
    <div className="relative">
      {offers.length>1&&<div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 flex -translate-y-1/2 justify-between md:-inset-x-4">
        <button type="button" aria-label={previousLabel||'Previous offer'} onClick={()=>move(-1)} className="pointer-events-auto grid size-10 place-items-center rounded-full border border-neutral-200 bg-white shadow-md hover:text-brand"><ChevronLeft size={19}/></button>
        <button type="button" aria-label={nextLabel||'Next offer'} onClick={()=>move(1)} className="pointer-events-auto grid size-10 place-items-center rounded-full border border-neutral-200 bg-white shadow-md hover:text-brand"><ChevronRight size={19}/></button>
      </div>}
      <div ref={track} className="relative grid auto-cols-[76%] grid-flow-col snap-x snap-mandatory gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-14px)/2)] lg:auto-cols-[calc((100%-28px)/3)]">
        {offers.map(row=>{
          const image=<img src={mediaUrl(row['Image URL'])} alt="" loading="lazy" width="268" height="400" className="aspect-[268/400] w-full object-cover"/>;
          const className='snap-start overflow-hidden rounded-[14px] bg-slate-100 focus-visible:outline-offset-[-4px]';
          return safeUrl(row.Link)?<a key={row.ID} href={safeUrl(row.Link)} aria-label={row.Title} className={className}>{image}</a>:<button type="button" key={row.ID} aria-label={row.Title} className={className} onClick={()=>onEnquire?.('Offers',row.ID)}>{image}</button>;
        })}
      </div>
    </div>
  </section>;
}
