import React from 'react';
import {MapPin,Compass,MessageCircle,ChevronDown,ChevronRight} from 'lucide-react';
import {useCollection,safeUrl,mediaUrl} from './siteContent';
import CmsForm from './CmsForm';
export default function ContactSection({section}){
  const media=useCollection('Media'),navigation=useCollection('Navigation');
  const rows=media.filter(row=>row.Group===section.Key);
  const home=navigation.find(row=>row.Location==='Header'&&row.Link==='/');
  const current=navigation.find(row=>row.Location==='Header'&&row.Link==='/contact/');
  if(section.Type==='Hero')return <section id={section.Key} className="contact-hero" style={mediaUrl(section['Image URL'])?{backgroundImage:`linear-gradient(#0003,#0003),url(${mediaUrl(section['Image URL'])})`}:undefined}>{section.Title&&<h1>{section.Title}</h1>}<nav aria-label="Breadcrumb">{home&&<a href="/">{home.Label}</a>}<ChevronRight size={18}/>{current&&<span aria-current="page">{current.Label}</span>}</nav></section>;
  if(section.Type==='Cards')return <section id={section.Key} className="contact-intro">{section.Title&&<h2>{section.Title}</h2>}{section.Body&&<p className="mb-8 text-center">{section.Body}</p>}<div className="contact-cards">{rows.map((row,i)=>{const Icon=[MapPin,Compass,MessageCircle][i%3];return <article key={row.ID}><Icon/>{row.Title&&<h3>{row.Title}</h3>}{row.Description&&<p className="whitespace-pre-wrap">{row.Description}</p>}{safeUrl(row.Link)&&<a href={safeUrl(row.Link)}>{row.Alt||row.Title}</a>}</article>;})}</div></section>;
  if(section.Type==='Form')return <section id={section.Key} className="enquiry">{section.Title&&<h2>{section.Title}</h2>}<CmsForm formKey={section.Form} variant="contact"/></section>;
  if(section.Type==='Map')return /^https:\/\/(maps\.google\.com|www\.google\.com)\/maps[/?]/.test(section.Link)?<section id={section.Key} className="contact-map" aria-label={section.Title||undefined}><iframe title={section.Title} loading="lazy" src={section.Link} referrerPolicy="no-referrer"/></section>:null;
  if(section.Type==='FAQ')return <section id={section.Key} className="contact-faq">{section.Title&&<h2>{section.Title}</h2>}{rows.map((row,i)=><details name={'contact-faq-'+section.ID} key={row.ID} open={i===0?true:undefined}><summary>{row.Title}<ChevronDown size={19}/></summary><p>{row.Description}</p></details>)}</section>;
  return null;
}
