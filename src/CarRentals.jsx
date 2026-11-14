import React, {useRef, useState} from 'react';
import {Car, MessageCircle, Search, Users} from 'lucide-react';
import {openWhatsAppEnquiry} from './whatsapp';

const vehicles = [
  {type:'Compact car', seats:4, image:19, dailyRate:2000},
  {type:'Sedan', seats:4, image:8, dailyRate:2500},
  {type:'SUV', seats:6, image:14, dailyRate:3500},
];
const banner = 'https://atlastrip-wp.egenstheme.com/wp-content/plugins/atlastrip-core/inc/theme-options/images/breadcrumb/breadcrumb-bg.webp';
const imageBase = 'https://atlastrip-wp.egenstheme.com/wp-content/uploads/2026/08/';
const field = 'block w-full min-w-0 rounded-full border border-neutral-200 bg-white px-3 py-2.5 text-base';

const rentalPreferences = {
  Transmission: ['Automatic','Manual'],
  'Fuel type': ['Petrol','Diesel','Hybrid','Electric'],
  'Payment option': ['Pay now','Pay later'],
  Cancellation: ['Free cancellation','Non-refundable'],
  Promotions: ['Available offers'],
};
export default function CarRentals(){
  const [service,setService] = useState('rent');
  const [sort,setSort] = useState('default');
  const [trip,setTrip] = useState(null);
  const [type,setType] = useState('');
  const [passengers,setPassengers] = useState('');
  const [budget,setBudget] = useState('');
  const [preferences,setPreferences] = useState({});
  const form = useRef(null);
  const results = useRef(null);
  const matches = vehicles.filter(vehicle=>(!type||vehicle.type===type)&&vehicle.seats>=Number(passengers)&&(!(Number(budget)>0)||vehicle.dailyRate<=Number(budget)));

  if(sort==='capacity') matches.sort((first,second)=>second.seats-first.seats);

  function search(event){
    event.preventDefault();
    setTrip(Object.fromEntries(new FormData(event.currentTarget)));
    results.current.scrollIntoView();
  }

  function enquire(vehicle){
    if(service==='ticket'){
      setService('rent');
      form.current.scrollIntoView({block:'center'});
      return;
    }
    if(!form.current.reportValidity()){
      form.current.scrollIntoView({block:'center'});
      return;
    }
    const details = new FormData(form.current);
    details.set('Vehicle',vehicle.type);
    if(passengers) details.set('Passengers',passengers);
    if(Number(budget)>0) details.set('Maximum daily budget (INR)',budget);
    for(const [label,value] of Object.entries(preferences)){
      if(value) details.set(label,value);
    }
    openWhatsAppEnquiry('Kerala Hub Holidays — Car Rental Enquiry', details);
  }

  return <main>
    <section className="mx-[1.2%] grid min-h-[594px] content-center gap-6 rounded-2xl bg-slate-700 bg-cover bg-center px-4 py-12 text-center text-white" style={{backgroundImage:'linear-gradient(#0005,#0006),url('+banner+')'}}>
      <h1 className="text-4xl font-semibold md:text-[60px]">Transport</h1>
      <form ref={form} onSubmit={search} className="mx-auto grid w-full max-w-[1320px] items-end gap-4 rounded-2xl bg-white px-5 py-7 md:px-9 md:pb-10 text-left text-neutral-900 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_1fr_auto]">
        <div className="col-span-full flex w-fit rounded-full bg-blue-50 text-sm font-medium text-brand">
          <button type="button" aria-pressed={service==='rent'} className={service==='rent'?'pill py-1.5':'px-3 py-1.5'} onClick={()=>setService('rent')}>For Rent</button>
          <button type="button" aria-pressed={service==='ticket'} className={service==='ticket'?'pill py-1.5':'px-3 py-1.5'} onClick={()=>setService('ticket')}>For Ticket</button>
        </div>
        {service==='ticket'?<div className="col-span-full flex flex-wrap items-center justify-between gap-4">
          <p>Enquire about train or bus tickets.</p>
          <a className="pill" href="/contact/?message=I%20would%20like%20to%20enquire%20about%20transport%20tickets.#enquiry">Enquire about tickets</a>
        </div>:<>
        <label className="grid gap-1 text-sm font-medium">Pick-up location<input className={field} name="Pick-up location" placeholder="e.g. Kochi Airport" required/></label>
        <label className="grid gap-1 text-sm font-medium">Drop-off location<input className={field} name="Drop-off location" placeholder="e.g. Munnar" required/></label>
        <label className="grid gap-1 text-sm font-medium">Pick-up date and time<input className={field} type="datetime-local" name="Pick-up date and time" required/></label>
        <label className="grid gap-1 text-sm font-medium">Service type<select className={field} name="Service type"><option>One-way transfer</option><option>Round trip</option><option>Local sightseeing</option><option>Multi-day rental</option></select></label>
        <button className="pill min-h-12 sm:col-span-2 lg:col-span-1"><Search size={17}/> Search</button>
        </>}
      </form>
      <p className="font-medium">Airport transfers, sightseeing and multi-day rentals across Kerala.</p>
    </section>

    <section ref={results} className="wrap section grid items-start gap-6 lg:grid-cols-[minmax(230px,1fr)_minmax(0,2.07fr)]" aria-labelledby="rental-heading">
      <aside className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2"><h3>Filter</h3><button className="text-sm text-brand" onClick={()=>{setType('');setPassengers('');setBudget('');setPreferences({})}}>Reset</button></div>
        <label className="grid gap-1 text-sm">Vehicle category<select className={field} value={type} onChange={e=>setType(e.target.value)}><option value="">All vehicles</option>{vehicles.map(vehicle=><option key={vehicle.type}>{vehicle.type}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Passengers<select className={field} value={passengers} onChange={e=>setPassengers(e.target.value)}><option value="">Any capacity</option>{[1,2,3,4,5,6].map(count=><option key={count}>{count}</option>)}</select></label>
        <div className="grid gap-4 border-t border-neutral-200 pt-5">
          <p className="text-sm text-neutral-600">Add preferences to your enquiry for a quote.</p>
          <label className="grid gap-1 text-sm">Pricing
            <input className={field} type="number" min="1" step="1" placeholder="Max per day (₹)" aria-label="Maximum daily budget in INR" value={budget} onChange={event=>setBudget(event.target.value)}/>
          </label>
          {Object.entries(rentalPreferences).map(([label,options])=>(
            <label className="grid gap-1 text-sm" key={label}>{label}
              <select className={field} value={preferences[label]||''} onChange={event=>setPreferences({...preferences,[label]:event.target.value})}>
                <option value="">Any</option>
                {options.map(option=><option key={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
      </aside>
      <div>
        <h2 id="rental-heading" className="sr-only">Explore Rental Vehicles</h2>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="my-4 text-sm text-neutral-600" role="status">{matches.length} vehicle options{trip?' for '+trip['Pick-up location']+' to '+trip['Drop-off location']:''}. </p><label className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm">Sort by <select value={sort} onChange={event=>setSort(event.target.value)}><option value="default">Default</option><option value="capacity">Most seats</option></select></label></div>
        <div className="grid gap-4">
          {matches.map(vehicle=><article key={vehicle.type} className="tour grid items-center gap-3 rounded-xl p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,.8fr)]">
            <img src={imageBase+'transport-card'+vehicle.image+'.webp'} alt="" loading="lazy" className="h-[230px] w-full rounded-lg object-cover"/>
            <div className="px-3 py-4">
              <h3 className="text-xl">{vehicle.type}</h3>
              <div className="my-3 flex flex-wrap gap-4 text-sm text-neutral-600">
                <span className="inline-flex items-center gap-1.5"><Car size={16}/> {vehicle.type}</span>
                <span className="inline-flex items-center gap-1.5"><Users size={16}/> Up to {vehicle.seats} passengers</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 px-3 py-4 sm:col-start-2 xl:col-start-auto xl:border-l xl:border-neutral-200">
              <div><p className="text-xl font-semibold">₹{vehicle.dailyRate.toLocaleString('en-IN')} <span className="text-sm font-normal">/ day</span></p><p className="text-xs text-neutral-600">Estimated rate</p></div>
              <button className="pill rounded-md px-3 text-sm" onClick={()=>enquire(vehicle)}><MessageCircle size={17}/> Enquire on WhatsApp</button>
            </div>
          </article>)}
        </div>
        {matches.length===0&&<p className="rounded-xl bg-white p-5">Try changing the vehicle category, passenger count, or daily budget.</p>}
      </div>
    </section>
  </main>;
}
