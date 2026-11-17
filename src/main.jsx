import {openWhatsAppEnquiry, whatsappUrl} from './whatsapp';
import Testimonials from './Testimonials';
import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, Binoculars, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Compass, Globe, Heart, MapPin, Menu, MessageCircle, Search, X} from 'lucide-react';
import {asset, experiences, regions, tours} from './data';
import './style.css';
import Contact from './Contact';
import Holidays from './Holidays';
import Visa from './Visa';
import Hotels from './Hotels';
import CarRentals from './CarRentals';
import HomeOffers from './HomeOffers';
import TopDestinations from './TopDestinations';
import TravelBenefits from './TravelBenefits';
import {destinationPhotos} from './destinationPhotos';

const isContact = ['/contact','/contact/'].includes(window.location.pathname);
const isHolidays = ['/holidays','/holidays/'].includes(window.location.pathname);
const isVisa = ['/visa-category','/visa-category/'].includes(window.location.pathname);
const isHotels = ['/hotel','/hotel/'].includes(window.location.pathname);
const isCarRentals = ['/transport','/transport/'].includes(window.location.pathname);
if (isCarRentals) document.title = 'Car Rentals | Kerala Hub Holidays';
if (isHotels) document.title = 'Hotels | Kerala Hub Holidays';
if (isVisa) document.title = 'Visa Processing | Kerala Hub Holidays';
if (isContact) document.title = 'Contact Us | Kerala Hub Holidays';
if (isHolidays) document.title = 'Vacation Packages | Kerala Hub Holidays';

const places = Object.values(regions).flat();
const photos = [4,2,5,1,6,9,7,8].map((n) => asset('package-details-gallery-img'+n+(n >= 6 ? '-1024x643' : '')+'.webp'));
const links = [['Home','#home'],['Destination','#destinations'],['Pages','#about'],['Holidays','/holidays/'],['Car Rentals','/transport/'],['Contact','/contact/']];

function Brand(){
  return <a href="/#home" className="brand"><img src="/kerala-hub-holidays-logo.jpg" width="1080" height="1350" alt="Kerala Hub Holidays"/></a>;
}

function TourCard({tour, onOpen}){
  const [photo,setPhoto] = useState(0);
  const [saved,setSaved] = useState(false);
  const images = tour.places.map(place=>destinationPhotos[place]);
  return <article className="tour">
    <div className="tour-photo group">
      <img src={images[photo].src} alt={images[photo].alt} loading="lazy"/>
      <span className="tag">{tour.type}</span>
      <button className="save" aria-label={saved?'Remove saved tour':'Save tour'} aria-pressed={saved} onClick={()=>setSaved(!saved)}><Heart size={17} fill={saved?'currentColor':'none'}/></button>
      <button className="slide prev" aria-label="Previous photo" hidden={images.length===1} onClick={()=>setPhoto((photo+images.length-1)%images.length)}><ChevronLeft size={17}/></button>
      <button className="slide next" aria-label="Next photo" hidden={images.length===1} onClick={()=>setPhoto((photo+1)%images.length)}><ChevronRight size={17}/></button>
      <div className="dots">{images.length>1&&images.map((_,i)=><button key={i} aria-label={'Show photo '+(i+1)} className={photo===i?'selected':''} onClick={()=>setPhoto(i)}/>)}</div>
    </div>
    <div className="p-5">
      <div className="meta"><span><MapPin size={15}/> {tour.places[0]}</span><span><CalendarDays size={15}/> {tour.days} {tour.days===1?'Day':'Days'}</span></div>
      <button className="tour-title" onClick={()=>onOpen(tour)}>{tour.title}</button>
      <p className="mb-2 text-xs text-neutral-500">Photo by <a className="underline" href={images[photo].source}>{images[photo].author}</a> · <a className="underline" href={"https://creativecommons.org/licenses/"+images[photo].license+"/"}>CC {images[photo].license.replace("/"," ").toUpperCase()}</a></p><p className="text-sm text-neutral-500">{tour.places.join('  ›  ')}</p>
      <div className="tour-bottom"><span>Tailor-made itinerary</span><button className="pill" onClick={()=>onOpen(tour)}>View Tour <ArrowRight size={15}/></button></div>
    </div>
  </article>;
}

function App(){
  useEffect(()=>{
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(!('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries=>{
      for(const {target,isIntersecting} of entries){
        if(!isIntersecting) continue;
        observer.unobserve(target);
        if(!motion.matches) target.classList.add('section-reveal');
      }
    },{threshold:0,rootMargin:'0px 0px -48px 0px'});
    document.querySelectorAll('main > section:not(.hero), main > .search-wrap, main > .gallery, footer > .wrap')
      .forEach(section=>observer.observe(section));
    return ()=>observer.disconnect();
  },[]);
  const [menu,setMenu]=useState(false);
  const [mode,setMode]=useState('Tours');
  const [destination,setDestination]=useState('');
  const [category,setCategory]=useState('');
  const [date,setDate]=useState('');
  const [filter,setFilter]=useState(null);
  const [dialog,setDialog]=useState(null);
  const [tripPlace,setTripPlace]=useState('');
  const [tripDate,setTripDate]=useState('');
  const [newsletter,setNewsletter]=useState('');
  const searchRef=useRef(null);
  const results = (filter?.mode==='Experience'?experiences:tours).filter(tour=>
    (!filter?.destination||tour.places.includes(filter.destination)) && (!filter?.category||tour.type===filter.category));
  const search = (place=destination,kind=mode,type=category) => {
    setDestination(place); setFilter({destination:place,mode:kind,category:type});
    searchRef.current.scrollIntoView({behavior:'smooth'});
  };
  function plan(place=''){
    setTripPlace(place); setDialog({kind:'plan'});
  }
  return <>
    <header id="home" className="site-header">
      <Brand/>
      <nav className={menu?'nav open':'nav'} aria-label="Main navigation">{links.map(([label,href],i)=>label==='Pages'?<details className='pages-dropdown relative' key={label} onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary').focus();}}}><summary className={isVisa||isHotels?'active':''}>Pages <ChevronDown size={13}/></summary><div><a href='/#about'>About Us</a><a href='/visa-category/' aria-current={isVisa?'page':undefined}>Visa</a><a href='/hotel/' aria-current={isHotels?'page':undefined}>Hotels</a></div></details>:<a key={href} href={href.startsWith("#")?"/"+href:href} onClick={()=>setMenu(false)} className={i===(isVisa||isHotels?-1:isContact?5:isHolidays?3:isCarRentals?4:0)?'active':''}>{label}</a>)}</nav>
      <div className="header-actions"><span><Globe size={17}/> INR</span><button aria-label="Open trip planner" onClick={()=>plan()}><CircleUser size={19}/></button><a className="pill" href="/contact/"><MessageCircle size={17}/> Contact Us</a></div>
      <button className="mobile-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>

    {isCarRentals?<CarRentals/>:isHotels?<Hotels/>:isVisa?<Visa/>:isContact?<Contact/>:isHolidays?<Holidays renderTour={tour=><TourCard key={tour.title} tour={tour} onOpen={tour=>setDialog({kind:'tour',tour})}/>}/>:<main>
      <section className="hero">
        <video src={asset('travel-agency-banner-video.mp4')} autoPlay muted loop playsInline aria-hidden="true"/>
        <div className="hero-content">
          <p className="eyebrow">EXCEPTIONAL TRAVEL EXPERIENCE.</p>
          <h1>Travel With Kerala Hub Holidays</h1>
          <p className="hero-copy">We curate exceptional travel experiences across Kerala, from the hills to the backwaters.</p>
          <a href="/#packages" className="hero-button">See all packages <ChevronRight size={16}/></a>
        </div>
      </section>

      <div className="wrap search-wrap">
        <div className="search-box">
          <div className="flex flex-wrap gap-3 sm:gap-4" aria-label="Travel type">{[['Tours',Globe],['Experience',Binoculars],['Visa',Compass]].map(([label,Icon])=><button key={label} className={'tab '+(mode===label?'active':'')} aria-pressed={mode===label} onClick={()=>{setMode(label);setCategory('')}}><Icon size={19}/>{label}</button>)}</div>
          {mode==='Visa'?<div className="visa-panel">Need help planning an international trip? <a className="pill" href="/visa-category/">Explore visa options <ArrowRight size={16}/></a></div>:
          <form className="finder" onSubmit={e=>{e.preventDefault();search()}}>
            <label><MapPin/><span>Destination<select aria-label="Destination" value={destination} onChange={e=>setDestination(e.target.value)}><option value="">Select destination</option>{places.map(p=><option key={p}>{p}</option>)}</select></span></label>
            <label><CalendarDays/><span>Travel date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></span></label>
            <label><Compass/><span>Category<select aria-label="Category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{[...new Set((mode==='Tours'?tours:experiences).map(t=>t.type))].map(t=><option key={t}>{t}</option>)}</select></span></label>
            <button className="pill" type="submit"><Search size={18}/> Search</button>
          </form>}
          <p className="search-note">Can’t find what you’re looking for? <button onClick={()=>plan(destination)}>Create</button> your custom itinerary.</p>
        </div>
      </div>

      <HomeOffers/>

      <section className="section about" id="about">
        <div className="wrap">
        <div className="avatars">{[1,2,3,4].map(i=><img key={i} src={asset('travel-partner-img'+i+'.png')} alt="" loading="lazy"/>)}</div>
        <h2>Kerala Hub Holidays, Your Travel Partner!</h2>
        <p className="intro">Explore Kerala with personalized itineraries, curated tour packages and local travel guidance.</p>
        </div>
      </section>

      <section className="wrap section grid items-center gap-10 lg:grid-cols-2" aria-labelledby="explore-heading">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-tint px-4 py-2 text-sm font-semibold text-brand">Best Travel Agency in Kerala</p>
          <h2 id="explore-heading">Explore the World With Confidence.</h2>
          <p className="mt-5 leading-7 text-neutral-600">Discover Kerala’s backwaters, tea gardens and historic towns, or plan a holiday abroad. Kerala Hub Holidays helps you find destinations and experiences that suit the way you like to travel.</p>
          <p className="mt-4 leading-7 text-neutral-600">Tell us your dates, interests and who’s coming along. We’ll help shape an itinerary around the places and experiences you want to make time for.</p>
          <a href="/holidays/" className="pill mt-7">Discover More <ArrowRight size={17}/></a>
        </div>
        <div className="relative mx-auto aspect-[1.45] w-full max-w-[560px]" aria-hidden="true">
          {[2,3,1].map((image,index)=><img key={image} src={'https://atlastrip-wp.egenstheme.com/wp-content/uploads/2026/07/about-img'+image+'.webp'} alt="" loading="lazy" className={'absolute object-cover shadow-lg '+['left-[2%] top-[12%] h-[77%] w-[46%] -rotate-8 rounded-2xl','right-[2%] top-[12%] h-[77%] w-[46%] rotate-8 rounded-2xl','left-[29%] top-[5%] h-[90%] w-[42%] rounded-2xl border-4 border-white'][index]}/>)}
        </div>
      </section>
      <TravelBenefits/>

      <section className="wrap section" id="packages" ref={searchRef}>
        <div className="mb-7 grid justify-items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center"><h2 className="text-center lg:col-start-2">{filter?.mode==='Experience'?'Travel Experiences':'Best Selling Tours'}</h2><button className="outline lg:justify-self-end" onClick={()=>setFilter(null)}>View all packages <ArrowRight size={16}/></button></div>
        {filter?.mode!=='Experience'&&<div className="mb-6 flex gap-2 overflow-x-auto py-1 sm:flex-wrap" role="group" aria-label="Tour category">
          {['Adventure Tour','Family Tour','Group Tour','Honeymoon Tour','Solo Tour'].map(label=>{
            const type=label==='Honeymoon Tour'?'Honeymoon':label;
            return <button key={type} type="button" aria-pressed={filter?.category===type} className={'inline-flex shrink-0 items-center rounded-full border border-brand/20 px-4 py-2.5 text-sm font-semibold '+(filter?.category===type?'bg-brand text-white':'bg-white text-brand')} onClick={()=>setFilter({mode:'Tours',category:type})}>{label}</button>;
          })}
        </div>}
        {filter&&<p className="mb-5 text-neutral-600" role="status">{results.length} matching {results.length===1?'itinerary':'itineraries'}{filter.destination?' in '+filter.destination:''}{date?' for your trip on '+date:''}.</p>}
        <div className="cards">{results.map(tour=><TourCard key={tour.title} tour={tour} onOpen={tour=>setDialog({kind:'tour',tour})}/>)}</div>
        {!results.length&&<button className="pill" onClick={()=>plan(destination)}>Create a custom itinerary <ArrowRight size={16}/></button>}
      </section>

      <TopDestinations/>

      <section className="wrap section customize">
        <div><h2>Need a Customized Package?</h2><p className="my-4">Create your custom travel journey in just 03 steps.</p><ol className="steps"><li>Choose a destination.</li><li>Select your travel date.</li><li>Add your travel preferences.</li></ol><button className="pill" onClick={()=>plan()}>Select Destination <ArrowRight size={16}/></button></div>
        <aside><MessageCircle size={35}/><h3>Need help planning?</h3><p>Tell us where you’d like to go and what you’d like to do.</p><a className="outline" href="/contact/">Contact Us <ArrowRight size={16}/></a></aside>
      </section>

      <section className="wrap section" id="experiences"><div className="section-head"><h2>Travel Experiences</h2><button className="outline" onClick={()=>search('','Experience','')}>View all experiences <ArrowRight size={16}/></button></div>
        <div className="cards">{experiences.map(tour=><TourCard key={tour.title} tour={tour} onOpen={tour=>setDialog({kind:'tour',tour})}/>)}</div>
      </section>

      <Testimonials/>
      <div className="gallery" aria-label="Travel gallery">{[1,2,3,4,5].map(i=><button key={i} aria-label={'Open gallery image '+i} onClick={()=>setDialog({kind:'image',image:i})}><img src={asset('gallery-img-'+i+'.webp')} alt="" loading="lazy"/></button>)}</div>
    </main>}

    <footer id="contact">
      <div className="wrap">
        <div className="newsletter"><div><h2>Get travel ideas from Kerala Hub Holidays</h2><p>Save your email for this browser preview.</p></div><form onSubmit={e=>{e.preventDefault();const email=new FormData(e.currentTarget).get('email');localStorage.setItem('kerala-newsletter',email);setNewsletter('Email saved on this device.');}}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" placeholder="Your email address" required/><button className="pill">Subscribe <ArrowRight size={16}/></button><p role="status">{newsletter}</p></form></div>
        <div className="footer-links"><div><Brand/><p className="mt-4">Kerala, India</p></div><div><h3>Explore</h3><a href="/#about">About us</a><a href="/holidays/">Holiday packages</a><a href="/#testimonials">Testimonials</a></div><div><h3>Plan Your Trip</h3><a href="/#destinations">Destinations</a><a href="/#experiences">Experiences</a><a href="/contact/">Contact Us</a><button onClick={()=>plan()}>Custom itinerary</button></div></div>
        <p className="copyright">© {new Date().getFullYear()} Kerala Hub Holidays. All rights reserved.</p>
      </div>
    </footer>
    <a
      className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full border-2 border-white bg-[#12753c] text-white shadow-lg hover:bg-[#0d5e30] sm:right-6 sm:bottom-6"
      href={whatsappUrl('Hi Kerala Hub Holidays, I’d like to make a travel enquiry.')}
      aria-label="Quick enquiry on WhatsApp"
      title="Quick enquiry on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.69 14.95L2 22l5.18-1.25A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.18-1.18l-.36-.22-2.65.64.67-2.56-.24-.38A8 8 0 1 1 12 20Z"/>
        <path d="M9 7.5c-.24-.55-.49-.56-.72-.57h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.07-1.1 2.62s1.13 3.04 1.29 3.25c.16.21 2.23 3.4 5.4 4.64 2.64 1.04 3.18.83 3.76.78.57-.05 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37s-1.85-.91-2.14-1.02c-.29-.1-.5-.15-.71.16s-.81 1.02-.99 1.23c-.18.21-.37.24-.68.08-.32-.16-1.33-.49-2.53-1.56-.94-.84-1.57-1.87-1.75-2.19-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.11-.21.06-.39-.02-.55-.08-.16-.69-1.7-.97-2.21Z" transform="translate(1.2 1.2) scale(.9)"/>
      </svg>
    </a>

    {dialog&&<Dialog onClose={()=>setDialog(null)} title={dialog.kind==='plan'?'Plan Your Kerala Holiday':dialog.kind==='tour'?dialog.tour.title:'Travel gallery'}>
      {dialog.kind==='image'&&<img className="w-full rounded-xl" src={asset('gallery-img-'+dialog.image+'.webp')} alt={'Travel gallery image '+dialog.image}/>}
      {dialog.kind==='tour'&&<><img className="aspect-video w-full rounded-xl object-cover" src={destinationPhotos[dialog.tour.places[0]].src} alt={destinationPhotos[dialog.tour.places[0]].alt}/><p className="my-4">{dialog.tour.detail}</p><p className="mb-5 text-neutral-600">{dialog.tour.days} {dialog.tour.days===1?'day':'days'} · {dialog.tour.places.join(' › ')}</p><button className="pill" onClick={()=>plan(dialog.tour.places[0])}>Plan This Trip <ArrowRight size={16}/></button></>}
      {dialog.kind==='plan'&&<form className="plan-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);openWhatsAppEnquiry('Kerala Hub Holidays — Custom Trip Enquiry', [['Destination',tripPlace],['Travel date',tripDate],['Travelers',data.get('travelers')],['Preferences',data.get('preferences')]]);}}>
        <label>Destination<select required value={tripPlace} onChange={e=>setTripPlace(e.target.value)}><option value="">Select destination</option>{places.map(p=><option key={p}>{p}</option>)}</select></label>
        <label>Travel date<input required type="date" value={tripDate} onChange={e=>setTripDate(e.target.value)}/></label>
        <label>Travelers<input type="number" name="travelers" required min="1" defaultValue="2"/></label>
        <label>Preferences<textarea name="preferences" rows="3"/></label>
        <button className="pill">Continue to WhatsApp <ArrowRight size={16}/></button>
      </form>}
    </Dialog>}
  </>;
}

function Dialog({title,children,onClose}){
  return <dialog ref={node=>{if(node&&!node.open)node.showModal()}} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="dialog-content"><div className="section-head"><h2>{title}</h2><button aria-label="Close dialog" onClick={onClose}><X/></button></div>{children}</div>
  </dialog>;
}

createRoot(document.getElementById('root')).render(<App/>);



