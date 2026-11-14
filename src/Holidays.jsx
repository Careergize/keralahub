import React, {useRef, useState} from 'react';
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react';
import {experiences, tours} from './data';
import {destinationPhotos, internationalPhotos} from './destinationPhotos';
import './holidays.css';

const themes = [
  ['Family Holidays','Bring the family together for tea estates, backwaters and beach days.','Family Tour','Munnar'],
  ['Honeymoon Escapes','Pair quiet hill-station stays with a private houseboat cruise.','Honeymoon','Alappuzha'],
  ['Adventure Holidays','Explore forests, waterfalls and trails through the Western Ghats.','Adventure Tour','Thekkady'],
];

const destinations = ['Munnar','Alappuzha','Thekkady','Varkala'];

function Carousel({label,children}){
  const track=useRef(null);
  function move(direction){
    const card=track.current.firstElementChild;
    if(card) track.current.scrollBy({left:direction*(card.getBoundingClientRect().width+24),behavior:'smooth'});
  }
  return <>
    <div ref={track} className="holiday-track" role="region" aria-label={label} tabIndex={0}>{children}</div>
    <div className="holiday-arrows">
      <button aria-label={'Previous '+label} onClick={()=>move(-1)}><ChevronLeft size={20}/></button>
      <button aria-label={'Next '+label} onClick={()=>move(1)}><ChevronRight size={20}/></button>
    </div>
  </>;
}

export default function Holidays({renderTour}){
  const [filter,setFilter]=useState(null);
  const packagesRef=useRef(null);
  const matches=filter?tours.filter(tour=>tour.type===filter||tour.places.includes(filter)):tours;
  function choose(value){
    setFilter(value);
    packagesRef.current.scrollIntoView({behavior:'smooth'});
  }
  return <main className="holidays">
    <section className="contact-hero holidays-hero" style={{backgroundImage:'linear-gradient(#0005,#0005),url('+destinationPhotos.Munnar.src+')'}}>
      <h1>Vacation Packages</h1>
      <nav aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={18}/><span aria-current="page">Holidays</span></nav>
    </section>

    <section className="wrap holiday-section" id="tour-deals" ref={packagesRef}>
      <div className="section-head"><div><h2>Top Tour Deals</h2><p>Explore Kerala’s backwaters, hills and coast with our featured holiday packages.</p></div><button className="holiday-button" onClick={()=>choose(null)}>View All Packages <ArrowRight size={16}/></button></div>
      {filter&&<p className="holiday-filter" role="status">{matches.length} {matches.length===1?'package':'packages'} for {filter}</p>}
      <Carousel key={filter||'all'} label="tour packages">{matches.map(renderTour)}</Carousel>
    </section>

    <section className="holiday-offers">
      <div className="wrap holiday-section">
        <h2>Discounts &amp; Offers</h2>
        <p>Explore featured holidays and ask about offers for your travel dates.</p>
        <div className="holiday-offer-grid">{themes.map(([title,description,type,place])=><article key={type} style={{backgroundImage:'linear-gradient(90deg,#081826e8,#08182620),url('+destinationPhotos[place].src+')'}}>
          <h3>{title}</h3><p>{description}</p><button className="holiday-button" onClick={()=>choose(type)}>Explore Packages <ArrowRight size={16}/></button>
        </article>)}</div>
      </div>
    </section>

    <section className="wrap holiday-section">
      <h2>Kerala Destination Deals</h2>
      <p>Find a holiday package around the places you’d most like to visit.</p>
      <div className="holiday-destination-grid">{destinations.map((place)=><button className="destination" key={place} onClick={()=>choose(place)}>
        <img src={destinationPhotos[place].src} alt="" loading="lazy"/>
        <span><strong>{place}</strong><small>{tours.filter(t=>t.places.includes(place)).length} tours <ArrowRight size={15}/></small></span>
      </button>)}</div>
    </section>

    <section className="wrap holiday-section" id="worldwide-deals">
      <h2>Worldwide Deals</h2>
      <p>Explore international holiday ideas and ask about availability for your travel dates.</p>
      <div className="holiday-destination-grid">
        {[
          ['Morocco','Medinas & desert escapes'],
          ['Jordan','Petra & Wadi Rum'],
          ['Vietnam','Cities, coast & countryside'],
          ['Saudi Arabia','Heritage & desert landscapes'],
        ].map(([place,detail])=><a className="destination worldwide-destination" key={place} href={'/contact/?destination='+encodeURIComponent(place)+'#enquiry'}>
          <img src={internationalPhotos[place].src} alt="" loading="lazy"/>
          <span><strong>{place}</strong><small>{detail} <ArrowRight size={15}/></small></span>
        </a>)}
      </div>
    </section>
    <section className="wrap holiday-section holiday-experiences" id="experience-deals">
      <div className="section-head"><div><h2>Best Experience Deals</h2><p>Make time for Kerala’s backwaters, tea gardens and heritage streets.</p></div><a className="holiday-button" href="/#experiences">View All Experiences <ArrowRight size={16}/></a></div>
      <div className="cards">{experiences.map(renderTour)}</div>
    </section>
    <details className="wrap mb-10 text-sm text-neutral-600">
      <summary className="cursor-pointer">Photo credits</summary>
      <ul className="mt-3 space-y-2">
        {Object.entries({...destinationPhotos,...internationalPhotos}).map(([place,photo])=><li key={place}>
          {place} · <a className="underline" href={photo.source}>{photo.author}</a> · <a className="underline" href={'https://creativecommons.org/licenses/'+photo.license+'/'}>CC {photo.license.replace('/',' ').toUpperCase()}</a>
        </li>)}
      </ul>
    </details>
  </main>;
}

