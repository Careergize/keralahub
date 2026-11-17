import {ArrowLeft, LogIn} from 'lucide-react';
import {destinationPhotos} from './destinationPhotos';
import './login.css';

const photo = destinationPhotos.Alappuzha;

export default function Login(){
  return <main className="section wrap">
    <div className="login-card">
      <figure className="login-photo">
        <img src={photo.src} alt={photo.alt}/>
        <figcaption>
          <a href={photo.source}>{photo.alt} · {photo.author}</a>
          {' · '}<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
        </figcaption>
      </figure>
      <section className="login-content" aria-labelledby="login-title">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16}/> Back to home</a>
        <h1 id="login-title" className="mt-5 text-3xl font-semibold tracking-tight text-brand-dark">Sign in to Kerala Hub</h1>
        <p className="mt-3 text-sm text-neutral-700">Online sign-in is currently unavailable.</p>
        <fieldset className="login-fields" disabled>
          <label>Email address<input type="email" name="email" autoComplete="email"/></label>
          <label>Password<input type="password" name="password" autoComplete="current-password"/></label>
          <button type="button" className="pill"><LogIn size={17}/> Sign in</button>
        </fieldset>
        <a href="/contact/" className="inline-block text-sm font-semibold text-brand underline">Contact us for help</a>
      </section>
    </div>
  </main>;
}
