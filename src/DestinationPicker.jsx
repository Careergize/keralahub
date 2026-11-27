import React,{useEffect,useId,useRef,useState} from 'react';
import {Check,ChevronDown,MapPin} from 'lucide-react';

export default function DestinationPicker({value,onChange,destinations}){
  const id=useId();
  const list=useRef(null);
  const [open,setOpen]=useState(false),[searching,setSearching]=useState(false),[active,setActive]=useState(-1);
  const names=[...new Set(destinations.map(d=>d.Name).filter(Boolean))];
  const options=names.filter(name=>!searching||name.toLowerCase().includes(value.trim().toLowerCase()));
  useEffect(()=>{if(open&&active>=0)list.current?.children[active]?.scrollIntoView({block:'nearest'});},[open,active]);
  const choose=name=>{onChange(name);setOpen(false);setSearching(false);setActive(-1);};
  return <div className="trip-destination" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)){setOpen(false);setActive(-1);}}}>
    <label htmlFor={id}>Destination</label>
    <div className="trip-destination-control">
      <MapPin size={18} aria-hidden="true"/>
      <input id={id} role="combobox" aria-expanded={open} aria-controls={`${id}-options`} aria-autocomplete="list" aria-activedescendant={open&&active>=0?`${id}-option-${active}`:undefined} autoComplete="off" value={value} required maxLength={100} placeholder="Search or enter a place" onFocus={()=>{setSearching(false);setOpen(true);}} onChange={e=>{onChange(e.target.value);setSearching(true);setOpen(true);setActive(-1);}} onKeyDown={e=>{
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>options.length?(e.key==='ArrowDown'?Math.min(i+1,options.length-1):Math.max(i-1,0)):-1);}
        if(e.key==='Enter'&&open&&active>=0){e.preventDefault();choose(options[active]);}
        if(e.key==='Escape'){e.preventDefault();setOpen(false);setActive(-1);}
      }}/>
      <button type="button" className="trip-destination-toggle" aria-label={open?'Close destinations':'Show destinations'} onClick={()=>{setOpen(!open);setSearching(false);setActive(-1);}}><ChevronDown size={18} aria-hidden="true"/></button>
    </div>
    {open&&<div className="trip-destination-menu">
      <p className="trip-destination-hint">{searching?'Matching destinations':'Explore destinations'}</p>
      <ul ref={list} id={`${id}-options`} role="listbox" aria-label="Destinations">
        {options.map((name,i)=><li id={`${id}-option-${i}`} key={name} role="option" aria-selected={value===name} className={active===i?'is-active':''} onPointerDown={e=>e.preventDefault()} onClick={()=>choose(name)}><MapPin size={17} aria-hidden="true"/><span>{name}</span>{value===name&&<Check size={18} aria-hidden="true"/>}</li>)}
      </ul>
      {!options.length&&<p className="trip-destination-empty">No matches. Keep “{value}” as your destination.</p>}
      <p className="trip-destination-footer">You can also enter any place you have in mind.</p>
    </div>}
  </div>;
}
