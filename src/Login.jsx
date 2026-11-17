import {useState} from 'react';
import {ArrowLeft, CalendarDays, LayoutDashboard, LogIn, Users} from 'lucide-react';
import {destinationPhotos} from './destinationPhotos';
import './login.css';

const photo = destinationPhotos.Alappuzha;

const demoSessionKey = 'kerala-hub-demo-admin';

export default function Login({showDashboard = false, adminView = 'Dashboard'}){
  const [error, setError] = useState('');

  function signIn(event){
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (fields.get('username').trim() !== 'admin' || fields.get('password') !== 'test@123'){
      setError('Incorrect username or password.');
      return;
    }
    sessionStorage.setItem(demoSessionKey, 'admin');
    window.location.assign('/dashboard/');
  }

  function signOut(){
    sessionStorage.removeItem(demoSessionKey);
    window.location.replace('/login/');
  }

  if (showDashboard && sessionStorage.getItem(demoSessionKey) === 'admin'){
    return <main className="section wrap grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="rounded-2xl bg-brand-dark p-4 text-white md:min-h-80">
        <p className="mb-4 px-3 font-semibold">Admin menu</p>
        <nav aria-label="Admin navigation">
          {[
            {label: 'Dashboard', href: '/dashboard/', icon: LayoutDashboard, active: adminView === 'Dashboard'},
            {label: 'Customers', href: '/dashboard/customers/', icon: Users, active: adminView === 'Customers'},
            {label: 'Bookings', href: '/dashboard/bookings/', icon: CalendarDays, active: adminView === 'Bookings'},
          ].map(({label, href, icon: Icon, active}) => <a key={href} href={href} aria-current={active ? 'page' : undefined} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10 aria-[current=page]:bg-white/15">
            <Icon size={18} aria-hidden="true"/> {label}
          </a>)}
        </nav>
      </aside>
      <section aria-labelledby="dashboard-title" className="min-w-0 rounded-2xl bg-brand-tint p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="dashboard-title" className="text-3xl font-semibold text-brand-dark">{adminView === 'Dashboard' ? 'Admin Dashboard' : adminView}</h1>
        <button type="button" className="outline" onClick={signOut}>Sign out</button>
      </div>
      {adminView !== 'Dashboard' ? <p className="mt-3 text-neutral-700">No {adminView.toLowerCase()} to display.</p> : <>
      <p className="mt-3 text-neutral-700">Welcome, admin. This dashboard displays sample data.</p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {[['Bookings', '12'], ['Open enquiries', '5'], ['Active packages', '8']].map(([label, value]) =>
          <div key={label} className="rounded-xl border border-neutral-200 bg-white p-5">
            <dt className="text-sm text-neutral-700">{label}</dt>
            <dd className="mt-2 text-3xl font-semibold text-brand-dark">{value}</dd>
          </div>
        )}
      </dl></>}
      </section>
    </main>;
  }
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
        <p className="mt-3 text-sm text-neutral-700">Sign in with your demo admin credentials.</p>
        <form className="login-fields" onSubmit={signIn}>
          <label>Username<input name="username" autoComplete="username" required/></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required/></label>
          <button type="submit" className="pill"><LogIn size={17}/> Sign in</button>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </form>
        <a href="/contact/" className="inline-block text-sm font-semibold text-brand underline">Contact us for help</a>
      </section>
    </div>
  </main>;
}
