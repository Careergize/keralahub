import React, {useState} from 'react';
import {ArrowRight, ChevronDown, ChevronRight, Compass, MapPin, MessageCircle} from 'lucide-react';
import {regions} from './data';
import './contact.css';

const internationalDestinations = ['Morocco','Jordan','Vietnam','Saudi Arabia'];

const questions = [
  ['What services does Kerala Hub Holidays provide?', 'Explore Kerala tour packages, local experiences and custom itineraries for backwater cruises, hill stations, heritage walks and more.'],
  ['How do I book a tour package?', 'Browse the holiday packages and include the tour name, your preferred dates and the number of travelers in your enquiry.'],
  ['Can I customize my travel package?', 'Yes. Share your preferred destinations, travel dates, budget and interests so your itinerary can be tailored to your trip.'],
  ['What should I include in my enquiry?', 'Include your dates, group size, preferred accommodation and any special requirements.'],
  ['How can I check the cancellation terms?', 'Ask for the terms that apply to your itinerary before confirming a booking.'],
];

export default function Contact(){
  const [status,setStatus]=useState('');
  const requestedDestination = new URLSearchParams(window.location.search).get('destination');
  const initialDestination = internationalDestinations.includes(requestedDestination) ? requestedDestination : '';

  function downloadEnquiry(event){
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const lines = ['Kerala Hub Holidays — Travel Enquiry', '', ...Array.from(fields, ([name,value]) => name + ': ' + value)];
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kerala-hub-enquiry.txt';
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    setStatus('Your enquiry draft was downloaded. Online submission is currently unavailable.');
  }

  return <main>
    <section className="contact-hero">
      <h1>Contact Us</h1>
      <nav aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={18}/><span aria-current="page">Contact</span></nav>
    </section>

    <section className="contact-intro">
      <h2>Have questions about your Kerala holiday? We’ll help you find the right itinerary for your next journey.</h2>
      <div className="contact-cards">
        <article><MapPin/><h3>Kerala, India</h3><p>Explore destinations across God’s Own Country.</p><a href="#location">View region <ArrowRight size={15}/></a></article>
        <article><Compass/><h3>Holiday Packages</h3><p>Find a trip that suits your dates and interests.</p><a href="/#packages">Browse packages <ArrowRight size={15}/></a></article>
        <article><MessageCircle/><h3>Travel Enquiries</h3><p>Share your plans for a tailor-made Kerala holiday.</p><a href="#enquiry">Prepare an enquiry <ArrowRight size={15}/></a></article>
      </div>
    </section>

    <section className="enquiry" id="enquiry">
      <h2>Let's Plan Your Next Journey</h2>
      <form onSubmit={downloadEnquiry}>
        <label>Full Name<input name="Full Name" autoComplete="name" required/></label>
        <label>Email Address<input name="Email Address" type="email" autoComplete="email" required/></label>
        <label>Phone Number<input name="Phone Number" type="tel" autoComplete="tel"/></label>
        <label>Where are you going?<select name="Destination" defaultValue={initialDestination} required><option value="" disabled>Select Destination</option>{Object.values(regions).flat().map(place=><option key={place}>{place}</option>)}<optgroup label="International">{internationalDestinations.map(place=><option key={place}>{place}</option>)}</optgroup><option>Multiple destinations</option><option>Still deciding</option></select></label>
        <label className="enquiry-wide">Message<textarea name="Message" rows="5" defaultValue={new URLSearchParams(window.location.search).get("message") || ""} required/></label>
        <p className="enquiry-wide text-sm text-neutral-600">Online submission is currently unavailable. Download a copy of your enquiry for your records.</p>
        <div className="enquiry-wide"><button className="pill">Download enquiry <ArrowRight size={17}/></button><p className="mt-3 text-sm" role="status">{status}</p></div>
      </form>
    </section>

    <section id="location" className="contact-map" aria-label="Kerala travel region">
      <iframe title="Map of Kerala, India" loading="lazy" src="https://maps.google.com/maps?q=Kerala%2C%20India&z=7&output=embed" referrerPolicy="no-referrer"/>
    </section>

    <section className="contact-faq" id="faq">
      <h2>General Questions</h2>
      {questions.map(([question,answer],i)=><details key={question} name="contact-faq" open={i===0}><summary>{question}<ChevronDown size={19}/></summary><p>{answer}</p></details>)}
    </section>
  </main>;
}


