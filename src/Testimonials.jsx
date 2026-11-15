import React, {useState} from 'react';
import {ChevronLeft, ChevronRight, Quote, Star} from 'lucide-react';

const samples = [
  ['Family holiday', 'The itinerary gave us time to explore the tea gardens and still enjoy slow mornings together.', '1500648767791-00dcc994a43e'],
  ['Backwater escape', 'The houseboat stay was the highlight of our trip. We loved watching the villages go by from the deck.', '1531123897727-8f129e1688ce'],
  ['Kerala discovery', 'We had time for Fort Kochi, the hills and the coast. Each stop felt different, and the pace suited us.', '1507003211169-0a1dd7228f2d'],
];

export default function Testimonials() {
  const [first, setFirst] = useState(0);

  function move(direction) {
    setFirst(current => (current + direction + samples.length) % samples.length);
  }

  return (
    <section id="testimonials" className="section bg-white text-brochure-plum" aria-labelledby="testimonials-heading">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5 md:mb-20">
          <div>
            <h2 id="testimonials-heading">What Our Clients Say About Us</h2>
            <p className="mt-3 text-neutral-600">Sample testimonials with stock photos</p>
          </div>
          <div className="flex gap-4">
            <button type="button" aria-label="Previous testimonial" onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-brochure-plum hover:bg-brochure-lavender"><ChevronLeft size={20}/></button>
            <button type="button" aria-label="Next testimonial" onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-brochure-plum hover:bg-brochure-lavender"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {samples.map((_, offset) => {
            const [trip, quote, portrait] = samples[(first + offset) % samples.length];
            const visibility = ['flex', 'hidden md:flex', 'hidden lg:flex'][offset];
            return (
              <article key={trip} className={visibility + ' relative flex-col rounded-xl border border-neutral-200 bg-white px-6 pt-16 pb-7 text-neutral-900'}>
                <img src={import.meta.env.BASE_URL + 'testimonials/' + portrait + '.jpg'} alt="" width="72" height="72" loading="lazy" className="absolute -top-7 left-1/2 size-18 -translate-x-1/2 rounded-full border-4 border-white bg-brochure-lavender object-cover"/>
                <blockquote className="relative flex-1 pt-7 text-center leading-7 text-neutral-700">
                  <Quote aria-hidden="true" className="absolute -top-5 left-0 text-neutral-200" size={32}/>
                  <p>{quote}</p>
                </blockquote>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{trip}</h3>
                  <span role="img" aria-label="Sample rating: 5 out of 5 stars" className="flex gap-1 text-[#b84736]">
                    {[0, 1, 2, 3, 4].map(star => <Star key={star} aria-hidden="true" size={16} fill="currentColor"/>)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
