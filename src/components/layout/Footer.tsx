'use client'

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Support', href: '/support' },
]

export default function Footer() {
  return (
    <footer
      className="px-5 py-6"
      style={{
        background:  '#F2F2F7',
        borderTop:   '1px solid #E5E5EA',
      }}
    >
      <div
        className="flex flex-wrap justify-between items-center gap-3"
        style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#8E8E93', fontWeight: 500 }}>
            Tripverse · 2026
          </span>
        </div>

        {/* Links */}
        <nav className="flex gap-6">
          {FOOTER_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize:   13,
                color:      '#8E8E93',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8E8E93')}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
