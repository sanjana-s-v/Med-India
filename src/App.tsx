import { createContext, useContext, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, Check, ChevronDown, CircleHelp,
  Clock3, Globe2, HeartPulse, Hospital, Languages, MapPin, Menu, Search, ShieldCheck, Sparkles,
  Stethoscope, TrainFront, X,
} from 'lucide-react'
import { doctors, facilities, travelServices, treatments, type Provider } from './data'
import './App.css'

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP'
type Language = 'en' | 'hi'
const AppContext = createContext<{ currency: Currency; language: Language; setCurrency: (value: Currency) => void; setLanguage: (value: Language) => void }>({
  currency: 'INR', language: 'en', setCurrency: () => {}, setLanguage: () => {},
})
const useApp = () => useContext(AppContext)
const rates: Record<Currency, number> = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 }
const currencyLocale: Record<Currency, string> = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB' }
const earliestDate = new Date().toISOString().slice(0, 10)
function price(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currencyLocale[currency], { style: 'currency', currency, maximumFractionDigits: currency === 'INR' ? 0 : 2 }).format(amount * rates[currency])
}

function App() {
  const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem('med-currency') as Currency) || 'INR')
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('med-language') as Language) || 'en')
  const changeCurrency = (value: Currency) => { localStorage.setItem('med-currency', value); setCurrency(value) }
  const changeLanguage = (value: Language) => { localStorage.setItem('med-language', value); setLanguage(value) }
  return <AppContext.Provider value={{ currency, language, setCurrency: changeCurrency, setLanguage: changeLanguage }}>
    <BrowserRouter><Site /></BrowserRouter>
  </AppContext.Provider>
}

function Site() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  return <div className="app-shell min-h-screen flex flex-col">
    <EmergencyNotice />
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modern-medicine" element={<Directory title="Modern medicine" eyebrow="Care, made easier" description="Explore doctors, specialties, and healthcare services across India." filter="Modern medicine" />} />
        <Route path="/traditional-medicine" element={<Directory title="Ayurveda & AYUSH" eyebrow="Traditional wellness" description="Discover traditional healthcare and wellness programmes, with provider assessment before care." filter="Ayurveda & AYUSH" />} />
        <Route path="/doctors" element={<Directory title="Find a doctor" eyebrow="Provider directory" description="Browse fictional provider profiles and illustrative appointment availability." />} />
        <Route path="/hospitals" element={<Facilities />} />
        <Route path="/hospitals/:id" element={<FacilityProfile />} />
        <Route path="/treatments" element={<Treatments />} />
        <Route path="/medical-tourism" element={<Tourism />} />
        <Route path="/travel-services" element={<Travel />} />
        <Route path="/information" element={<Information />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    {!isDashboard && <Footer />}
    <div className="demo-strip text-center">Demo experience · Fictional listings · Prices and availability are illustrative, not live</div>
  </div>
}

function Information() {
  const [submitted, setSubmitted] = useState(false)
  function submit(e: FormEvent) { e.preventDefault(); setSubmitted(true) }
  return <div className="page-wrap information-page">
    <PageIntro eyebrow="INFORMATION & SUPPORT" title="Clear information for this demo." description="Med.India is a frontend concept. These notes explain the current demonstration boundaries and do not replace formal legal or privacy terms." />
    <div className="information-grid">
      <section className="white-card" id="about"><span className="eyebrow">ABOUT</span><h2>About Med.India</h2><p>Med.India demonstrates how patients may discover modern healthcare, traditional wellness, treatment enquiries, and optional travel planning in one interface.</p></section>
      <section className="white-card" id="privacy"><span className="eyebrow">PRIVACY</span><h2>Privacy in this demo</h2><p>Display preferences and demo booking summaries are stored in this browser only. Do not enter real passwords, medical information, or sensitive personal details. No backend or secure account service is connected.</p></section>
      <section className="white-card" id="terms"><span className="eyebrow">TERMS</span><h2>Demo terms</h2><p>All provider, facility, availability, and price information is fictional and illustrative. This service does not provide medical advice, confirm appointments, or make travel reservations.</p></section>
      <section className="white-card" id="cancellation"><span className="eyebrow">CANCELLATION</span><h2>Cancellation requests</h2><p>There are no confirmed bookings to cancel in this frontend demonstration. A future live service would need to display the provider's applicable cancellation terms.</p></section>
      <section className="white-card" id="accessibility"><span className="eyebrow">ACCESSIBILITY</span><h2>Accessibility</h2><p>The demo uses semantic controls, keyboard focus indicators, responsive layouts, and reduced-motion support. Accessibility feedback can be sent using the demo form below.</p></section>
      <section className="white-card" id="support"><span className="eyebrow">CONTACT & SUPPORT</span><h2>Send demo feedback</h2>{submitted ? <p className="notice-inline"><Check size={15} /> Feedback form completed. No information has been sent.</p> : <form onSubmit={submit}><label className="form-label">Your email (optional)<input type="email" placeholder="you@example.com" /></label><label className="form-label">Message<textarea required rows={3} placeholder="Share feedback about this frontend demo" /></label><button className="button button-primary">Prepare feedback <ArrowRight size={15} /></button><p className="small-muted">This form does not send or save your message.</p></form>}</section>
    </div>
  </div>
}

function EmergencyNotice() {
  return <div className="emergency"><HeartPulse size={15} /> For urgent medical help, contact local emergency services. This website is not an emergency service.</div>
}

function Header() {
  const { language, setLanguage, currency, setCurrency } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const hi = language === 'hi'
  return <header className="site-header">
    <div className="header-inner">
      <Link to="/" className="brand" aria-label="Med.India home" onClick={() => setMenuOpen(false)}><span className="brand-mark"><HeartPulse size={23} /></span><span>Med<span className="brand-dot">.</span>India<small>CARE, CONNECTED</small></span></Link>
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>{hi ? 'होम' : 'Home'}</NavLink>
        <NavLink to="/modern-medicine" onClick={() => setMenuOpen(false)}>{hi ? 'आधुनिक चिकित्सा' : 'Modern care'}</NavLink>
        <NavLink to="/traditional-medicine" onClick={() => setMenuOpen(false)}>{hi ? 'आयुष' : 'Ayurveda & AYUSH'}</NavLink>
        <NavLink to="/hospitals" onClick={() => setMenuOpen(false)}>{hi ? 'अस्पताल' : 'Hospitals'}</NavLink>
        <NavLink to="/treatments" onClick={() => setMenuOpen(false)}>{hi ? 'उपचार' : 'Treatments'}</NavLink>
        <NavLink to="/medical-tourism" onClick={() => setMenuOpen(false)}>{hi ? 'मेडिकल टूरिज़्म' : 'Medical tourism'}</NavLink>
        <div className="mobile-links"><Link to="/doctors" onClick={() => setMenuOpen(false)}>Find a doctor</Link><Link to="/travel-services" onClick={() => setMenuOpen(false)}>Travel services</Link><Link to="/dashboard" onClick={() => setMenuOpen(false)}>My dashboard</Link></div>
      </nav>
      <div className="header-actions">
        <Link to="/search" className="icon-button search-shortcut" aria-label="Search"><Search size={19} /></Link>
        <label className="select-wrap" aria-label="Language"><Languages size={15} /><select value={language} onChange={(e) => setLanguage(e.target.value as Language)}><option value="en">EN</option><option value="hi">हिंदी</option></select></label>
        <label className="select-wrap currency-select" aria-label="Currency"><select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}><option>INR</option><option>USD</option><option>EUR</option><option>GBP</option></select><ChevronDown size={13} /></label>
        <Link to="/login" className="signin-link">Sign in</Link>
        <Link to="/doctors" className="button button-primary header-cta">{hi ? 'परामर्श बुक करें' : 'Book consultation'} <ArrowRight size={15} /></Link>
      </div>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer">
    <div className="footer-top">
      <div className="footer-brand"><Link to="/" className="brand"><span className="brand-mark"><HeartPulse size={22} /></span><span>Med<span className="brand-dot">.</span>India<small>CARE, CONNECTED</small></span></Link><p>Modern healthcare and traditional wellness discovery, with optional travel support.</p></div>
      <div><h4>Explore</h4><Link to="/modern-medicine">Modern medicine</Link><Link to="/traditional-medicine">Ayurveda & AYUSH</Link><Link to="/hospitals">Hospitals & clinics</Link><Link to="/treatments">Treatments</Link></div>
      <div><h4>Plan a visit</h4><Link to="/medical-tourism">Medical tourism</Link><Link to="/travel-services">Travel services</Link><Link to="/doctors">Find a doctor</Link><Link to="/dashboard">Patient dashboard</Link></div>
      <div><h4>Information</h4><Link to="/information#about">About Med.India</Link><Link to="/information#privacy">Privacy (demo)</Link><Link to="/information#terms">Terms (demo)</Link><Link to="/information#accessibility">Accessibility</Link><Link to="/information#support">Contact & support</Link></div>
    </div>
    <div className="footer-bottom"><span>© 2026 Med.India · Frontend demonstration</span><span>Fictional provider data. No bookings or travel reservations are confirmed.</span></div>
  </footer>
}

function ButtonLink({ to, children, secondary = false, className = '' }: { to: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <Link className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} to={to}>{children}</Link>
}

function SectionHeading({ eyebrow, title, description, link }: { eyebrow?: string; title: string; description?: string; link?: { to: string; label: string } }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{link && <Link to={link.to} className="text-link">{link.label} <ArrowRight size={16} /></Link>}</div>
}

function SearchPanel() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  function submit(e: FormEvent) { e.preventDefault(); const params = new URLSearchParams(); if (query) params.set('q', query); if (category) params.set('category', category); if (city) params.set('city', city); navigate(`/search?${params}`) }
  return <form className="search-panel" onSubmit={submit}>
    <label className="search-field"><span>What are you looking for?</span><div><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Doctor, specialty, treatment" /></div></label>
    <label className="search-field"><span>Care category</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">All care</option><option>Modern medicine</option><option>Ayurveda & AYUSH</option><option>Hospitals & Clinics</option><option>Wellness Treatments</option></select></label>
    <label className="search-field"><span>City or destination</span><div><MapPin size={16} /><input value={city} onChange={e => setCity(e.target.value)} placeholder="Any city" /></div></label>
    <button className="button button-primary search-submit" type="submit"><Search size={17} /> Search</button>
  </form>
}

function Home() {
  const { language } = useApp()
  const hi = language === 'hi'
  return <>
    <section className="hero-section">
      <div className="hero-content">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CARE JOURNEY, THOUGHTFULLY CONNECTED</div>
        <h1>{hi ? 'आपकी स्वास्थ्य यात्रा, एक ही जगह।' : <>Your healthcare journey,<br /><em>all in one place.</em></>}</h1>
        <p>{hi ? 'भारत में आधुनिक चिकित्सा और पारंपरिक स्वास्थ्य सेवाओं को खोजें—और अपनी यात्रा की योजना बनाएँ।' : 'Discover trusted healthcare options, explore traditional Indian wellness, and organise the details around your visit.'}</p>
        <div className="hero-buttons"><ButtonLink to="/doctors">Find a doctor <ArrowRight size={17} /></ButtonLink><ButtonLink to="/traditional-medicine" secondary>Explore Ayurveda</ButtonLink></div>
        <Link to="/medical-tourism" className="hero-caption">Planning treatment in India? <ArrowUpRight size={15} /></Link>
        <div className="hero-trust"><div className="avatar-stack"><span>✦</span><span>✿</span><span>＋</span></div><div><strong>One simpler starting point</strong><small>Care discovery · Booking requests · Travel planning</small></div></div>
      </div>
      <div className="hero-visual">
        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=88" alt="Healthcare professional speaking with a patient" />
        <div className="hero-image-shade" />
        <div className="floating-card care-card"><span className="floating-icon"><ShieldCheck size={19} /></span><div><strong>Care, your way</strong><small>Compare options with clarity</small></div></div>
        <div className="floating-card ayur-card"><span className="floating-icon gold"><Sparkles size={18} /></span><div><strong>Modern + traditional</strong><small>Explore India's care landscape</small></div></div>
      </div>
      <div className="hero-orb" />
    </section>
    <div className="search-container"><SearchPanel /></div>
    <section className="section categories-section">
      <SectionHeading eyebrow="EXPLORE CARE" title="Find the right place to begin" description="A thoughtful way to discover care and wellness options across India." />
      <div className="category-grid">
        <CategoryCard to="/modern-medicine" icon={<Stethoscope />} label="Modern medicine" text="Browse doctors, specialties, and consultations." tone="mint" />
        <CategoryCard to="/traditional-medicine" icon={<Sparkles />} label="Ayurveda & AYUSH" text="Explore traditional care and wellness." tone="sand" />
        <CategoryCard to="/hospitals" icon={<Hospital />} label="Hospitals & clinics" text="Compare facilities and services." tone="blue" />
        <CategoryCard to="/treatments" icon={<HeartPulse />} label="Treatments" text="Explore consultations and programmes." tone="rose" />
        <CategoryCard to="/treatments" icon={<Sparkles />} label="Panchakarma & wellness" text="Discover multi-day programme enquiries." tone="gold" />
        <CategoryCard to="/medical-tourism" icon={<Globe2 />} label="Medical tourism" text="Plan a care journey with optional support." tone="lavender" />
      </div>
    </section>
    <section className="section tinted-section">
      <SectionHeading eyebrow="MEET YOUR OPTIONS" title="Featured providers" description="Fictional demo profiles with illustrative availability and fees." link={{ to: '/doctors', label: 'View all providers' }} />
      <div className="provider-grid">{doctors.slice(0, 3).map(person => <ProviderCard key={person.id} person={person} />)}</div>
    </section>
    <section className="section">
      <SectionHeading eyebrow="DISCOVER FACILITIES" title="Care settings for every journey" description="Fictional hospital and wellness centre listings for this demo." link={{ to: '/hospitals', label: 'Explore facilities' }} />
      <div className="facility-grid">{facilities.slice(0, 2).map(item => <FacilityCard key={item.id} facility={item} />)}</div>
    </section>
    <section className="tourism-band">
      <div className="tourism-photo"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85" alt="Serene wellness retreat interior" /></div>
      <div className="tourism-copy"><span className="eyebrow">FOR INTERNATIONAL PATIENTS</span><h2>Discover healthcare<br />in India.</h2><p>Explore providers and programmes, then plan the visit around your care. Travel support is optional and subject to availability.</p><div className="tourism-actions"><ButtonLink to="/hospitals">Find a hospital <ArrowRight size={16} /></ButtonLink><Link className="text-link light-link" to="/medical-tourism">Plan your medical trip <ArrowUpRight size={16} /></Link></div></div>
      <div className="tourism-ornament">✳</div>
    </section>
    <section className="section">
      <SectionHeading eyebrow="SIMPLE BY DESIGN" title="A clearer path from discovery to visit" />
      <div className="steps-grid">{[['01','Discover','Find providers, facilities, and treatments.'],['02','Compare','Review options and indicative prices.'],['03','Request','Send an appointment or programme request.'],['04','Plan','Add optional travel preferences if useful.']].map(([n,title,desc])=><article className="step-card" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
    </section>
    <section className="trust-section"><div><span className="eyebrow">BUILT FOR CLARITY</span><h2>Care discovery with the details in view.</h2><p>Med.India is a frontend demo. Provider profiles, availability, pricing, and travel support shown here are illustrative and are not independently verified or live.</p></div><div className="trust-points"><div><ShieldCheck /><span><b>Clear demo labels</b><small>No claims of live verification</small></span></div><div><Check /><span><b>Transparent estimates</b><small>Healthcare and travel shown separately</small></span></div><div><CircleHelp /><span><b>Provider assessment</b><small>Programmes require provider review</small></span></div></div></section>
  </>
}

function CategoryCard({ to, icon, label, text, tone }: { to: string; icon: ReactNode; label: string; text: string; tone: string }) {
  return <Link to={to} className="category-card"><span className={`category-icon ${tone}`}>{icon}</span><span className="category-title">{label}<ArrowUpRight size={15} /></span><span className="category-description">{text}</span></Link>
}

function ProviderCard({ person }: { person: Provider }) {
  const { currency } = useApp()
  return <article className="provider-card">
    <Link className="provider-image" to={`/providers/${person.id}`}><img src={person.image} alt={`Fictional profile portrait of ${person.name}`} /><span className="demo-tag">DEMO PROFILE</span></Link>
    <div className="provider-info"><div className="provider-name-row"><div><h3>{person.name}</h3><p>{person.specialty}</p></div>{person.verified && <span className="verified"><BadgeCheck size={15} /> Demo checked</span>}</div>
      <p className="provider-qualification">{person.qualification}</p><div className="provider-meta"><span><MapPin size={14} />{person.city}</span><span><Clock3 size={14} />{person.experience} yrs exp.</span></div>
      <div className="provider-card-bottom"><div><small>Consultation from</small><strong>{price(person.fee, currency)}</strong></div><Link className="button button-outline" to={`/providers/${person.id}`}>View profile <ArrowRight size={14} /></Link></div>
    </div>
  </article>
}

function FacilityCard({ facility }: { facility: typeof facilities[number] }) {
  return <article className="facility-card"><Link to={`/hospitals/${facility.id}`} className="facility-image"><img src={facility.image} alt={facility.name} /><span className="facility-tag">DEMO LISTING</span></Link><div className="facility-content"><div className="facility-heading"><div><small>{facility.category}</small><h3>{facility.name}</h3></div><span className="city-pill"><MapPin size={13} />{facility.city}</span></div><p>{facility.description}</p><div className="service-tags">{facility.services.slice(0, 3).map(s => <span key={s}>{s}</span>)}</div><div className="facility-footer"><span>{facility.stay}</span><Link to={`/hospitals/${facility.id}`} className="text-link">View details <ArrowRight size={15} /></Link></div></div></article>
}

function Directory({ title, eyebrow, description, filter }: { title: string; eyebrow: string; description: string; filter?: Provider['category'] }) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('recommended')
  const { currency } = useApp()
  const items = useMemo(() => doctors.filter(d => (!filter || d.category === filter) && (!query || `${d.name} ${d.specialty} ${d.city}`.toLowerCase().includes(query.toLowerCase())) && (!city || d.city.toLowerCase().includes(city.toLowerCase()))).sort((a,b) => sort === 'fee-low' ? a.fee-b.fee : sort === 'experience' ? b.experience-a.experience : 0), [filter, query, city, sort])
  return <div className="page-wrap">
    <PageIntro eyebrow={eyebrow} title={title} description={description} />
    <div className="directory-tools"><label className="input-icon"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name or specialty" aria-label="Search providers" /></label><label className="input-icon"><MapPin size={16} /><input value={city} onChange={e => setCity(e.target.value)} placeholder="City" aria-label="Filter by city" /></label><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort providers"><option value="recommended">Recommended</option><option value="fee-low">Fee: low to high</option><option value="experience">Experience</option></select></div>
    <p className="results-count">{items.length} fictional provider{items.length === 1 ? '' : 's'} · fees shown in {currency}</p>
    {items.length ? <div className="provider-grid">{items.map(person => <ProviderCard key={person.id} person={person} />)}</div> : <EmptyState title="No providers found" text="Try another search or clear the city filter." action={() => { setQuery(''); setCity('') }} />}
    <p className="notice-box"><ShieldCheck size={18} /> Profiles and appointment slots are examples for this frontend. Credentials and availability are not verified.</p>
  </div>
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></section>
}

function Facilities() {
  const [city, setCity] = useState('')
  const list = facilities.filter(f => !city || f.city.toLowerCase().includes(city.toLowerCase()))
  return <div className="page-wrap"><PageIntro eyebrow="HOSPITALS & CLINICS" title="Find a care setting" description="Explore fictional facility profiles, services, and location information." />
    <div className="directory-tools"><label className="input-icon"><MapPin size={16} /><input placeholder="Filter by city" value={city} onChange={e => setCity(e.target.value)} /></label><span className="muted">Outpatient · inpatient · wellness centres</span></div>
    {list.length ? <div className="facility-list">{list.map(f => <FacilityCard key={f.id} facility={f} />)}</div> : <EmptyState title="No facilities in this city" text="Try searching another city." action={() => setCity('')} />}
    <div className="map-placeholder"><MapPin size={23} /><strong>Map preview</strong><span>Map service is not connected in this demo.</span></div>
  </div>
}

function FacilityProfile() {
  const { id = '' } = useParams()
  const facility = facilities.find(item => item.id === id)
  const associatedProviders = doctors.filter(person => person.city === facility?.city)
  const [submitted, setSubmitted] = useState(false)
  if (!facility) return <NotFound />
  function submit(e: FormEvent) { e.preventDefault(); setSubmitted(true) }
  return <div className="page-wrap profile-wrap"><Link to="/hospitals" className="back-link">← Back to facilities</Link>
    <article className="facility-detail"><div className="facility-detail-image"><img src={facility.image} alt={facility.name} /><span className="facility-tag">FICTIONAL DEMO FACILITY</span></div><div className="facility-detail-copy"><span className="eyebrow">{facility.category}</span><h1>{facility.name}</h1><p><MapPin size={15} />{facility.city}, India</p><p>{facility.description}</p><div className="facility-detail-block"><h2>Services and programmes</h2><div className="service-tags">{facility.services.map(service => <span key={service}>{service}</span>)}</div></div><div className="facility-detail-block"><h2>Facility information</h2><p>{facility.stay}. Contact details, current availability, and admissions are not connected in this demo.</p></div><div className="facility-actions"><ButtonLink to="/doctors">Explore providers <ArrowRight size={15} /></ButtonLink><a className="button button-secondary" href="#facility-enquiry">Send an enquiry</a></div></div></article>
    {associatedProviders.length > 0 && <section className="facility-related"><h2>Providers in {facility.city}</h2><div>{associatedProviders.map(person => <Link className="related-provider" to={`/providers/${person.id}`} key={person.id}><span>{person.name}<small>{person.specialty} · fictional profile</small></span><ArrowRight size={16} /></Link>)}</div></section>}
    <section className="white-card facility-enquiry" id="facility-enquiry"><span className="eyebrow">FACILITY ENQUIRY · DEMO</span><h2>Ask about {facility.name}</h2>{submitted ? <p className="notice-inline"><Check size={15} /> Enquiry prepared. No information has been sent to this facility.</p> : <form onSubmit={submit}><label className="form-label">Your question<textarea rows={3} required placeholder="What would you like to know about this demo facility?" /></label><button className="button button-primary">Prepare enquiry <ArrowRight size={15} /></button><p className="small-muted">This demo form does not send or store your message.</p></form>}</section>
  </div>
}

function Treatments() {
  const { currency } = useApp()
  return <div className="page-wrap"><PageIntro eyebrow="TREATMENTS & PROGRAMMES" title="Explore care options" description="Informative examples to help you discover services. A provider can discuss suitability and next steps." />
    <div className="treatment-grid">{treatments.map((t, i) => <article className={`treatment-card treatment-${i % 3}`} key={t.id}><div className="treatment-symbol">{t.icon}</div><span className="eyebrow">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p>    <div className="treatment-meta"><span><Clock3 size={14} />{t.duration}</span><strong>{price(t.fee, currency)}</strong></div><Link to={t.id.includes('consultation') ? '/doctors' : `/booking/${t.id}`} className="text-link">Explore option <ArrowRight size={15} /></Link></article>)}</div>
    <p className="notice-box"><HeartPulse size={18} /> Treatment descriptions are informational and not medical advice. Traditional wellness services are not a substitute for emergency or evidence-based medical care.</p>
  </div>
}

function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const category = params.get('category') || ''
  const city = params.get('city') || ''
  const providerResults = doctors.filter(d => (!query || `${d.name} ${d.specialty} ${d.city} ${d.category}`.toLowerCase().includes(query.toLowerCase())) && (!city || d.city.toLowerCase().includes(city.toLowerCase())) && (!category || (category === 'Wellness Treatments' ? d.category === 'Ayurveda & AYUSH' : category !== 'Hospitals & Clinics' && d.category === category)))
  const treatmentResults = treatments.filter(t => (!query || `${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase())) && (!category || (category === 'Wellness Treatments' ? t.category === 'Ayurveda & AYUSH' : category !== 'Hospitals & Clinics' && t.category === category)))
  const facilityResults = facilities.filter(f => (!query || `${f.name} ${f.city} ${f.category} ${f.services.join(' ')}`.toLowerCase().includes(query.toLowerCase())) && (!city || f.city.toLowerCase().includes(city.toLowerCase())) && (!category || category === 'Hospitals & Clinics' || category === 'Modern medicine' || category === 'Ayurveda & AYUSH'))
  const hasResults = providerResults.length + treatmentResults.length + facilityResults.length > 0
  return <div className="page-wrap"><PageIntro eyebrow="SEARCH & DISCOVERY" title="Search results" description={query || city || category ? `Showing matches${query ? ` for “${query}”` : ''}${city ? ` in ${city}` : ''}${category ? ` · ${category}` : ''}.` : 'Search providers, facilities, specialties, and treatments.'} />
    {!hasResults ? <EmptyState title="No matches yet" text="Try a different search, city, or category." action={() => window.location.assign('/search')} /> : <>
      {providerResults.length > 0 && <><SectionHeading title="Providers" link={{ to: '/doctors', label: 'Browse all' }} /><div className="provider-grid">{providerResults.map(p => <ProviderCard key={p.id} person={p} />)}</div></>}
      {facilityResults.length > 0 && <><SectionHeading title="Facilities" /><div className="facility-list">{facilityResults.map(f => <FacilityCard key={f.id} facility={f} />)}</div></>}
      {treatmentResults.length > 0 && <><SectionHeading title="Treatments" /><div className="treatment-grid compact">{treatmentResults.map(t => <article className="treatment-card" key={t.id}><span className="eyebrow">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p><Link to="/treatments" className="text-link">View details <ArrowRight size={15} /></Link></article>)}</div></>}
    </>}
  </div>
}

function ProviderProfile() {
  const { id = '' } = useParams()
  const person = doctors.find(d => d.id === id)
  const { currency } = useApp()
  if (!person) return <NotFound />
  return <div className="page-wrap profile-wrap"><Link to="/doctors" className="back-link">← Back to providers</Link><div className="profile-card"><div className="profile-photo"><img src={person.image} alt={`Fictional profile portrait of ${person.name}`} /><span className="demo-tag">DEMO PROFILE</span></div><div className="profile-main"><span className="eyebrow">{person.category}</span><h1>{person.name}</h1><h2>{person.specialty}</h2><p>{person.qualification}</p><div className="provider-meta"><span><MapPin size={15} />{person.city}</span><span><Clock3 size={15} />{person.experience} years' experience</span></div><div className="profile-fee"><small>Illustrative consultation fee</small><strong>{price(person.fee, currency)}</strong></div><ButtonLink to={`/booking/${person.id}`}>Request a consultation <ArrowRight size={16} /></ButtonLink></div></div>
    <div className="profile-details"><section className="white-card"><h2>About</h2><p>{person.about}</p><h3>Languages</h3><div className="service-tags">{person.languages.map(x => <span key={x}>{x}</span>)}</div><h3>Registration & verification</h3><p>No registration or verification claim is made for this fictional demo profile.</p></section><section className="white-card"><h2>Availability preview</h2><p className="muted">Illustrative slots · choose a date in the request form.</p><div className="slot-list">{person.slots.map(slot => <span key={slot}><Clock3 size={14} />{slot}</span>)}</div><p className="notice-inline"><CircleHelp size={15} /> Sending a request does not reserve an appointment.</p></section></div>
  </div>
}

function Booking() {
  const { id = '' } = useParams()
  const { currency } = useApp()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [visitType, setVisitType] = useState('In person')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [duration, setDuration] = useState(() => Number(treatments.find(t => t.id === id)?.duration.match(/\d+/)?.[0] ?? 7))
  const [residential, setResidential] = useState(false)
  const [treatmentCenter, setTreatmentCenter] = useState('')
  const [accommodation, setAccommodation] = useState('')
  const [dietary, setDietary] = useState('')
  const [accessibility, setAccessibility] = useState('')
  const [initialConsultation, setInitialConsultation] = useState(true)
  const [travelSelections, setTravelSelections] = useState<string[]>([])
  const person = doctors.find(d => d.id === id)
  const programme = treatments.find(t => t.id === id)
  if (!person && !programme && id !== 'panchakarma') return <NotFound />
  const title = person?.name ?? programme?.name ?? 'Panchakarma programme enquiry'
  const programmeDefaultDays = Number(programme?.duration.match(/\d+/)?.[0] ?? 7)
  const isProgramme = Boolean(programme || id === 'panchakarma')
  const fee = person?.fee ?? Math.round((programme?.fee ?? 28000) * (isProgramme ? duration / programmeDefaultDays : 1))
  const travelTotal = travelServices.filter(item => travelSelections.includes(item.id)).reduce((sum, item) => sum + item.price, 0)
  function next() {
    setError('')
    if (step === 1 && (!date || (!isProgramme && !slot))) { setError(isProgramme ? 'Choose a preferred start date to continue.' : 'Choose a preferred date and time to continue.'); return }
    if (step === 2 && (!name.trim() || !/^\S+@\S+\.\S+$/.test(email))) { setError('Enter your name and a valid email address.'); return }
    if (step < 3) setStep(step + 1)
    else {
      const current = JSON.parse(localStorage.getItem('med-bookings') || '[]') as { title: string; date: string; type: string; status: string }[]
      localStorage.setItem('med-bookings', JSON.stringify([{ title, date, type: visitType, status: 'Request pending' }, ...current].slice(0, 10)))
      setStep(4)
    }
  }
  if (step === 4) return <div className="page-wrap"><div className="confirmation-card"><span className="confirmation-icon"><Check size={30} /></span><span className="eyebrow">REQUEST SUBMITTED · DEMO</span><h1>Your request is ready.</h1><p>This frontend demo has recorded a non-sensitive request summary in this browser. No provider has been contacted and no appointment or treatment has been confirmed.</p><div className="confirmation-summary"><span>{title}</span><strong>{date}{slot ? ` · ${slot}` : ' · Programme enquiry'}</strong></div><ButtonLink to="/dashboard">View dashboard <ArrowRight size={16} /></ButtonLink></div></div>
  return <div className="page-wrap booking-wrap"><PageIntro eyebrow="BOOKING REQUEST · DEMO" title={isProgramme ? 'Enquire about a programme' : 'Request an appointment'} description={isProgramme ? 'Share your preferred programme details. Provider assessment is required before a programme can be confirmed.' : 'Share a preferred time. This demo does not reserve or confirm appointments.'} />
    <div className="booking-layout"><div className="booking-main"><div className="progress-steps">{[isProgramme ? 'Programme details' : 'Choose a time', 'Your details', 'Review'].map((s, i) => <div className={step >= i + 1 ? 'active' : ''} key={s}><span>{step > i + 1 ? <Check size={14} /> : i + 1}</span>{s}</div>)}</div>
      {step === 1 && <section className="white-card form-card"><h2>{person ? `Appointment with ${person.name}` : title}</h2><p className="muted">{isProgramme ? 'Share your programme preferences. A provider must assess suitability before confirmation.' : 'Choose your preferred date and consultation type.'}</p>
        {isProgramme && <><label className="form-label">Programme duration<select value={duration} onChange={e => setDuration(Number(e.target.value))}>{[programmeDefaultDays, 14, 21].filter((days, index, list) => list.indexOf(days) === index).map(days => <option value={days} key={days}>{days} days</option>)}</select></label><label className="form-label">Preferred treatment centre<select value={treatmentCenter} onChange={e => setTreatmentCenter(e.target.value)}><option value="">Choose a demo centre</option>{facilities.filter(f => f.category.includes('wellness')).map(f => <option key={f.id}>{f.name} · {f.city}</option>)}</select></label><label className="form-label">Stay preference<select value={residential ? 'residential' : 'non-residential'} onChange={e => setResidential(e.target.value === 'residential')}><option value="non-residential">Non-residential</option><option value="residential">Residential</option></select></label><label className="form-label">Accommodation preferences (optional)<textarea rows={2} value={accommodation} onChange={e => setAccommodation(e.target.value)} placeholder="Share accommodation needs for provider review" /></label><label className="form-label">Dietary preferences (optional)<input value={dietary} onChange={e => setDietary(e.target.value)} placeholder="Share preferences for provider review" /></label><label className="form-label">Accessibility preferences (optional)<input value={accessibility} onChange={e => setAccessibility(e.target.value)} placeholder="Share any accessibility needs" /></label><label className="checkbox-line"><input type="checkbox" checked={initialConsultation} onChange={e => setInitialConsultation(e.target.checked)} /> Request an initial provider consultation</label><fieldset className="travel-options"><legend>Optional travel enquiries</legend>{travelServices.map(item => <label key={item.id}><input type="checkbox" checked={travelSelections.includes(item.id)} onChange={e => setTravelSelections(selected => e.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id))} /><span>{item.name} <small>{price(item.price, currency)} · illustrative</small></span></label>)}</fieldset></>}
        <label className="form-label">{isProgramme ? 'Preferred programme start date' : 'Preferred date'}<input type="date" min={earliestDate} value={date} onChange={e => setDate(e.target.value)} /></label>
        {!isProgramme && <><label className="form-label">Consultation type<select value={visitType} onChange={e => setVisitType(e.target.value)}><option>In person</option><option>Online (demo option)</option></select></label><div className="form-label">Available times <div className="slot-list selectable">{(person?.slots ?? ['09:30 AM', '11:00 AM', '02:30 PM']).map(x => <button type="button" className={slot === x ? 'selected' : ''} key={x} onClick={() => setSlot(x)}>{x}</button>)}</div></div></>}
      </section>}
      {step === 2 && <section className="white-card form-card"><h2>Contact details</h2><p className="muted">For this demo, these details are used only during this page session and are not saved.</p><label className="form-label">Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label><label className="form-label">Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label></section>}
      {step === 3 && <section className="white-card form-card"><h2>Review your request</h2><p>Please confirm your preferred details before submitting.</p><div className="review-row"><span>Provider or programme</span><strong>{title}</strong></div><div className="review-row"><span>{isProgramme ? 'Preferred start date' : 'Date & time'}</span><strong>{date}{slot ? ` · ${slot}` : ''}</strong></div>{isProgramme && <><div className="review-row"><span>Centre</span><strong>{treatmentCenter || 'Centre preference not selected'}</strong></div><div className="review-row"><span>Duration · stay preference</span><strong>{duration} days · {residential ? 'Residential' : 'Non-residential'}</strong></div><div className="review-row"><span>Initial consultation</span><strong>{initialConsultation ? 'Requested' : 'Not requested'}</strong></div><div className="review-row"><span>Optional travel estimate</span><strong>{price(travelTotal, currency)}</strong></div></>}{!isProgramme && <div className="review-row"><span>Consultation</span><strong>{visitType}</strong></div>}<div className="review-row"><span>Healthcare estimate</span><strong>{price(fee, currency)}</strong></div><p className="notice-inline"><CircleHelp size={15} /> This is a request only; provider review, suitability, final fees, and availability require confirmation.</p></section>}
      {error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 1 && <button className="button button-secondary" onClick={() => { setError(''); setStep(step - 1) }}>Back</button>}<button className="button button-primary" onClick={next}>{step === 3 ? 'Submit demo request' : 'Continue'} <ArrowRight size={16} /></button></div>
    </div><aside className="white-card booking-summary"><span className="eyebrow">REQUEST SUMMARY</span><h3>{title}</h3><div className="review-row"><span>Healthcare estimate</span><strong>{price(fee, currency)}</strong></div>{isProgramme && <div className="review-row"><span>Optional travel estimate</span><strong>{price(travelTotal, currency)}</strong></div>}<div className="review-row total-row"><span>Estimated total</span><strong>{price(fee + travelTotal, currency)}</strong></div><p className="small-muted">Illustrative estimate only. Travel is optional. No reservation is made.</p></aside></div>
  </div>
}

function Tourism() {
  return <div className="page-wrap tourism-page"><PageIntro eyebrow="INTERNATIONAL PATIENTS" title="Discover healthcare in India." description="Find providers and care settings, compare options, and organise the details around your visit—with optional travel planning." />
    <div className="tourism-feature"><img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1100&q=85" alt="Fictional wellness retreat setting" /><div><span className="eyebrow">YOUR JOURNEY, YOUR CHOICE</span><h2>Support that fits around your care.</h2><p>Med.India helps international patients explore modern healthcare and traditional wellness. You can enquire about accommodation and local transport separately; all listings and prices here are illustrative.</p><ButtonLink to="/travel-services">Plan your trip <ArrowRight size={16} /></ButtonLink></div></div>
    <div className="steps-grid tourism-steps">{[['01','Explore care','Discover hospitals, doctors, and wellness programmes.'],['02','Send an enquiry','Share your preferences directly in a demo request.'],['03','Plan travel','Explore optional transfers, hotels, and assistance.']].map(s=><article className="step-card" key={s[0]}><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></article>)}</div>
    <div className="international-card"><div><span className="eyebrow">TRIP PLAN ENQUIRY</span><h2>Start with your travel preferences</h2><p>Documentation support is an enquiry service only. We cannot promise visas, admission, or travel approval.</p></div><TripEnquiry /></div>
    <section className="faq"><SectionHeading eyebrow="GOOD TO KNOW" title="Frequently asked questions" />{[['Are listings real?','No. Provider and facility information is fictional and used only to demonstrate this frontend.'],['Can I book travel here?','No real reservations are available. Travel selections are illustrative estimates and enquiries only.'],['Can you arrange a medical visa?','No. The demo cannot provide or promise a visa, admission, or travel approval.']].map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={17} /></summary><p>{a}</p></details>)}</section>
  </div>
}

function TripEnquiry() {
  const [sent, setSent] = useState(false)
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  function submit(e: FormEvent) { e.preventDefault(); setSent(true) }
  if (sent) return <div className="enquiry-success"><Check size={20} /><strong>Enquiry prepared</strong><span>This demo has not sent your details to a travel provider.</span></div>
  return <form className="trip-form" onSubmit={submit}><label>Country of residence<input required value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Singapore" /></label><label>Contact email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Preferred language<select><option>English</option><option>Hindi</option><option>Other</option></select></label><label>Travel dates<input type="text" placeholder="e.g. 10–20 December" /></label><label>Travellers<input type="number" min="1" defaultValue="1" /></label><label>Accommodation needs<select><option>No preference</option><option>Hotel</option><option>Serviced accommodation</option></select></label><label>Airport transfer needs<select><option>No preference</option><option>Pickup</option><option>Drop-off</option><option>Both</option></select></label><label className="checkbox-line"><input type="checkbox" /> Enquire about medical travel documentation assistance</label><button className="button button-primary">Prepare trip enquiry <ArrowRight size={15} /></button></form>
}

function Travel() {
  const { currency } = useApp()
  const [selected, setSelected] = useState<Record<string, number>>({})
  const total = travelServices.reduce((sum, item) => sum + item.price * (selected[item.id] || 0), 0)
  return <div className="page-wrap"><PageIntro eyebrow="OPTIONAL TRAVEL SERVICES" title="Plan the details around your visit." description="Explore illustrative add-ons for accommodation and transport. All services are optional, subject to availability, and not reservable through this demo." />
    <div className="travel-layout"><div><div className="travel-service-list">{travelServices.map(item => <article className="travel-card" key={item.id}><span className="travel-icon">{item.icon}</span><div className="travel-copy"><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><strong>{price(item.price, currency)} <small>{item.unit}</small></strong></div><div className="quantity-control"><button aria-label={`Remove ${item.name}`} onClick={() => setSelected(s => ({ ...s, [item.id]: Math.max(0, (s[item.id] || 0) - 1) }))}><ArrowDown size={14} /></button><span>{selected[item.id] || 0}</span><button aria-label={`Add ${item.name}`} onClick={() => setSelected(s => ({ ...s, [item.id]: (s[item.id] || 0) + 1 }))}><ArrowUpRight size={14} /></button></div></article>)}</div><p className="notice-box"><TrainFront size={18} /> No real transport, accommodation, or travel assistance bookings are made here.</p></div>
      <aside className="white-card travel-summary"><span className="eyebrow">ESTIMATED TRAVEL COST</span><h2>{price(total, currency)}</h2>{travelServices.filter(s => selected[s.id]).map(s => <div className="review-row" key={s.id}><span>{s.name} × {selected[s.id]}</span><strong>{price(s.price * selected[s.id], currency)}</strong></div>)}{!total && <p className="small-muted">Add an optional service to see an estimate.</p>}<div className="review-row total-row"><span>Travel estimate</span><strong>{price(total, currency)}</strong></div><p className="small-muted">Treatment costs are separate. Estimate uses configured example exchange rates and is not a quote.</p></aside></div>
  </div>
}

function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const register = mode === 'register'
  function submit(e: FormEvent) { e.preventDefault(); if (register && !name.trim()) { setMessage('Please enter your name.'); return }; localStorage.setItem('med-demo-user', 'Demo patient'); navigate('/dashboard') }
  return <div className="auth-page"><div className="auth-visual"><span className="eyebrow">MED.INDIA · FRONTEND DEMO</span><h1>{register ? 'A more connected care journey.' : 'Welcome back to your care journey.'}</h1><p>Access demo bookings and preferences. No real account or secure authentication is provided.</p><div className="auth-decoration"><HeartPulse size={92} strokeWidth={1} /></div></div><div className="auth-panel"><div className="auth-form"><Link to="/" className="back-link">← Back to home</Link><h2>{register ? 'Create a demo account' : 'Sign in to your demo account'}</h2><p className="muted">Demo only — do not enter a real password or sensitive information.</p><form onSubmit={submit}>{register && <label className="form-label">Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>}<label className="form-label">Email or mobile number<input required type="text" placeholder="you@example.com" /></label>{register && <label className="form-label">Country<select><option>India</option><option>United States</option><option>United Kingdom</option><option>Other</option></select></label>}<label className="form-label">{register ? 'Create a demo passphrase' : 'Demo passphrase'}<input type="password" placeholder="Any value (not saved)" required /></label>{!register && <label className="checkbox-line"><input type="checkbox" /> Remember me on this device</label>}{message && <p className="form-error" role="alert">{message}</p>}<button className="button button-primary full-button">{register ? 'Create demo account' : 'Continue to dashboard'} <ArrowRight size={16} /></button></form><p className="auth-switch">{register ? 'Already have a demo account?' : 'New to Med.India?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p><p className="small-muted">This demo does not save passwords or authenticate users with a server.</p></div></div></div>
}

function Dashboard() {
  const location = useLocation()
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('med-bookings') || '[]') as { title: string; date: string; type: string; status: string }[])
  const view = location.pathname.split('/')[2] || 'overview'
  const nav = [['overview','Overview'],['appointments','Appointments'],['records','Health records'],['travel','Travel itinerary'],['profile','Profile']]
  return <div className="dashboard-layout"><aside className="dashboard-sidebar"><Link to="/" className="brand"><span className="brand-mark"><HeartPulse size={22} /></span><span>Med<span className="brand-dot">.</span>India<small>DEMO PATIENT SPACE</small></span></Link><div className="dashboard-user"><span className="user-avatar">DP</span><div><strong>{localStorage.getItem('med-demo-user') || 'Demo patient'}</strong><small>Patient demo account</small></div></div><nav>{nav.map(([key,label])=><NavLink key={key} to={`/dashboard${key === 'overview' ? '' : `/${key}`}`} end={key === 'overview'}>{label}</NavLink>)}</nav><Link className="dashboard-signout" to="/" onClick={() => localStorage.removeItem('med-demo-user')}>← Back to Med.India</Link></aside>
    <section className="dashboard-main"><div className="dashboard-top"><div><span className="eyebrow">PATIENT SPACE · DEMO</span><h1>{nav.find(x => x[0] === view)?.[1] || 'Overview'}</h1></div><Link to="/doctors" className="button button-primary">Explore care <ArrowRight size={15} /></Link></div>
      {view === 'overview' && <><div className="welcome-panel"><div><h2>Hello, {localStorage.getItem('med-demo-user') || 'Demo patient'}.</h2><p>Your demo care journey at a glance.</p></div><CalendarDays size={34} /></div><div className="dashboard-stats"><Stat label="Appointment requests" value={String(bookings.length)} /><Stat label="Upcoming visits" value="—" /><Stat label="Trip plans" value="0" /></div><section className="dashboard-section"><div className="section-heading"><h2>Recent requests</h2><Link to="/dashboard/appointments" className="text-link">See all <ArrowRight size={14} /></Link></div><BookingList bookings={bookings} onClear={() => { localStorage.removeItem('med-bookings'); setBookings([]) }} /></section><div className="quick-actions"><Link to="/doctors"><Stethoscope />Find a doctor<ArrowRight /></Link><Link to="/medical-tourism"><Globe2 />Plan a visit<ArrowRight /></Link><Link to="/travel-services"><TrainFront />Explore travel<ArrowRight /></Link></div></>}
      {view === 'appointments' && <section className="dashboard-section"><p className="muted">Requests shown here are stored locally in this browser for demo purposes only.</p><BookingList bookings={bookings} onClear={() => { localStorage.removeItem('med-bookings'); setBookings([]) }} /></section>}
      {view === 'records' && <div className="records-warning"><ShieldCheck size={24} /><div><h2>Health records prototype</h2><p>This demo uses no personal health records and cannot store medical history, allergies, medications, or documents. Secure storage and access controls would be required before this feature could be used.</p></div></div>}
      {view === 'travel' && <section className="dashboard-section"><div className="empty-panel"><TrainFront size={28} /><h2>No travel itinerary yet</h2><p>Explore optional travel estimates. This demo cannot reserve hotels or transport.</p><ButtonLink to="/travel-services">Explore travel services <ArrowRight size={15} /></ButtonLink></div></section>}
      {view === 'profile' && <section className="dashboard-section"><div className="white-card"><h2>Demo profile preferences</h2><p>Profile details are not collected on this page. Language and currency preferences can be changed in the site header and are saved locally.</p><p className="notice-inline"><ShieldCheck size={15} /> Do not enter sensitive personal or medical details in this frontend demo.</p></div></section>}
    </section>
  </div>
}

function Stat({ label, value }: { label: string; value: string }) { return <article className="stat-card"><span>{label}</span><strong>{value}</strong><small>Demo overview</small></article> }
function BookingList({ bookings, onClear }: { bookings: { title: string; date: string; type: string; status: string }[]; onClear: () => void }) {
  return bookings.length ? <div className="booking-list">{bookings.map((b, i)=><article className="booking-row" key={`${b.title}-${i}`}><span className="booking-mini-icon"><CalendarDays size={18} /></span><div><strong>{b.title}</strong><small>{b.date} · {b.type}</small></div><span className="status-pill">{b.status}</span></article>)}<button className="text-button" onClick={onClear}>Clear demo request history</button></div> : <div className="empty-panel"><CalendarDays size={25} /><h3>No requests yet</h3><p>When you submit a demo booking request, it will appear here.</p><ButtonLink to="/doctors">Find a provider <ArrowRight size={15} /></ButtonLink></div>
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: () => void }) { return <div className="empty-panel"><Search size={25} /><h3>{title}</h3><p>{text}</p>{action && <button className="button button-secondary" onClick={action}>Clear filters</button>}</div> }
function NotFound() { return <div className="page-wrap not-found"><span className="eyebrow">PAGE NOT FOUND</span><h1>We couldn't find that page.</h1><p>Try returning to the homepage or exploring care.</p><ButtonLink to="/">Go to homepage <ArrowRight size={16} /></ButtonLink></div> }

export default App
