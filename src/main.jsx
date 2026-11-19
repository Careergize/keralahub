import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Menu,X,ChevronDown,ArrowRight,LogIn,MessageCircle,Globe,UserCircle,Compass,RefreshCw} from 'lucide-react';
import {adminApi,sessionKey} from './adminApi';
import {SiteContentProvider,useSiteContent,useCollection,useSetting,safeUrl,mediaUrl} from './siteContent';
import {navigationRows} from './contentModel';
import CmsPageFrame,{Dialog} from './CmsPageFrame';
import {SheetImage} from './ContentCollection';
import CmsForm from './CmsForm';
import Login from './Login';
import cmsSchema from './cmsSchema.json';
import {whatsappUrl} from './whatsapp';
import './style.css';
import './contact.css';

const currentPath=window.location.pathname.replace(/\/?$/,'/');
const adminViews=Object.fromEntries(['Customers','Bookings','Enquiries','Invoices','Quotations','Packages','Subscribers',...Object.keys(cmsSchema)].map(name=>['/dashboard/'+name.toLowerCase()+'/',name]));
adminViews['/dashboard/']='Dashboard';
const adminView=adminViews[currentPath];
const isDashboard=Boolean(adminView),isLogin=currentPath==='/login/'||isDashboard;
if(isDashboard&&!sessionStorage.getItem(sessionKey))window.location.replace('/login/');

function Brand(){
  const name=useSetting('brandName'),logo=useSetting('logoUrl');
  return (name||mediaUrl(logo))&&<a href="/" className="brand">{mediaUrl(logo)?<SheetImage url={logo} alt={name} className="brand-logo"/>:name}</a>;
}
function NavLinks({location,onNavigate,loginOnly=false}){
  const {collections}=useSiteContent();
  const rows=navigationRows(collections,location).filter(row=>!(['Header','Header actions'].includes(location)&&/^\/login\/?(?:[?#]|$)/.test(row.Link))).filter(row=>location!=='Header actions'||(row.Link.split(/[?#]/)[0]==='/login/')===loginOnly);
  const seen=new Set();
  const link=row=><a key={row.ID} className={location==='Header actions'?(loginOnly?'header-login':'pill'):undefined} href={safeUrl(row.Link)} target={row.Target==='_blank'?'_blank':undefined} rel={row.Target==='_blank'?'noopener noreferrer':undefined} aria-current={row.Link===currentPath?'page':undefined} onClick={event=>{const details=event.currentTarget.closest('details');if(details)details.open=false;onNavigate?.();}}>{location==='Header actions'&&(loginOnly?<LogIn size={16}/>:<MessageCircle size={17}/>)}{row.Label}</a>;
  return rows.map(row=>{const group=row.Group;if(!group)return link(row);if(seen.has(group))return null;seen.add(group);return <details className="pages-dropdown relative" key={group}><summary>{group}<ChevronDown size={13}/></summary><div>{rows.filter(row=>row.Group===group).map(link)}</div></details>;});
}
function Welcome(){
  const image=useSetting('welcomeImage'),enabled=useSetting('welcomeEnabled'),title=useSetting('welcomeTitle'),link=useSetting('welcomeLink'),button=useSetting('welcomeButton');
  const [open,setOpen]=useState(()=>!sessionStorage.getItem('kerala-welcome-seen'));
  if(!open||enabled!=='Yes'||!mediaUrl(image))return null;
  return <Dialog title={title} onClose={()=>{sessionStorage.setItem('kerala-welcome-seen','Yes');setOpen(false);}}><SheetImage url={image} alt={title} className="w-full rounded-xl"/>{safeUrl(link)&&button&&<a className="pill mt-5" href={safeUrl(link)}>{button}</a>}</Dialog>;
}
function Footer({onPlan}){
  const title=useSetting('newsletterTitle'),description=useSetting('newsletterDescription'),enabled=useSetting('newsletterEnabled');
  const label=useSetting('ui.email'),button=useSetting('ui.subscribe'),saving=useSetting('ui.saving'),saved=useSetting('ui.subscribed');
  const address=useSetting('address'),copyright=useSetting('copyrightText'),explore=useSetting('footerExploreTitle'),plan=useSetting('footerPlanTitle'),social=useSetting('footerSocialTitle');
  const [status,setStatus]=useState(''),[busy,setBusy]=useState(false);
  async function subscribe(event){event.preventDefault();if(busy)return;const form=event.currentTarget;setBusy(true);setStatus(saving);try{await adminApi('subscribe',{email:new FormData(form).get('email')});setStatus(saved);form.reset();}catch(error){setStatus(error.message);}finally{setBusy(false);}}
  return <footer><div className="wrap">
    {enabled==='Yes'&&<div className="newsletter"><div>{title&&<h2>{title}</h2>}{description&&<p>{description}</p>}</div><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">{label}</label><input id="newsletter-email" name="email" type="email" aria-label={label} placeholder={label} required/>{button&&<button className="pill" disabled={busy}>{busy?saving:button}<ArrowRight size={16}/></button>}<p role="status">{status}</p></form></div>}
    <div className="footer-links"><div><Brand/>{address&&<p className="mt-4 whitespace-pre-wrap">{address}</p>}</div><div>{explore&&<h3>{explore}</h3>}<NavLinks location="Footer explore"/></div><div>{plan&&<h3>{plan}</h3>}<NavLinks location="Footer plan"/></div><div>{social&&<h3>{social}</h3>}<NavLinks location="Footer social"/></div></div>
    {copyright&&<p className="copyright">{copyright.replaceAll('{year}',String(new Date().getFullYear()))}</p>}
  </div></footer>;
}
function App(){
  const {collections,loading,error,refresh}=useSiteContent();
  const pages=useCollection('Pages');
  const brand=useSetting('brandName'),currency=useSetting('currency'),whatsappNumber=useSetting('whatsappNumber'),whatsappMessage=useSetting('whatsappMessage'),whatsappLabel=useSetting('ui.whatsapp'),menuLabel=useSetting('ui.menu'),tripTitle=useSetting('ui.enquiryTitle'),tripForm=useSetting('tripFormKey');
  const [menu,setMenu]=useState(false),[planner,setPlanner]=useState(false);
  useEffect(()=>{
    const page=pages.find(row=>row.Path===currentPath);
    document.title=isLogin?(adminView||'Sign in'):(page?[page.Title,brand].filter(Boolean).join(' | '):'Website');
    let meta=document.querySelector('meta[name="description"]');
    if(!meta){meta=document.createElement('meta');meta.name='description';document.head.append(meta);}
    meta.content=page?.Description||'';
  },[pages,brand]);
  const loaded=Object.keys(collections).length>0;
  if(!isLogin&&(loading||(!loaded&&error)))return <main className="site-loading" aria-busy={loading}><div className="loading-panel"><div className="loading-emblem" aria-hidden="true"><Compass size={36} strokeWidth={1.5}/></div><div role={loading?'status':'alert'} aria-live="polite"><p className="loading-eyebrow">{loading?'Your next adventure awaits':'Let’s try that again'}</p><h1>{loading?'Welcome to Kerala Hub Holidays':'We couldn’t load this page'}</h1><p className="loading-description">{loading?'Gathering the details for your next getaway…':'Please check your connection and try again in a moment.'}</p></div>{loading?<div className="loading-progress" aria-hidden="true"><span/></div>:<button className="pill" onClick={refresh}><RefreshCw size={16}/>Try again</button>}</div></main>;
  return <>
    <header className={isDashboard?"site-header admin-site-header":"site-header"}><Brand/>
      {isDashboard?<button className="ml-auto md:hidden" aria-label="Open admin menu" onClick={()=>document.getElementById('mobile-admin-menu')?.showModal()}><Menu/></button>:<><nav id="public-navigation" aria-label={menuLabel||'Navigation'} className={menu?'nav open':'nav'}><NavLinks location="Header" onNavigate={()=>setMenu(false)}/></nav><div className="header-actions">{currency&&<span><Globe size={17}/>{currency}</span>}{tripForm&&tripTitle&&<button aria-label={tripTitle} onClick={()=>setPlanner(true)}><UserCircle size={19}/></button>}<NavLinks location="Header actions"/></div><button aria-controls="public-navigation" className="mobile-toggle" aria-label={menuLabel||'Navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></>}
    </header>
    {!isLogin&&error&&<div role="status" className="bg-amber-50 px-5 py-3 text-sm">Live updates are unavailable. Showing the last loaded sheet content. <button className="underline" onClick={refresh}>Retry</button></div>}
    {isLogin?<Login showDashboard={isDashboard} adminView={adminView}/>:<><CmsPageFrame path={currentPath}/><Footer onPlan={()=>setPlanner(true)}/>{currentPath==='/'&&<Welcome/>}</>}
    {!isLogin&&whatsappNumber&&whatsappMessage&&<a className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#12753c] text-white shadow-lg" href={whatsappUrl(whatsappMessage,whatsappNumber)} aria-label={whatsappLabel||'WhatsApp'} target="_blank" rel="noopener noreferrer"><MessageCircle/></a>}
    {planner&&<Dialog title={tripTitle} onClose={()=>setPlanner(false)}><CmsForm formKey={tripForm}/></Dialog>}
  </>;
}
createRoot(document.getElementById('root')).render(<SiteContentProvider><App/></SiteContentProvider>);
