import React, {useEffect, useRef} from 'react';
import {topDestinations} from './data';

const artwork = 'https://atlastrip-wp.egenstheme.com/wp-content/uploads/2026/07/';

export default function TopDestinations(){
  const trackRef = useRef(null);

  useEffect(()=>{
    const track = trackRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setInterval(()=>{
      if(document.hidden || reducedMotion.matches || track.matches(':hover, :focus-within')) return;
      const distance = track.children[1].offsetLeft - track.children[0].offsetLeft;
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      track.scrollTo({left:atEnd?0:track.scrollLeft+distance,behavior:'smooth'});
    }, 3500);
    return ()=>window.clearInterval(timer);
  },[]);

  return <section className="wrap section text-center" id="destinations" aria-labelledby="top-destinations-heading">
    <h2 id="top-destinations-heading" className="mb-8 md:mb-14">Top Destinations</h2>
    <div ref={trackRef} className="relative grid auto-cols-[calc((100%-15px)/2)] grid-flow-col snap-x snap-mandatory gap-[15px] overflow-x-auto [scrollbar-width:none] sm:auto-cols-[calc((100%-45px)/4)] lg:auto-cols-[calc((100%-75px)/6)] [&::-webkit-scrollbar]:hidden">
      {topDestinations.map(([name,image])=><a key={name} href={'/contact/?destination='+encodeURIComponent(name)+'#enquiry'} className="group snap-start rounded-lg pb-2 focus-visible:outline-offset-[-3px]">
        <div className="aspect-square overflow-hidden rounded-full bg-slate-100">
          <img src={artwork+'destination-img'+image+'.webp'} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"/>
        </div>
        <h3 className="mt-3 text-base group-hover:text-brand">{name}</h3>
        <p className="mt-1 text-sm text-neutral-600">Enquire about tours</p>
      </a>)}
    </div>
  </section>;
}
