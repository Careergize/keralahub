import {ArrowRight, MessageCircle, Plane, ShieldCheck, Ship, TrainFront} from 'lucide-react';
import {destinationPhotos} from './destinationPhotos';
import {openWhatsAppEnquiry} from './whatsapp';

const unsplash = (id, source, author) => ({
  src: 'https://images.unsplash.com/' + id + '?auto=format&fit=max&w=1920&q=85',
  source: 'https://unsplash.com/photos/' + source,
  author,
});

export const additionalServices = [
  {
    path: '/flight-assistance/',
    title: 'Flight Assistance',
    icon: Plane,
    photo: unsplash('photo-1780485345605-ae0a884c1940', '9AoMSlYFPPE', 'Nicolas Nezzo'),
    description: 'Share your route and travel dates to enquire about domestic and international flights.',
    fields: ['Departure city', 'Arrival city', 'Departure date', 'Travellers'],
    topics: [
      ['Domestic flights', 'Tell us your preferred airport and departure window so we can discuss routes that fit your itinerary.'],
      ['International trips', 'Include your return date and any flexibility around connecting airports or layovers.'],
      ['Baggage and fare rules', 'Ask about checked baggage, change fees and cancellation terms before choosing a fare. Allowances can vary by route and fare.'],
    ],
    resources: [['Air India baggage guide', 'https://www.airindia.com/in/en/travel-information/baggage-guidelines/checked-baggage-allowance.html']],
  },
  {
    path: '/houseboat-cruising/',
    title: 'Houseboat Cruising',
    icon: Ship,
    photo: destinationPhotos.Alappuzha,
    description: 'Explore the Alappuzha backwaters from a traditional Kerala houseboat.',
    fields: ['Boarding location', 'Cruise type', 'Cruise date', 'Guests'],
    topics: [
      ['Day cruises', 'Spend part of the day exploring the backwaters. Ask about the boarding point, cruise duration and lunch arrangements.'],
      ['Overnight stays', 'Ask how many cabins are available and confirm the check-in time, meal plan and air-conditioning hours.'],
      ['Group trips', 'Share the number of adults and children and any dietary or accessibility needs so you can check which boat suits your group.'],
    ],
    resources: [['Kerala Tourism houseboat guide', 'https://www.keralatourism.org/houseboat/'], ['Alappuzha district cruise options', 'https://alappuzha.nic.in/en/tourist-packages/']],
  },
  {
    path: '/train-bus-tickets/',
    title: 'Train & Bus Tickets',
    icon: TrainFront,
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/A_typical_Indian_passenger_train.jpg/1280px-A_typical_Indian_passenger_train.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:A_typical_Indian_passenger_train.jpg',
      author: 'HridoyKundu',
      license: 'by-sa/4.0',
    },
    description: 'Enquire about rail and bus connections for your next journey.',
    fields: ['Departure city', 'Destination city', 'Travel date', 'Passengers'],
    topics: [
      ['Train journeys', 'Share your preferred stations and class, such as sleeper or an AC coach, along with your travel date.'],
      ['Bus journeys', 'Ask about boarding and drop-off points, departure times and the type of coach available for your route.'],
      ['Changes and cancellations', 'Check the operator’s cancellation rules and confirm your ticket status before travelling.'],
    ],
    resources: [['IRCTC train reservations', 'https://www.irctc.co.in/'], ['Kerala KSRTC reservation help', 'https://keralartc.com/general-info/online-reservation-help']],
  },
  {
    path: '/travel-insurance/',
    title: 'Travel Insurance',
    icon: ShieldCheck,
    photo: unsplash('photo-1741795854922-87217b375e79', 'C082gaOEDyM', 'My Spain Visa'),
    description: 'Ask about travel insurance options for your destination, trip length and group.',
    fields: ['Destination', 'Trip duration', 'Departure date', 'Travellers'],
    topics: [
      ['Emergency medical cover', 'Check the policy’s limits for eligible emergency treatment and ask how it handles pre-existing conditions.'],
      ['Delays and baggage', 'Look for the events the policy covers, any waiting periods, payout limits and documents required for a claim.'],
      ['Policy terms', 'Read the insurer’s wording for exclusions, deductibles and emergency assistance contacts before choosing a policy.'],
    ],
    resources: [['Example policy wording from ICICI Lombard', 'https://www.icicilombard.com/docs/default-source/apps/website-travel-client-app/assets/pdf/international-travel-insurance-policy-wording.pdf']],
  },
];

const fieldType = ['text', 'text', 'date', 'number'];

export default function ServicePage({service}){
  const Icon = service.icon;
  const {photo} = service;
  const licenceUrl = photo.license ? 'https://creativecommons.org/licenses/' + photo.license + '/' : 'https://unsplash.com/license';

  function submit(event){
    event.preventDefault();
    openWhatsAppEnquiry('Kerala Hub Holidays — ' + service.title, new FormData(event.currentTarget));
  }

  return <main>
    <section className="relative isolate grid min-h-[500px] content-center gap-5 overflow-hidden bg-brand-dark px-4 py-14 text-center text-white">
      <img src={photo.src} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover"/>
      <div className="absolute inset-0 -z-10 bg-black/60"/>
      <h1 className="text-4xl font-semibold md:text-[60px]">{service.title}</h1>
      <p className="mx-auto max-w-xl font-medium">{service.description}</p>
      <form onSubmit={submit} className="mx-auto grid w-full max-w-[1320px] items-end gap-3 rounded-2xl bg-white p-4 text-left text-neutral-900 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        {service.fields.map((label, index) => <label key={label} className="grid min-w-0 gap-1 text-sm font-medium">
          {label}
          <input name={label} type={fieldType[index]} min={fieldType[index] === 'number' ? 1 : undefined} required className="w-full min-w-0 rounded-full border border-neutral-200 px-3 py-2.5 text-base"/>
        </label>)}
        <button className="pill min-h-12 sm:col-span-2 lg:col-span-1"><MessageCircle size={17} aria-hidden="true"/> Enquire on WhatsApp</button>
      </form>
    </section>

    <div className="wrap pt-3 text-right text-xs text-neutral-600">
      Photo by <a className="underline" href={photo.source}>{photo.author}</a>
      {' · '}<a className="underline" href={licenceUrl}>{photo.license ? 'CC BY-SA 4.0' : 'Unsplash License'}</a>
    </div>
    <section className="section wrap" aria-labelledby="service-guide">
      <h2 id="service-guide" className="text-3xl font-semibold text-brand-dark">Plan your {service.title.toLowerCase().includes('insurance') ? 'coverage' : 'trip'}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {service.topics.map(([title, description]) => <article key={title} className="rounded-2xl border border-neutral-200 bg-white p-6">
          <Icon className="mb-4 text-brand" size={24} aria-hidden="true"/>
          <h3 className="text-xl font-semibold text-brand-dark">{title}</h3>
          <p className="mt-2 text-neutral-700">{description}</p>
        </article>)}
      </div>
      <ul className="mt-6 flex flex-wrap gap-3">
        {service.resources.map(([label, url]) => <li key={url}><a className="outline" href={url}>{label}<ArrowRight size={16} aria-hidden="true"/></a></li>)}
      </ul>
    </section>
  </main>;
}
