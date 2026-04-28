'use client'

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'Routes',       href: '#destinations' },
  { label: 'Reviews',      href: '#testimonials' },
  { label: 'Trips', href: '/trips' },
]

function AppStoreButton() {
  return (
    <a
      href="#cta"
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            8,
        background:     '#0286fd',
        color:          '#fff',
        borderRadius:   99,
        padding:        '10px 22px',
        fontSize:       14,
        fontWeight:     700,
        letterSpacing:  '-0.01em',
        textDecoration: 'none',
        boxShadow:      '0 6px 20px rgba(2,134,253,0.24)',
        transition:     'transform 0.15s, box-shadow 0.15s',
        flexShrink:     0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(2,134,253,0.34)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(2,134,253,0.24)'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v10M10 13l-4-4M10 13l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 16h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Download
    </a>
  )
}

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] px-5"
      style={{
        background:           'transparent',
        backdropFilter:       'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingTop:           12,
        paddingBottom:        12,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}
      >
        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/tripverse_app.png"
            alt="Tripverse"
            width={26}
            height={26}
            style={{ borderRadius: 7, display: 'block', objectFit: 'cover' }}
          />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#0A0A0A', letterSpacing: '-0.025em' }}>
            Tripverse
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center" style={{ gap: 28 }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{ fontSize: 14, color: '#8E8E93', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8E8E93')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* App Store button */}
        <AppStoreButton />
      </div>
      <meta name="google-site-verification" content="_FPG7YCCrK5-egKPI7K3yLrnOWcOkgTr0opbtVqjDEU" />
    </header>
  )
}
