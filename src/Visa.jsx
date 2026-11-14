import React, {useRef, useState} from 'react';
import {ArrowRight, BriefcaseBusiness, Check, Globe, GraduationCap, Heart, House, MapPin, Plane, Search, Stethoscope, WalletCards} from 'lucide-react';
import {asset} from './data';

const countries = [
  ['Canada',9], ['Egypt',3], ['India',6], ['Indonesia',2], ['Jordan',8],
  ['Saudi Arabia',7], ['Switzerland',1], ['United Kingdom',4], ['Vietnam',5],
];
const categories = [
  ['Business Visa',BriefcaseBusiness], ['Medical Visa',Stethoscope], ['Spouse Visa',Heart],
  ['Student Visa',GraduationCap], ['Tourist Visa',Plane], ['Work Visa',WalletCards],
];
const countryNames = countries.map(([country])=>country);
const profileOptions = [...countryNames,'Other'];
const banner = 'https://atlastrip-wp.egenstheme.com/travel-agency/wp-content/plugins/atlastrip-core/inc/theme-options/images/breadcrumb/breadcrumb-bg.webp';

function Filter({label,placeholder,options,name,value,onChange,icon:Icon}){
  return <label className="flex min-w-0 items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-left text-neutral-900">
    <Icon size={19} className="shrink-0 text-brand"/>
    <span className="min-w-0 flex-1">
      <select name={name} value={value} onChange={onChange} className="block w-full bg-transparent text-sm font-medium">
        <option value="">{placeholder}</option>
        {options.map(option=><option key={option}>{option}</option>)}
      </select>
      <span className="block text-sm text-neutral-600">{label}</span>
    </span>
  </label>;
}

export default function Visa(){
  const results=useRef(null);
  const [country,setCountry]=useState('');
  const [category,setCategory]=useState('');
  const [search,setSearch]=useState({country:'',category:'',citizenship:'',residence:''});
  const shown=countries.filter(([name])=>!search.country||name===search.country);
  function submit(event){
    event.preventDefault();
    setSearch(Object.fromEntries(new FormData(event.currentTarget)));
    results.current.scrollIntoView();
  }
  function enquiry(name,type){
    const message = [
      'I would like information about '+(type||'visa options')+' for '+name+'.',
      search.citizenship&&'Citizenship: '+search.citizenship,
      search.residence&&'Country of residence: '+search.residence,
    ].filter(Boolean).join('\n');
    return '/contact/?message='+encodeURIComponent(message)+'#enquiry';
  }
  return <main>
    <section className="grid min-h-[555px] content-center gap-6 bg-slate-700 bg-cover bg-center px-3 py-14 text-center text-white" style={{backgroundImage:'linear-gradient(#0003,#0004),url('+banner+')'}}>
      <h1 className="text-4xl font-semibold md:text-[60px]">Visa Processing</h1>
      <form onSubmit={submit} className="mx-auto grid w-full max-w-[1320px] gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2 lg:mt-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:gap-5">
        <Filter label="Country" placeholder="Select Country" options={countryNames} name="country" value={country} onChange={e=>setCountry(e.target.value)} icon={MapPin}/>
        <Filter label="Visa Category" placeholder="Select Category" options={categories.map(([name])=>name)} name="category" value={category} onChange={e=>setCategory(e.target.value)} icon={WalletCards}/>
        <Filter label="Citizenship" placeholder="Select Citizenship" options={profileOptions} name="citizenship" icon={Globe}/>
        <Filter label="Live in" placeholder="Select Residence" options={profileOptions} name="residence" icon={House}/>
        <button className="pill min-h-12 px-8 sm:col-span-2 lg:col-span-1"><Search size={17}/> Search</button>
      </form>
      <p className="font-medium">Explore visa enquiries for {countries.length} destinations.</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-3">{['Country information','Visa categories','Travel enquiries'].map(label=><li className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm backdrop-blur" key={label}><Check size={16} className="rounded-full bg-brand p-0.5"/>{label}</li>)}</ul>
    </section>
    <section ref={results} className="wrap section" aria-label="Visa destinations">
      <div className="mb-8 flex flex-wrap justify-center gap-3" aria-label="Filter by visa category">
        {[['All',Globe],...categories].map(([label,Icon])=>{
          const value=label==='All'?'':label;
          return <button key={label} className={'tab '+(search.category===value?'active':'')} aria-pressed={search.category===value} onClick={()=>{setCategory(value);setSearch({...search,category:value});}}><Icon size={18}/>{label}</button>;
        })}
      </div>
      <p className="mb-5 text-sm text-neutral-600" role="status">{shown.length} {shown.length===1?'destination':'destinations'}{search.category?' · '+search.category:''}. Select a visa type to prepare an enquiry.</p>
      <div className="cards">{shown.map(([name,image])=><article key={name} className="tour">
        <img src={asset('visa-card-img'+image+'.webp')} alt="" loading="lazy" className="aspect-[1.65] w-full object-cover"/>
        <div className="p-5">
          <h2 className="mb-3 text-xl md:text-2xl"><a className="hover:text-brand" href={enquiry(name,search.category)}>{name}</a></h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">{(search.category?[search.category]:categories.map(([label])=>label)).map(type=><li key={type}><a href={enquiry(name,type)} className="inline-flex items-center gap-1.5 hover:text-brand"><Check size={14} className="text-brand"/>{type}</a></li>)}</ul>
          <a className="outline mt-5" href={enquiry(name,search.category)}>Visa enquiry <ArrowRight size={15}/></a>
        </div>
      </article>)}</div>
    </section>
  </main>;
}
