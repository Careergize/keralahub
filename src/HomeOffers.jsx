import React, {useRef} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

const artwork = 'https://atlastrip-wp.egenstheme.com/wp-content/uploads/2026/07/';
const offers = [
  [1,'Vietnam','/contact/?destination=Vietnam#enquiry'],
  [3,'Exclusive Travel Offers','/holidays/#worldwide-deals'],
  [5,'Bali','/contact/?message=I%20would%20like%20to%20enquire%20about%20a%20Bali%20holiday.#enquiry'],
  [6,'Unbeatable Holiday Deals','/holidays/#tour-deals'],
];

export default function HomeOffers(){
  const track = useRef(null);

  function move(direction){
    const {children} = track.current;
    const distance = children[1].offsetLeft - children[0].offsetLeft;
    const {scrollLeft,scrollWidth,clientWidth} = track.current;
    const end = scrollWidth-clientWidth;
    let next = scrollLeft+direction*distance;
    if(direction>0 && scrollLeft>=end-2) next=0;
    if(direction<0 && scrollLeft<=2) next=end;
    track.current.scrollTo({left:next,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }

  return <section className="wrap pt-14 md:pt-20" id="discounts-offers" aria-labelledby="offers-heading">
    <h2 id="offers-heading" className="mb-5 text-center">Discounts &amp; Offers</h2>
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 flex -translate-y-1/2 justify-between md:-inset-x-4">
        <button type="button" aria-label="Previous offer" onClick={()=>move(-1)} className="pointer-events-auto grid size-10 place-items-center rounded-full border border-neutral-200 bg-white shadow-md hover:text-brand"><ChevronLeft size={19}/></button>
        <button type="button" aria-label="Next offer" onClick={()=>move(1)} className="pointer-events-auto grid size-10 place-items-center rounded-full border border-neutral-200 bg-white shadow-md hover:text-brand"><ChevronRight size={19}/></button>
      </div>
      <div ref={track} className="relative grid auto-cols-[76%] grid-flow-col snap-x snap-mandatory gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-14px)/2)] lg:auto-cols-[calc((100%-28px)/3)]">
      {offers.map(([image,name,href])=><a key={name} href={href} aria-label={name} className="snap-start overflow-hidden rounded-[14px] bg-slate-100 focus-visible:outline-offset-[-4px]">
        <img src={artwork+'offer-card-img'+image+'.webp'} alt="" loading="lazy" width="268" height="400" className="aspect-[268/400] w-full object-cover"/>
      </a>)}
    </div>
    </div>
  </section>;
}
