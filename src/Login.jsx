import {adminApi, sessionKey} from './adminApi';
import AdminRecords from './AdminRecords';
import cmsSchema from './cmsSchema.json';
import {useState} from 'react';
import {ArrowLeft, CalendarDays, LayoutDashboard, LogIn, LogOut, ShieldCheck, Users, X, Menu, MessageSquare} from 'lucide-react';
import {useSetting,useCollection,mediaUrl,safeUrl} from './siteContent';
import './login.css';




export default function Login({showDashboard = false, adminView = 'Dashboard'}){
  const photoSrc=mediaUrl(useSetting('loginImage'));
  const brandName=useSetting('brandName');
  const photo=useCollection('Media').find(row=>row['Image URL']===photoSrc);
  const [error, setError] = useState('');

  const [busy, setBusy] = useState(false);

  async function signIn(event){
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setError('');
    try {
      const data = await adminApi('signIn', {username: fields.get('username'), password: fields.get('password')});
      if (data.error) throw new Error(data.error);
      if (!data.token) throw new Error('Invalid login response.');
      sessionStorage.setItem(sessionKey, data.token);
      window.location.assign('/dashboard/');
    } catch (error) { setError(error.message); }
    finally { form.elements.password.value = ''; setBusy(false); }
  }

  async function signOut(){
    const token = sessionStorage.getItem(sessionKey);
    setBusy(true);
    try { await adminApi('signOut', {token}); }
    catch (error) { setError(error.message); setBusy(false); return; }
    sessionStorage.removeItem(sessionKey);
    window.location.replace('/login/');
  }

  if (showDashboard && sessionStorage.getItem(sessionKey)){
    const adminMenu = <>
        <nav aria-label="Admin navigation" className="flex flex-col gap-1">
          {[
            {label: 'Dashboard', href: '/dashboard/', icon: LayoutDashboard, active: adminView === 'Dashboard'},
            {label: 'Customers', href: '/dashboard/customers/', icon: Users, active: adminView === 'Customers'},
            {label: 'Bookings', href: '/dashboard/bookings/', icon: CalendarDays, active: adminView === 'Bookings'},
            ...['Enquiries','Invoices','Quotations','Packages','Subscribers'].map(label => ({label, href: '/dashboard/' + label.toLowerCase() + '/', icon: CalendarDays, active: adminView === label})),
            ...Object.keys(cmsSchema).map(label => ({label, href:'/dashboard/'+label.toLowerCase()+'/',icon:LayoutDashboard,active:adminView===label})),
          ].map(({label, href, icon: Icon, active}) => <a key={href} href={href} aria-current={active ? 'page' : undefined} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-brand aria-[current=page]:bg-brand-tint aria-[current=page]:font-semibold aria-[current=page]:text-brand-dark aria-[current=page]:ring-1 aria-[current=page]:ring-brand/25">
            <Icon size={18} aria-hidden="true"/> {label}
          </a>)}
        </nav>
        <div className="border-t border-neutral-200 pt-3 mt-auto">
          <button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-brand" disabled={busy} onClick={signOut}>
            <LogOut size={18} aria-hidden="true"/> Sign out
          </button>
        </div>
    </>;
    return <main className="admin-shell section grid w-full gap-5 px-4 sm:px-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
      <dialog id="mobile-admin-menu" aria-labelledby="mobile-admin-title" className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] border-0 bg-white p-0 text-brand-dark backdrop:bg-black/50 md:hidden">
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
      <section aria-labelledby="dashboard-title" className="admin-workspace min-w-0 rounded-2xl bg-brand-tint p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="dashboard-title" className="text-3xl font-semibold text-brand-dark">{adminView === 'Dashboard' ? 'Admin Dashboard' : adminView}</h1>
      </div>
      {error && <p role="alert">{error}</p>}
      <AdminRecords view={adminView}/>
      </section>
      <nav className="admin-bottom-nav" aria-label="Quick admin navigation">{[{label:'Home',href:'/dashboard/',icon:LayoutDashboard,active:adminView==='Dashboard'},{label:'Enquiries',href:'/dashboard/enquiries/',icon:MessageSquare,active:adminView==='Enquiries'},{label:'Bookings',href:'/dashboard/bookings/',icon:CalendarDays,active:adminView==='Bookings'},{label:'Customers',href:'/dashboard/customers/',icon:Users,active:adminView==='Customers'}].map(({label,href,icon:Icon,active})=><a key={href} href={href} aria-current={active?'page':undefined}><Icon size={21}/><span>{label}</span></a>)}<button type="button" onClick={()=>document.getElementById('mobile-admin-menu')?.showModal()}><Menu size={21}/><span>More</span></button></nav>
    </main>;
  }
  return <main className="section wrap">
    <div className="login-card" style={!photoSrc?{gridTemplateColumns:'1fr'}:undefined}>
      {photoSrc&&<figure className="login-photo">
        <img src={photoSrc} alt={photo?.Alt||''}/>
        {photo?.Credit&&<figcaption>{safeUrl(photo.Source)?<a href={safeUrl(photo.Source)}>{photo.Credit}</a>:photo.Credit}{safeUrl(photo.License)&&<> · <a href={safeUrl(photo.License)}>{photo.License}</a></>}</figcaption>}
      </figure>}
      <section className="login-content" aria-labelledby="login-title">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand"><ArrowLeft size={16}/> Back to home</a>
        <h1 id="login-title" className="mt-5 text-3xl font-semibold tracking-tight text-brand-dark">Sign in{brandName?' to '+brandName:''}</h1>
        <p className="mt-3 text-sm text-neutral-700">Use the username and password from your Users sheet.</p>
        <form className="login-fields" onSubmit={signIn}>
          <label>Username<input name="username" autoComplete="username" required/></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required/></label>
          <button type="submit" disabled={busy} className="pill"><LogIn size={17}/> {busy ? 'Signing in…' : 'Sign in'}</button>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </form>
        <a href="/contact/" className="inline-block text-sm font-semibold text-brand underline">Contact us for help</a>
      </section>
    </div>
  </main>;
}
