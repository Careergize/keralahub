import React,{useState} from 'react';
import {ChevronLeft,ChevronRight,Quote,Star} from 'lucide-react';
import {useCollection} from './siteContent';
import {SheetImage,Credit} from './ContentCollection';

export default function TestimonialsSection({section}){
  const rows=useCollection('Testimonials'),media=useCollection('Media');
  const [start,setStart]=useState(0);
  const count=rows.length,index=count?start%count:0;
  const visible=Array.from({length:Math.min(3,count)},(_,offset)=>rows[(index+offset)%count]);
  const headingId='testimonials-heading-'+section.ID;
  return <section id={section.Key} className="section testimonials-section" aria-labelledby={section.Title?headingId:undefined}><div className="wrap"><div className="testimonials-heading"><div>{section.Title&&<h2 id={headingId}>{section.Title}</h2>}{section.Body&&<p>{section.Body}</p>}</div>{count>1&&<div className="testimonials-controls"><button type="button" aria-label="Previous testimonial" onClick={()=>setStart((index+count-1)%count)}><ChevronLeft size={20}/></button><button type="button" aria-label="Next testimonial" onClick={()=>setStart((index+1)%count)}><ChevronRight size={20}/></button></div>}</div><div className="testimonials-grid" aria-live="polite">{visible.map((row,offset)=>{const rating=Math.max(0,Math.min(5,Math.round(Number(row.Rating)||0)));const image=media.find(item=>item['Image URL']===row['Image URL']);return <article className={'testimonial-card testimonial-slot-'+offset} key={row.ID}><SheetImage url={row['Image URL']} alt="" width={72} height={72} loading="lazy" className="testimonial-avatar"/><blockquote><Quote size={32} aria-hidden="true"/>{row.Quote&&<p>{row.Quote}</p>}</blockquote><div className="testimonial-footer">{row.Name&&<h3>{row.Name}</h3>}{row.Rating!==''&&row.Rating!=null&&<span className="testimonial-rating" role="img" aria-label={rating+' out of 5 stars'}>{Array.from({length:rating},(_,i)=><Star key={i} size={16} fill="currentColor" aria-hidden="true"/>)}</span>}</div><Credit image={image}/></article>;})}</div></div></section>;
}
