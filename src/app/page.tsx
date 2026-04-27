'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG     = '#F2F2F7'
const CARD   = '#FFFFFF'
const SEC    = '#E9E9EF'
const DARK   = '#0A0A0A'
const MUTED  = '#8E8E93'
const BDL    = '#E5E5EA'
const BDM    = '#C7C7CC'
const BLUE   = '#0286fd'
const BLBG   = '#E8F3FF'
const SHADOW = '0 4px 16px rgba(0,0,0,0.07)'

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({
  children, delay = 0, y = 20, className = '', style,
}: {
  children: ReactNode; delay?: number; y?: number
  className?: string; style?: React.CSSProperties
}) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Phone mockup screens ──────────────────────────────────────────────────────
function AppRouteScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', padding: '8px 7px 0', display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 3px' }}>
        <span style={{ fontSize: 8, color: MUTED }}>9:41</span>
        <span style={{ fontSize: 8, color: MUTED }}>●●● 100%</span>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: DARK, padding: '0 3px' }}>My Routes</div>
      {[
        { dest: 'Tokyo → Kyoto → Osaka', days: '7 days', tag: 'Japan' },
        { dest: 'Paris → Lyon → Nice',   days: '5 days', tag: 'France' },
        { dest: 'NYC → Boston → Philly', days: '4 days', tag: 'USA' },
      ].map((r, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 9, padding: '7px 8px', border: `1px solid ${BDL}`, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: DARK }}>{r.tag}</span>
            <span style={{ fontSize: 7, background: BLBG, color: BLUE, padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>{r.days}</span>
          </div>
          <div style={{ fontSize: 7.5, color: MUTED }}>{r.dest}</div>
        </div>
      ))}
    </div>
  )
}

function AppGuideScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', padding: '8px 7px 0', display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 3px' }}>
        <span style={{ fontSize: 8, color: MUTED }}>9:41</span>
        <span style={{ fontSize: 8, color: MUTED }}>●●● 100%</span>
      </div>
      <div style={{ padding: '0 3px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: DARK }}>Tokyo</div>
        <div style={{ fontSize: 8, color: MUTED, marginTop: 1 }}>Day 1–3 · Guide</div>
      </div>
      <div style={{ height: 52, borderRadius: 8, flexShrink: 0, background: 'repeating-linear-gradient(45deg,#cdd8e8,#cdd8e8 1px,#dce5f0 1px,#dce5f0 6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 7, color: '#8899aa' }}>map</span>
      </div>
      {['Shibuya Crossing', 'Senso-ji Temple', 'Shinjuku Garden', 'Tsukiji Market'].map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 7, padding: '5px 7px', border: `1px solid ${BDL}`, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? BLUE : BDM, flexShrink: 0 }} />
          <span style={{ fontSize: 8, color: DARK }}>{p}</span>
        </div>
      ))}
    </div>
  )
}

function PhoneFrame({ screen = 'route', width = 240, style: sx = {} }: {
  screen?: 'route' | 'guide'; width?: number; style?: React.CSSProperties
}) {
  const h = Math.round(width * 2.1)
  const r = Math.round(width * 0.125)
  const b = 5
  return (
    <div style={{ position: 'relative', width, height: h, flexShrink: 0, ...sx }}>
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        <rect x="0" y="0" width={width} height={h} rx={r} fill="#1C1C1E" />
        <rect x={b} y={b} width={width - b * 2} height={h - b * 2} rx={r - b + 2} fill="none" stroke="#2C2C2E" strokeWidth="0.5" />
        <rect x={width / 2 - 19} y={b + 7} width="38" height="12" rx="6" fill="#111" />
        <rect x={width / 2 - 17} y={h - b - 12} width="34" height="4" rx="2" fill="#3A3A3C" />
        <rect x="-1" y={h * 0.27} width="3" height="22" rx="1.5" fill="#2A2A2C" />
        <rect x="-1" y={h * 0.36} width="3" height="22" rx="1.5" fill="#2A2A2C" />
        <rect x={width - 2} y={h * 0.32} width="3" height="30" rx="1.5" fill="#2A2A2C" />
      </svg>
      <div style={{ position: 'absolute', top: b + 24, left: b, right: b, bottom: b + 20, borderRadius: r - b + 1, overflow: 'hidden', background: BG, zIndex: 1 }}>
        {screen === 'guide' ? <AppGuideScreen /> : <AppRouteScreen />}
      </div>
    </div>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function HexLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 22,7.5 22,16.5 12,22 2,16.5 2,7.5" fill={BLUE} fillOpacity={0.12} />
      <polygon points="12,2 22,7.5 22,16.5 12,22 2,16.5 2,7.5" stroke={BLUE} strokeWidth="1.6" fill="none" />
      <circle cx="12" cy="12" r="2.5" fill={BLUE} />
    </svg>
  )
}

// ── Feature icons ─────────────────────────────────────────────────────────────
function FIcon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
      stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const FICONS: Record<string, ReactNode> = {
  route: (
    <FIcon>
      <circle cx="4" cy="4" r="2.2" fill={BLUE} stroke="none" />
      <circle cx="16" cy="16" r="2.2" fill={BLUE} stroke="none" />
      <path d="M4 6.2 C4 10 10 10 10 14M16 13.8 L16 10" strokeDasharray="2.5 2" />
    </FIcon>
  ),
  guide: (
    <FIcon>
      <rect x="3.5" y="2" width="13" height="16" rx="2.5" />
      <line x1="7" y1="6.5" x2="13" y2="6.5" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13.5" x2="10" y2="13.5" />
    </FIcon>
  ),
  cost: (
    <FIcon>
      <rect x="1.5" y="5.5" width="17" height="11" rx="2.5" />
      <line x1="1.5" y1="9.5" x2="18.5" y2="9.5" />
      <circle cx="5.5" cy="13" r="1.5" fill={BLUE} stroke="none" />
    </FIcon>
  ),
  community: (
    <FIcon>
      <circle cx="7.5" cy="7.5" r="2.8" />
      <circle cx="13.5" cy="7.5" r="2.8" />
      <path d="M1.5 17 C1.5 13.5 4 12 7.5 12" />
      <path d="M13.5 12 C17 12 18.5 13.5 18.5 17" />
    </FIcon>
  ),
  profile: (
    <FIcon>
      <circle cx="10" cy="6.5" r="3.2" />
      <path d="M3.5 17.5 C3.5 13.8 6.5 12 10 12 C13.5 12 16.5 13.8 16.5 17.5" />
    </FIcon>
  ),
}

function FeatureIcon({ type, size = 48 }: { type: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, background: BLBG, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {FICONS[type]}
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: 'route',     title: 'A complete route, not just a list of places',   body: "Tell us where you want to go, how long you have, and what kind of traveler you are. Tripverse builds a day-by-day route with real transport connections, layovers, and timing — so you can actually follow it." },
  { icon: 'guide',     title: 'Your full trip guide, generated instantly',      body: 'Every destination comes with city highlights, top activities, local tips, and a cost breakdown. Not generic content — a guide built specifically for your trip.' },
  { icon: 'cost',      title: "Know exactly what you'll spend",                 body: "Tripverse estimates your total transport cost before you book anything. See the full picture — by segment, by city, by trip — so you travel with no surprises." },
  { icon: 'community', title: 'Discover trips from real travelers',             body: "Browse routes created by other Tripverse users. Filter by style, destination, or budget. Like the ones that inspire you. Share yours when you're ready." },
  { icon: 'profile',   title: 'Built around how you travel',                   body: 'Solo or with family. Budget or luxury. Fast-paced or relaxed. Tripverse learns your travel style during onboarding and uses it every time you plan.' },
]

const STEPS = [
  { n: '1', title: 'Tell us your trip',        body: "Choose your destinations, travel dates, budget, and who you're traveling with. It takes less than a minute." },
  { n: '2', title: 'Get your route',           body: 'Tripverse generates a complete multi-destination route with transport options, stop durations, and a cost estimate — tailored to your preferences.' },
  { n: '3', title: 'Travel with your guide',   body: 'Open your Trip Guide for any destination — city highlights, activities, transport details, and tips. Everything you need, in your pocket.' },
]

const TESTIMONIALS = [
  { quote: "Planning our Japan trip with Tripverse was insane. Had a 10-day route with all transport sorted in under 2 minutes. Every connection actually worked.", name: 'Sarah K.', sub: 'Solo traveler · 12 countries' },
  { quote: "I've tried every travel app out there. Nothing comes close to the level of detail Tripverse generates. It literally knows exactly how I travel.", name: 'Marco D.', sub: 'Digital nomad · Based in Lisbon' },
  { quote: "Booked 6 cities in Southeast Asia following a Tripverse route. Every transport connection was perfect. The cost estimate was spot on too.", name: 'Jess T.', sub: 'Frequent traveler · Family of 4' },
]

const FAQS = [
  { q: 'Is Tripverse free to use?',                  a: "Yes — Tripverse is free to start. You can plan routes and access basic guides without a subscription. Premium features like unlimited routes and offline guides are available with Tripverse Pro." },
  { q: "Can I edit the route after it's generated?", a: 'Absolutely. Every route is fully editable. Add or remove stops, change transport options, adjust durations, and reorder destinations. Think of the AI route as your starting point.' },
  { q: 'Does it work for any destination?',          a: "Tripverse covers 80+ countries and is constantly expanding. For popular destinations you'll get rich city guides, local tips, and detailed transport info." },
  { q: 'Can I share my trip with others?',           a: 'Yes. Every route can be shared privately with travel companions or published to the Tripverse community. Other users can discover, like, and adapt your route.' },
  { q: 'How accurate is the cost estimation?',       a: 'Cost estimates are based on real transport data and updated pricing for flights, trains, and buses. We recommend confirming final prices before booking.' },
]

const COMMUNITY_ROUTES = [
  { title: '10 Days in Japan',      user: '@sarah_k', tags: ['Culture', 'Rail Pass'], days: 10 },
  { title: 'Balkans on a Budget',   user: '@marco_d', tags: ['Budget', 'Adventure'],  days: 14 },
  { title: 'Pacific Coast Highway', user: '@jess_t',  tags: ['Road Trip', 'Family'],  days: 7  },
]

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ label, title, center = true }: { label: string; title: string; center?: boolean }) {
  return (
    <Reveal className={`mb-12 md:mb-16 ${center ? 'text-center' : 'text-left'}`}>
      <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
      <h2 className="text-[28px] md:text-[44px]" style={{ fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>{title}</h2>
    </Reveal>
  )
}

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between px-5 md:px-12"
      style={{ background: 'rgba(242,242,247,0.88)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: `1px solid ${BDL}`, paddingTop: 14, paddingBottom: 14 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <HexLogo />
        <span style={{ fontWeight: 700, fontSize: 16, color: DARK, letterSpacing: '-0.025em' }}>Tripverse</span>
      </div>

      <div className="hidden md:flex items-center" style={{ gap: 32 }}>
        {[
          { label: 'Features',     href: '#features' },
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Pricing',      href: '#pricing' },
        ].map(l => (
          <a
            key={l.label} href={l.href}
            style={{ fontSize: 14, color: MUTED, textDecoration: 'none', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = DARK)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >{l.label}</a>
        ))}
      </div>

      <a
        href="#download"
        style={{ background: DARK, color: '#fff', padding: '10px 24px', borderRadius: 99, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', textDecoration: 'none', transition: 'opacity 0.15s', display: 'inline-block' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Get the app
      </a>
    </nav>
  )
}

// ── HeroE — Full-bleed Magazine ───────────────────────────────────────────────
function HeroE() {
  return (
    <section style={{ background: CARD, borderBottom: `1px solid ${BDL}` }}>
      {/* Full-bleed image area — replace inner div with next/image when photo is available */}
      <div className="relative h-[380px] md:h-[580px] overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'repeating-linear-gradient(135deg,#c0cdd8,#c0cdd8 1px,#d8e2ea 1px,#d8e2ea 10px)' }}
        >
          <span style={{ fontSize: 11, color: '#8899aa', fontFamily: 'monospace' }}>[ full-bleed destination photograph ]</span>
        </div>

        {/* Gradient fade to white at bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.96) 85%, #FFFFFF 100%)' }} />

        {/* Text overlay — positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-20 md:pb-12">
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: BLBG, borderRadius: 99, padding: '5px 12px', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: BLUE, fontWeight: 600 }}>AI-powered planning</span>
            </div>
            <h1 className="text-[40px] md:text-[68px]" style={{ fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
              Your next trip,<br />planned in seconds.
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#download"
                style={{ background: DARK, color: '#fff', display: 'inline-block', padding: '13px 28px', borderRadius: 99, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Start planning free
              </a>
              <span style={{ fontSize: 14, color: MUTED }}>→ No credit card required</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Subhead paragraph */}
      <div className="px-5 py-7 md:px-20 md:py-9" style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Reveal>
          <p className="text-[16px] md:text-[19px]" style={{ color: MUTED, lineHeight: 1.65, maxWidth: 640, letterSpacing: '-0.01em', margin: 0 }}>
            Tripverse turns your travel ideas into a complete, personalized route — with stops,
            transport, activities, costs, and a full guide. All powered by AI. All in one place.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── FeaturesE — Magazine Feature Grid ────────────────────────────────────────
function FeaturesE() {
  return (
    <section id="features" className="py-16 px-5 md:py-24 md:px-12" style={{ background: BG }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <SectionHead label="WHAT TRIPVERSE DOES" title="Not just a list of places." />

        {/* Featured first card */}
        <Reveal>
          <div
            className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mb-5"
            style={{ background: CARD, borderRadius: 20, border: `1px solid ${BDL}`, boxShadow: SHADOW }}
          >
            <div className="px-7 py-9 md:px-14 md:py-14 flex flex-col justify-center">
              <FeatureIcon type={FEATURES[0].icon} size={52} />
              <h3 className="text-[22px] md:text-[28px]" style={{ fontWeight: 700, color: DARK, margin: '20px 0 14px', letterSpacing: '-0.03em', lineHeight: 1.25 }}>
                {FEATURES[0].title}
              </h3>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, margin: 0 }}>{FEATURES[0].body}</p>
            </div>
            {/* Feature image placeholder */}
            <div
              className="min-h-[200px] md:min-h-[360px] flex items-center justify-center"
              style={{ background: 'repeating-linear-gradient(45deg,#d8d8de,#d8d8de 1px,#E9E9EF 1px,#E9E9EF 8px)', fontSize: 11, color: MUTED, fontFamily: 'monospace' }}
            >
              [ route map · feature visual ]
            </div>
          </div>
        </Reveal>

        {/* White grid — features 2 & 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-5" style={{ gap: 20 }}>
          {FEATURES.slice(1, 3).map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ background: CARD, borderRadius: 16, padding: 32, border: `1px solid ${BDL}`, boxShadow: SHADOW }}>
                <FeatureIcon type={f.icon} size={44} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: '18px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tinted grid — features 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
          {FEATURES.slice(3).map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ background: SEC, borderRadius: 16, padding: 32, border: `1px solid ${BDL}` }}>
                <FeatureIcon type={f.icon} size={44} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: '18px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── StepsSection ──────────────────────────────────────────────────────────────
function StepsSection() {
  return (
    <section id="how-it-works" className="py-16 px-5 md:py-24 md:px-12" style={{ background: CARD }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <SectionHead label="THREE STEPS TO YOUR TRIP" title="Simple. Fast. Complete." />
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 110}>
              <div style={{ background: BG, borderRadius: 16, padding: 28, border: `1px solid ${BDL}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 10, right: 18, fontSize: 64, fontWeight: 800, color: BDL, lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em', pointerEvents: 'none' }}>
                  {s.n}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── StatsSection ──────────────────────────────────────────────────────────────
function StatsSection() {
  const stats: [string, string][] = [
    ['10,000+', 'trips planned'],
    ['80+',     'countries covered'],
    ['4.9★',   'average rating'],
  ]
  return (
    <section className="py-14 px-5 md:py-20 md:px-12" style={{ background: SEC }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="text-[26px] md:text-[40px]" style={{ fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0 }}>
            Thousands of routes planned.<br />
            <span style={{ color: BLUE }}>Millions of miles covered.</span>
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 20 }}>
          {stats.map(([n, l], i) => (
            <Reveal key={i} delay={i * 100} className="text-center">
              <div style={{ padding: '0 40px', borderLeft: i > 0 ? `1px solid ${BDM}` : 'none' }}>
                <div className="text-[40px] md:text-[58px]" style={{ fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 15, color: MUTED, marginTop: 8, fontWeight: 500 }}>{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TestimonialsSection ───────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="py-16 px-5 md:py-24 md:px-12" style={{ background: BG }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <SectionHead label="WHAT TRAVELERS SAY" title="Loved by real travelers." />
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: CARD, borderRadius: 16, padding: 28, border: `1px solid ${BDL}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontSize: 40, color: BDL, lineHeight: 1, fontFamily: 'Georgia,serif', marginTop: -8, marginBottom: -12 }}>&ldquo;</div>
                <p style={{ fontSize: 15, color: DARK, lineHeight: 1.7, flex: 1, margin: 0 }}>{t.quote}</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: `repeating-linear-gradient(135deg,${BDM},${BDM} 1px,${BDL} 1px,${BDL} 5px)`, border: `1px solid ${BDM}` }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{t.sub}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CommunitySection ──────────────────────────────────────────────────────────
function CommunitySection() {
  return (
    <section className="py-16 px-5 md:py-24 md:px-12" style={{ background: SEC }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-20">

          {/* Left — text + filter pills */}
          <Reveal>
            <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>DISCOVER</div>
            <h2 className="text-[30px] md:text-[44px]" style={{ fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 20 }}>
              Travel is better<br />when shared.
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 28 }}>
              Every trip you create on Tripverse can be shared with the community. Discover routes
              to places you hadn&apos;t considered. Find travelers with your same style. Get inspired
              before you even open a map.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Adventure', 'Budget', 'Family', 'Luxury', 'Solo', 'Weekend'].map(tag => (
                <span key={tag} style={{ padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${BDM}`, fontSize: 13, color: MUTED, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </Reveal>

          {/* Right — route cards */}
          <Reveal delay={150}>
            <div className="flex flex-col gap-3">
              {COMMUNITY_ROUTES.map((r, i) => (
                <div key={i} style={{ background: CARD, borderRadius: 14, padding: '16px 20px', border: `1px solid ${BDL}`, boxShadow: SHADOW, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 6 }}>{r.title}</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span style={{ fontSize: 12, color: MUTED }}>{r.user} ·</span>
                      {r.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 11, background: BG, color: MUTED, padding: '2px 9px', borderRadius: 99, border: `1px solid ${BDL}`, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: DARK }}>{r.days}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>days</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── FAQSection ────────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="pricing" className="py-16 px-5 md:py-24 md:px-12" style={{ background: CARD }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionHead label="FAQ" title="Common questions." />
        <Reveal>
          <div style={{ border: `1px solid ${BDL}`, borderRadius: 16, overflow: 'hidden' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ borderTop: i > 0 ? `1px solid ${BDL}` : 'none', cursor: 'pointer' }}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                {/* Question row */}
                <div
                  className="flex justify-between items-center px-5 py-[18px] md:px-7 md:py-5"
                  style={{ background: openIdx === i ? BG : CARD, transition: 'background 0.2s' }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: DARK, letterSpacing: '-0.01em', paddingRight: 16 }}>{faq.q}</span>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: openIdx === i ? DARK : SEC,
                      color: openIdx === i ? '#fff' : MUTED,
                      fontSize: 18, lineHeight: 1, fontWeight: 300,
                      transition: 'all 0.2s',
                      transform: openIdx === i ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    +
                  </div>
                </div>

                {/* Answer */}
                {openIdx === i && (
                  <div className="px-5 pb-[18px] md:px-7 md:pb-[22px]" style={{ background: BG }}>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── FinalCTASection ───────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section id="download" className="py-20 px-5 md:py-[120px] md:px-12 text-center" style={{ background: DARK }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Reveal>
          <h2 className="text-[36px] md:text-[58px]" style={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Your next adventure<br />is one tap away.
          </h2>
          <p className="text-[15px] md:text-[17px]" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.65 }}>
            Download Tripverse and plan your first route in under 60 seconds.<br />
            Free to start. No credit card required.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-[10px]"
            style={{
              background: BLUE, color: '#fff', borderRadius: 99,
              padding: '16px 36px', fontSize: 17, fontWeight: 700,
              letterSpacing: '-0.01em', textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(2,134,253,0.30)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(2,134,253,0.40)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,134,253,0.30)'
            }}
          >
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L9 12M9 12L5.5 8.5M9 12L12.5 8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 15H15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Download on the App Store
          </a>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
            Available on iOS · Designed for people who actually travel.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="flex flex-wrap justify-between items-center px-5 py-6 md:px-12 gap-3"
      style={{ background: DARK, borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HexLogo size={16} />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>Tripverse · 2025</span>
      </div>
      <div className="flex gap-6">
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{l}</a>
        ))}
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <NavBar />
      <HeroE />
      <FeaturesE />
      <StepsSection />
      <StatsSection />
      <TestimonialsSection />
      <CommunitySection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  )
}
