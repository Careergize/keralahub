import {useRef, useState} from 'react';
import {ArrowLeft, CalendarDays, LayoutDashboard, LogIn, LogOut, Menu, ShieldCheck, Users, X} from 'lucide-react';
import {destinationPhotos} from './destinationPhotos';
import './login.css';

const photo = destinationPhotos.Alappuzha;

const demoSessionKey = 'kerala-hub-demo-admin';

export default function Login({showDashboard = false, adminView = 'Dashboard'}){
  const [error, setError] = useState('');
  const mobileMenu = useRef(null);

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
    const adminMenu = <>
        <nav aria-label="Admin navigation" className="flex flex-col gap-1">
          {[
            {label: 'Dashboard', href: '/dashboard/', icon: LayoutDashboard, active: adminView === 'Dashboard'},
            {label: 'Customers', href: '/dashboard/customers/', icon: Users, active: adminView === 'Customers'},
            {label: 'Bookings', href: '/dashboard/bookings/', icon: CalendarDays, active: adminView === 'Bookings'},
          ].map(({label, href, icon: Icon, active}) => <a key={href} href={href} aria-current={active ? 'page' : undefined} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-tint aria-[current=page]:font-semibold aria-[current=page]:text-brand-dark aria-[current=page]:ring-1 aria-[current=page]:ring-brand/25">
            <Icon size={18} aria-hidden="true"/> {label}
          </a>)}
        </nav>
        <div className="border-t border-neutral-200 pt-3 mt-auto">
          <button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-brand" onClick={signOut}>
            <LogOut size={18} aria-hidden="true"/> Sign out
          </button>
        </div>
    </>;
    return <main className="section grid w-full gap-5 px-4 sm:px-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
      <button type="button" className="outline md:hidden" aria-haspopup="dialog" onClick={()=>mobileMenu.current.showModal()}>
        <Menu size={18} aria-hidden="true"/> Admin menu
      </button>
      <dialog ref={mobileMenu} aria-labelledby="mobile-admin-title" className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] border-0 bg-white p-0 text-brand-dark backdrop:bg-black/50 md:hidden">
        <div className="flex min-h-full flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-3">
            <h2 id="mobile-admin-title" className="text-sm font-semibold">Kerala Hub Admin</h2>
            <form method="dialog">
              <button className="rounded-lg p-2 hover:bg-neutral-100" aria-label="Close admin menu"><X size={20} aria-hidden="true"/></button>
            </form>
          </div>
          {adminMenu}
        </div>
      </dialog>
      <aside className="hidden md:flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-3 text-brand-dark shadow-sm md:min-h-96 md:p-4">
        <div className="flex items-center gap-3 border-b border-neutral-200 px-2 pb-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-white"><ShieldCheck size={19} aria-hidden="true"/></span>
          <p className="text-sm font-semibold">Kerala Hub Admin</p>
        </div>
        {adminMenu}
      </aside>
      <section aria-labelledby="dashboard-title" className="min-w-0 rounded-2xl bg-brand-tint p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="dashboard-title" className="text-3xl font-semibold text-brand-dark">{adminView === 'Dashboard' ? 'Admin Dashboard' : adminView}</h1>
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
