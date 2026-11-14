import React from 'react';
import {ArrowRight,MapPin} from 'lucide-react';
const guides = [
  {
    "city": "Dubai",
    "file": "Dubai_from_Burj_Khalifa.jpg",
    "author": "Abubakr87",
    "version": "4.0",
    "title": "Plan a first trip to Dubai",
    "tip": "Pair a morning around Al Fahidi and Dubai Creek with an evening in Downtown Dubai. Group sights by neighbourhood to spend less time in transit."
  },
  {
    "city": "Singapore",
    "file": "1_Singapore_skyline.jpg",
    "author": "Chensiyuan",
    "version": "3.0",
    "title": "Explore Singapore around Marina Bay",
    "tip": "Walk the waterfront from the Merlion to Marina Bay Sands, then visit Gardens by the Bay. Leave time for a meal at a hawker centre."
  },
  {
    "city": "Paris",
    "file": "Tour_Eiffel_Wikimedia_Commons.jpg",
    "author": "Benh LIEU SONG",
    "version": "3.0",
    "title": "See Paris on foot",
    "tip": "Start at Trocadéro for a view of the Eiffel Tower, then follow the Seine toward central Paris. Pick one museum or neighbourhood for the afternoon."
  }
];
export default function InternationalTips({onRead}){
  return guides.map(guide=>{
    const source='https://commons.wikimedia.org/wiki/File:'+guide.file;
    return <article key={guide.city}>
      <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
        <img src={'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+guide.file+'?width=960'} alt={guide.city+' cityscape'} loading="lazy" className="h-[280px] w-full object-cover"/>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium"><MapPin size={15}/> {guide.city}</span>
      </div>
      <h3 className="mt-4 text-xl">{guide.title}</h3>
      <button className="outline mt-4" aria-label={'Read more about '+guide.city} onClick={()=>onRead(guide)}>Read More <ArrowRight size={16}/></button>
      <p className="mt-3 text-xs text-neutral-500">Photo by <a className="underline" href={source}>{guide.author}</a> · <a className="underline" href={'https://creativecommons.org/licenses/by-sa/'+guide.version+'/'}>CC BY-SA {guide.version}</a></p>
    </article>;
  });
}
