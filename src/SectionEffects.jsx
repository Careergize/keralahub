import {useEffect} from 'react';

export default function SectionEffects(){
  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(preference.matches||!('IntersectionObserver' in window))return;
    const root=document.querySelector('.public-site');
    if(!root)return;
    const seen=new WeakSet();
    const selector='section h2, .selling-tour, .discovery-place, .destination, .testimonial-card, .offer-card, .journal';
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.add(entry.target.matches('h2')?'travel-heading-enter':'travel-card-enter');
        observer.unobserve(entry.target);
      }
    },{threshold:0.12});
    function scan(){
      root.querySelectorAll(selector).forEach(element=>{
        if(seen.has(element))return;
        seen.add(element);
        const siblings=Array.from(element.parentElement.children).filter(child=>child.matches(selector));
        element.style.setProperty('--travel-delay',`${(siblings.indexOf(element)%3)*0.12}s`);
        observer.observe(element);
      });
    }
    scan();
    const updates=new MutationObserver(scan);
    updates.observe(root,{childList:true,subtree:true});
    const stop=()=>{if(preference.matches){observer.disconnect();updates.disconnect();}};
    preference.addEventListener('change',stop);
    return ()=>{observer.disconnect();updates.disconnect();preference.removeEventListener('change',stop);};
  },[]);
  return null;
}
