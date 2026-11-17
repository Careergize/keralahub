import React from 'react';
import {BadgeDollarSign, Headset, Map, ShieldCheck} from 'lucide-react';

const benefits = [
  {icon:BadgeDollarSign, color:'bg-brand-gold-soft', title:'Best Price Guarantee Ever.', description:<>Travel confidently knowing you are getting the best value. We guarantee competitive prices with <strong>no hidden costs.</strong></>},
  {icon:ShieldCheck, color:'bg-[#f0f0f0]', title:'Safe, Secure & Hassle-Free Booking.', description:<>Plan and confirm your trip quickly with our safe, simple, and fully <strong>secure booking system.</strong></>},
  {icon:Map, color:'bg-brand-mist', title:'Flexible & Custom Travel Packages.', description:<>Plan your trip your way with a <strong>custom package</strong> tailored to your interests.</>},
  {icon:Headset, color:'bg-brand-tint', title:'Our Support Is Always With You 24/7.', description:<>Travel with peace of mind knowing our expert team is always ready to <strong>support you anytime, anywhere.</strong></>},
];

export default function TravelBenefits(){
  return <section className="wrap pb-8 md:pb-12" aria-label="Why travel with Kerala Hub Holidays">
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map(({icon:Icon,color,title,description})=>(
        <li key={title} className={color+' rounded-[15px] px-5 pt-[35px] pb-[30px]'}>
          <Icon size={40} strokeWidth={1.5} aria-hidden="true"/>
          <h3 className="mt-6 text-xl leading-7">{title}</h3>
          <p className="mt-4 text-[15px] leading-6 text-neutral-800">{description}</p>
        </li>
      ))}
    </ul>
  </section>;
}
