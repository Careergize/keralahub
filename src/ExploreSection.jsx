import React from 'react';
import {ArrowRight} from 'lucide-react';
import {useCollection,useSetting,mediaUrl,safeUrl} from './siteContent';

export default function ExploreSection({section}){
  const eyebrow=useSetting('ui.exploreEyebrow');
  const images=useCollection('Media').filter(row=>row.Group===section.Key+'-images'&&mediaUrl(row['Image URL']));
  const layers=['left-[2%] top-[12%] h-[77%] w-[46%] -rotate-8 rounded-2xl','right-[2%] top-[12%] h-[77%] w-[46%] rotate-8 rounded-2xl','left-[29%] top-[5%] h-[90%] w-[42%] rounded-2xl border-4 border-white'];
  return <section id={section.Key} className="wrap section grid items-center gap-10 lg:grid-cols-2" aria-labelledby={'explore-heading-'+section.ID}>
    <div>
      {eyebrow&&<p className="mb-4 inline-flex rounded-full bg-brand-tint px-4 py-2 text-sm font-semibold text-brand">{eyebrow}</p>}
      {section.Title&&<h2 id={'explore-heading-'+section.ID}>{section.Title}</h2>}
      {(section.Body||'').split(/\n\s*\n|\s*\|\|\s*/).filter(Boolean).map((paragraph,i)=><p key={i} className={(i?'mt-4':'mt-5')+' whitespace-pre-wrap leading-7 text-neutral-600'}>{paragraph}</p>)}
      {safeUrl(section.Link)&&section['Button label']&&<a className="pill mt-7" href={safeUrl(section.Link)}>{section['Button label']}<ArrowRight size={17}/></a>}
    </div>
    {images.length>0?<div className="relative mx-auto aspect-[1.45] w-full max-w-[560px]" aria-hidden="true">{images.slice(0,3).map((row,index)=><img key={row.ID} src={mediaUrl(row['Image URL'])} alt="" loading="lazy" className={'absolute object-cover shadow-lg '+layers[index]}/>)}</div>:mediaUrl(section['Image URL'])&&<img src={mediaUrl(section['Image URL'])} alt="" loading="lazy" className="w-full rounded-2xl object-cover"/>}
  </section>;
}
