import React from 'react';
import {MapPin,Route,Headset,Hotel,Compass} from 'lucide-react';
import {useCollection,mediaUrl} from './siteContent';
import {SheetImage} from './ContentCollection';
export default function HomeDiscovery({onSearch}){
  const destinations=useCollection('Destinations').filter(row=>row.Name&&mediaUrl(row['Image URL'])).slice(0,5);
  const tours=useCollection('Tours');
  return <>
    <div className="wrap travel-assurances">{[[Route,'Travel at your pace','Flexible, personal itineraries'],[Hotel,'Find your kind of stay','Hotels, resorts & houseboats'],[Headset,'Talk to a local team','Help with the details that matter']].map(([Icon,title,text])=><div key={title}><span className="assurance-icon"><Icon size={23} strokeWidth={1.6}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    {destinations.length>0&&<section className="wrap destination-discovery"><div className="discovery-heading"><div><p className="section-kicker">A PLACE FOR EVERY KIND OF ESCAPE</p><h2>Find your corner of Kerala</h2><p>From misty hills to quiet backwaters. Where will you go first?</p></div><Compass size={36} strokeWidth={1}/></div><div className="discovery-grid">{destinations.map(row=>{const count=tours.filter(t=>(t.Places||'').split(',').some(place=>place.trim().toLowerCase()===row.Name.toLowerCase())).length;return <button className="discovery-place" key={row.ID} onClick={()=>onSearch({collection:'Tours',destination:row.Name,category:'',travelDate:''})}><SheetImage url={row['Image URL']} alt={row.Name} loading="lazy"/><span><strong>{row.Name}</strong><small><MapPin size={13}/>{count?`${count} tour ${count===1?'package':'packages'}`:row.Region||'Explore this destination'}</small></span></button>;})}</div></section>}
  </>;
}
