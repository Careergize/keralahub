import React, {useRef, useState} from 'react';
import {ArrowRight, CalendarDays, MapPin, Search, Users} from 'lucide-react';
import {regions} from './data';

const stays = [
  ['Tea Estate Resort','Munnar',20], ['Backwater Retreat','Alappuzha',19],
  ['Forest Resort','Wayanad',18], ['Heritage Boutique Hotel','Kochi',17],
  ['Cliffside Beach Resort','Varkala',16], ['Wildlife Lodge','Thekkady',15],
  ['Hill View Hotel','Munnar',14], ['Waterfront Hotel','Kochi',13],
];
const banner = 'https://atlastrip-wp.egenstheme.com/wp-content/plugins/atlastrip-core/inc/theme-options/images/breadcrumb/breadcrumb-bg.webp';
const artwork = 'https://atlastrip-wp.egenstheme.com/wp-content/uploads/2026/07/';
const field = 'flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2 text-left text-sm';
const input = 'min-w-0 w-full rounded-md bg-neutral-50 p-1.5';

export default function Hotels(){
  const resultsRef=useRef(null);
  const [checkIn,setCheckIn]=useState('');
  const [checkOut,setCheckOut]=useState('');
  const [criteria,setCriteria]=useState({});
  const invalidDates=checkIn && checkOut && checkOut<=checkIn;
  const shown=stays.filter(([,place])=>!criteria.location||criteria.location===place);

  function search(event){
    event.preventDefault();
    if(invalidDates) return;
    setCriteria(Object.fromEntries(new FormData(event.currentTarget)));
    resultsRef.current.scrollIntoView();
  }

  function enquire(name,place){
    const message = [
      'I would like to enquire about a '+name.toLowerCase()+' in '+place+'.',
      criteria.checkIn && 'Check-in: '+criteria.checkIn,
      criteria.checkOut && 'Check-out: '+criteria.checkOut,
      criteria.guests && 'Guests: '+criteria.guests,
      criteria.rooms && 'Rooms: '+criteria.rooms,
    ].filter(Boolean).join('\n');
    return '/contact/?destination='+encodeURIComponent(place)+'&message='+encodeURIComponent(message)+'#enquiry';
  }

  return <main>
    <section className="mx-[1.2%] grid min-h-[510px] content-center gap-7 rounded-[20px] bg-slate-700 bg-cover bg-center px-3 py-12 text-center text-white" style={{backgroundImage:'linear-gradient(#0003,#0004),url('+banner+')'}}>
      <h1 className="text-4xl font-semibold sm:text-5xl md:text-[60px]">Luxury Hotel</h1>
      <form onSubmit={search} className="mx-auto grid w-full max-w-[1060px] gap-3 rounded-2xl bg-white p-4 text-neutral-900 sm:grid-cols-2 lg:mt-3 lg:grid-cols-[1fr_1.3fr_1fr_auto]">
        <label className={field}><MapPin size={17} className="text-brand"/> Location
          <select className={input} name="location"><option value="">Select location</option>{Object.values(regions).flat().map(place=><option key={place}>{place}</option>)}</select>
        </label>
        <fieldset className={field}>
          <legend className="sr-only">Stay dates</legend>
          <CalendarDays size={17} className="text-brand"/> Stay dates
          <div className="grid w-full grid-cols-2 gap-2">
            <label>Check in<input className={input} type="date" name="checkIn" value={checkIn} onChange={e=>setCheckIn(e.target.value)} required={!!checkOut}/></label>
            <label>Check out<input className={input} type="date" name="checkOut" min={checkIn||undefined} value={checkOut} onChange={e=>setCheckOut(e.target.value)} required={!!checkIn}/></label>
          </div>
        </fieldset>
        <fieldset className={field}>
          <legend className="sr-only">Guests and rooms</legend>
          <Users size={17} className="text-brand"/> Guests and rooms
          <div className="grid w-full grid-cols-2 gap-2">
            <label>Guests<input className={input} type="number" name="guests" defaultValue="2" min="1" required/></label>
            <label>Rooms<input className={input} type="number" name="rooms" defaultValue="1" min="1" required/></label>
          </div>
        </fieldset>
        <button className="pill self-center justify-self-center"><Search size={17}/> Search</button>
        {invalidDates && <p className="text-left text-sm text-red-700 sm:col-span-full" role="status">Choose a check-out date after check-in.</p>}
      </form>
      <p className="font-medium">Explore hotels and resorts across Kerala.</p>
    </section>
    <section ref={resultsRef} className="wrap section" aria-labelledby="hotel-results">
      <h2 id="hotel-results">Explore Hotels</h2>
      <p className="mb-7 mt-3 text-sm text-neutral-600" role="status">{shown.length} stay ideas{criteria.location?' in '+criteria.location:''}. Enquire for hotel options, rates and availability.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{shown.map(([name,place,image])=><article key={name} className="tour flex flex-col">
        <img src={artwork+'hotel-card'+image+'.webp'} alt="" loading="lazy" className="aspect-[1.4] w-full bg-slate-100 object-cover"/>
        <div className="flex flex-1 flex-col items-start gap-3 p-5">
          <h3>{name}</h3>
          <p className="flex items-center gap-1 text-sm text-neutral-600"><MapPin size={15}/> {place}</p>
          <a className="outline mt-2" href={enquire(name,place)}>Enquire about availability <ArrowRight size={15}/></a>
        </div>
      </article>)}</div>
    </section>
  </main>;
}
