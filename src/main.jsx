import React, {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight, Binoculars, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleUser, Compass, Globe, Heart, MapPin, Menu, MessageCircle, Search, X} from 'lucide-react';
import {asset, experiences, regions, tours} from './data';
import './style.css';
import Contact from './Contact';
import Holidays from './Holidays';
import Visa from './Visa';
import Hotels from './Hotels';
import HomeOffers from './HomeOffers';
import TopDestinations from './TopDestinations';
import TravelBenefits from './TravelBenefits';
import {destinationPhotos} from './destinationPhotos';

const isContact = ['/contact','/contact/'].includes(window.location.pathname);
const isHolidays = ['/holidays','/holidays/'].includes(window.location.pathname);
const isVisa = ['/visa-category','/visa-category/'].includes(window.location.pathname);
const isHotels = ['/hotel','/hotel/'].includes(window.location.pathname);
if (isHotels) document.title = 'Hotels | Kerala Hub Holidays';
if (isVisa) document.title = 'Visa Processing | Kerala Hub Holidays';
if (isContact) document.title = 'Contact Us | Kerala Hub Holidays';
if (isHolidays) document.title = 'Vacation Packages | Kerala Hub Holidays';

const places = Object.values(regions).flat();
const photos = [4,2,5,1,6,9,7,8].map((n) => asset('package-details-gallery-img'+n+(n >= 6 ? '-1024x643' : '')+'.webp'));
const links = [['Home','#home'],['Destination','#destinations'],['Pages','#about'],['Holidays','/holidays/'],['Contact','/contact/']];

function Brand(){
  return <a href="/#home" className="brand"><img src="/kerala-hub-logo.png" width="346" height="105" alt="Kerala Hub Holidays"/></a>;
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
  const [menu,setMenu]=useState(false);
  const [mode,setMode]=useState('Tours');
  const [destination,setDestination]=useState('');
  const [category,setCategory]=useState('');
  const [date,setDate]=useState('');
  const [filter,setFilter]=useState(null);
  const [dialog,setDialog]=useState(null);
  const [tripPlace,setTripPlace]=useState('');
  const [tripDate,setTripDate]=useState('');
  const [summary,setSummary]=useState('');
  const [newsletter,setNewsletter]=useState('');
  const searchRef=useRef(null);
  const results = (filter?.mode==='Experience'?experiences:tours).filter(tour=>
    (!filter?.destination||tour.places.includes(filter.destination)) && (!filter?.category||tour.type===filter.category));
  const search = (place=destination,kind=mode,type=category) => {
    setDestination(place); setFilter({destination:place,mode:kind,category:type});
    searchRef.current.scrollIntoView({behavior:'smooth'});
  };
  function plan(place=''){
    setTripPlace(place); setSummary(''); setDialog({kind:'plan'});
  }
  return <>
    <header id="home" className="site-header">
      <Brand/>
      <nav className={menu?'nav open':'nav'} aria-label="Main navigation">{links.map(([label,href],i)=>label==='Pages'?<details className='pages-dropdown relative' key={label} onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary').focus();}}}><summary className={isVisa||isHotels?'active':''}>Pages <ChevronDown size={13}/></summary><div><a href='/#about'>About Us</a><a href='/visa-category/' aria-current={isVisa?'page':undefined}>Visa</a><a href='/hotel/' aria-current={isHotels?'page':undefined}>Hotels</a></div></details>:<a key={href} href={href.startsWith("#")?"/"+href:href} onClick={()=>setMenu(false)} className={i===(isVisa||isHotels?-1:isContact?4:isHolidays?3:0)?'active':''}>{label}{[1,2].includes(i)&&<ChevronDown size={13}/>}</a>)}</nav>
      <div className="header-actions"><span><Globe size={17}/> INR</span><button aria-label="Open trip planner" onClick={()=>plan()}><CircleUser size={19}/></button><a className="pill" href="/contact/"><MessageCircle size={17}/> Contact Us</a></div>
      <button className="mobile-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>

    {isHotels?<Hotels/>:isVisa?<Visa/>:isContact?<Contact/>:isHolidays?<Holidays renderTour={tour=><TourCard key={tour.title} tour={tour} onOpen={tour=>setDialog({kind:'tour',tour})}/>}/>:<main>
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
            <label><MapPin/><span>Destination<select value={destination} onChange={e=>setDestination(e.target.value)}><option value="">Select destination</option>{places.map(p=><option key={p}>{p}</option>)}</select></span></label>
            <label><CalendarDays/><span>Travel date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></span></label>
            <label><Compass/><span>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{[...new Set((mode==='Tours'?tours:experiences).map(t=>t.type))].map(t=><option key={t}>{t}</option>)}</select></span></label>
            <button className="pill" type="submit"><Search size={18}/> Search</button>
          </form>}
          <p className="search-note">Can’t find what you’re looking for? <button onClick={()=>plan(destination)}>Create</button> your custom itinerary.</p>
        </div>
      </div>

      <HomeOffers/>

      <section className="wrap section about" id="about">
        <div className="avatars">{[1,2,3,4].map(i=><img key={i} src={asset('travel-partner-img'+i+'.png')} alt="" loading="lazy"/>)}</div>
        <h2>Kerala Hub Holidays, Your Travel Partner!</h2>
        <p className="intro">Explore Kerala with personalized itineraries, curated tour packages and local travel guidance.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {['Historical Landmark Itinerary','Expert Private Tour Guide','Handpicked Travel Experience'].map((title,i)=><article className="info" key={title}><img src={asset('travel-info-card-img'+(i+1)+'.svg')} alt=""/><h3>{title}</h3><p>{['Explore the forts, palaces and historic streets that tell Kerala’s story.','Discover local stories and favorite spots with a private guide.','Make time for the places and experiences you want to see most.'][i]}</p></article>)}
        </div>
      </section>

      <section className="wrap section grid items-center gap-10 lg:grid-cols-2" aria-labelledby="explore-heading">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-[#e8f3ff] px-4 py-2 text-sm font-semibold text-brand">Best Travel Agency in Kerala</p>
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
        <div className="section-head"><h2>{filter?.mode==='Experience'?'Travel Experiences':'Featured Travel Packages'}</h2><button className="outline" onClick={()=>setFilter(null)}>View all packages <ArrowRight size={16}/></button></div>
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

      <section className="section" id="inspiration" aria-labelledby="inspiration-heading">
        <div className="wrap">
          <div className="mb-8 md:mb-14">
            <p className="mb-2 text-sm font-semibold text-brand">Get to know more with Kerala hub</p>
            <h2 id="inspiration-heading">Travel Tips &amp; Inspirations.</h2>
          </div>
          <div className="cards">
            {experiences.map((item,i)=>{
              const title=['What to expect on a backwater cruise','Planning a trip to Munnar’s tea country','A walking guide to Fort Kochi'][i];
              const tip=[
                'Ask which canals the route covers and whether meals are included. A daytime cruise works well for a short visit, while an overnight stay gives you more time on the water.',
                'Leave time for a tea estate visit and a tasting. Pack a light layer for cooler mornings and check whether the estate requires advance booking.',
                'Start near the Chinese fishing nets, then walk toward St. Francis Church and the heritage streets. An early start gives you time to explore before the midday heat.',
              ][i];
              const photo=destinationPhotos[item.places[0]];
              return <article key={item.title}>
                <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="h-[280px] w-full object-cover"/>
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium"><MapPin size={15}/> {item.places[0]}</span>
                </div>
                <h3 className="mt-4 text-xl">{title}</h3>
                <button className="outline mt-4" aria-label={'Read more about '+title} onClick={()=>setDialog({kind:'tour',tour:{...item,title,detail:tip}})}>Read More <ArrowRight size={16}/></button>
                <p className="mt-3 text-xs text-neutral-500">Photo by <a className="underline" href={photo.source}>{photo.author}</a> · <a className="underline" href={'https://creativecommons.org/licenses/'+photo.license+'/'}>CC {photo.license.replace('/',' ').toUpperCase()}</a></p>
              </article>;
            })}
          </div>
        </div>
      </section>
      <div className="gallery" aria-label="Travel gallery">{[1,2,3,4,5].map(i=><button key={i} aria-label={'Open gallery image '+i} onClick={()=>setDialog({kind:'image',image:i})}><img src={asset('gallery-img-'+i+'.webp')} alt="" loading="lazy"/></button>)}</div>
    </main>}

    <footer id="contact">
      <div className="wrap">
        <div className="newsletter"><div><h2>Get travel ideas from Kerala Hub Holidays</h2><p>Save your email for this browser preview.</p></div><form onSubmit={e=>{e.preventDefault();const email=new FormData(e.currentTarget).get('email');localStorage.setItem('kerala-newsletter',email);setNewsletter('Email saved on this device.');}}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" placeholder="Your email address" required/><button className="pill">Subscribe <ArrowRight size={16}/></button><p role="status">{newsletter}</p></form></div>
        <div className="footer-links"><div><Brand/><p className="mt-4">Kerala, India</p></div><div><h3>Explore</h3><a href="/#about">About us</a><a href="/holidays/">Holiday packages</a><a href="/#inspiration">Travel inspirations</a></div><div><h3>Plan Your Trip</h3><a href="/#destinations">Destinations</a><a href="/#experiences">Experiences</a><a href="/contact/">Contact Us</a><button onClick={()=>plan()}>Custom itinerary</button></div></div>
        <p className="copyright">© {new Date().getFullYear()} Kerala Hub Holidays. All rights reserved.</p>
      </div>
    </footer>

    {dialog&&<Dialog onClose={()=>setDialog(null)} title={dialog.kind==='plan'?'Plan Your Kerala Holiday':dialog.kind==='tour'?dialog.tour.title:'Travel gallery'}>
      {dialog.kind==='image'&&<img className="w-full rounded-xl" src={asset('gallery-img-'+dialog.image+'.webp')} alt={'Travel gallery image '+dialog.image}/>}
      {dialog.kind==='tour'&&<><img className="aspect-video w-full rounded-xl object-cover" src={destinationPhotos[dialog.tour.places[0]].src} alt={destinationPhotos[dialog.tour.places[0]].alt}/><p className="my-4">{dialog.tour.detail}</p><p className="mb-5 text-neutral-600">{dialog.tour.days} {dialog.tour.days===1?'day':'days'} · {dialog.tour.places.join(' › ')}</p><button className="pill" onClick={()=>plan(dialog.tour.places[0])}>Plan This Trip <ArrowRight size={16}/></button></>}
      {dialog.kind==='plan'&&<form className="plan-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);setSummary(tripPlace+' · '+tripDate+' · '+data.get('travelers')+' traveler(s)'+(data.get('preferences')?' · '+data.get('preferences'):''));}}>
        <label>Destination<select required value={tripPlace} onChange={e=>setTripPlace(e.target.value)}><option value="">Select destination</option>{places.map(p=><option key={p}>{p}</option>)}</select></label>
        <label>Travel date<input required type="date" value={tripDate} onChange={e=>setTripDate(e.target.value)}/></label>
        <label>Travelers<input type="number" name="travelers" required min="1" defaultValue="2"/></label>
        <label>Preferences<textarea name="preferences" rows="3"/></label>
        <button className="pill">Create trip summary <ArrowRight size={16}/></button>
        {summary&&<div className="summary" role="status"><strong>Your trip summary</strong><p>{summary}</p></div>}
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



