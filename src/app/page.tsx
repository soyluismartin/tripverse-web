'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Image from 'next/image'
import { IMGS } from '@/lib/images'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG    = 'var(--color-bg)'
const CARD  = 'var(--color-surface)'
const SEC   = 'var(--color-surface-2)'
const DARK  = 'var(--color-text)'
const MUTED = 'var(--color-muted)'
const BDL   = 'var(--color-border)'
const BDM   = 'var(--color-border-md)'
const BLUE  = 'var(--color-accent)'
const BLBG  = 'var(--color-accent-bg)'
const SHADOW = 'var(--shadow-card)'

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useReveal(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: t }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [t])
  return { ref, visible: v }
}

function Reveal({ children, delay = 0, y = 18, className = '', style }: {
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

// ── Section nav dots (right side) ─────────────────────────────────────────────
const SECTION_IDS = ['hero', 'features', 'ai-chat', 'destinations', 'testimonials', 'cta']

function NavDots() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = SECTION_IDS.indexOf(e.target.id)
          if (i >= 0) setActive(i)
        }
      })
    }, { threshold: 0.5 })
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 10, zIndex: 200,
    }}>
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            width: active === i ? 8 : 6,
            height: active === i ? 8 : 6,
            borderRadius: '50%',
            background: active === i ? BLUE : BDM,
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.25s ease',
          }}
        />
      ))}
    </div>
  )
}

// ── Phone mockup ──────────────────────────────────────────────────────────────
function Phone({ label = 'screen', width = 220, dark = false, children }: { label?: string; width?: number; dark?: boolean; children?: ReactNode }) {
  const r = Math.round(width * 0.145)
  const bezel = Math.max(5, Math.round(width * 0.026))
  const phoneW = `min(${width}px, 72vw)`
  const scaleLen = (factor: number, min = 0) => `clamp(${min}px, ${(72 * factor).toFixed(2)}vw, ${Math.round(width * factor)}px)`
  const phoneR = `clamp(30px, 10.5vw, ${r}px)`
  const phoneBezel = `clamp(5px, 1.9vw, ${bezel}px)`
  const screenRadius = `calc(${phoneR} - ${phoneBezel} + 1px)`
  return (
    <div className="phone-mockup" style={{
      position: 'relative',
      width: phoneW,
      aspectRatio: '1 / 2.12',
      flexShrink: 0,
      borderRadius: phoneR,
      background: '#0B0B0D',
      border: '2px solid #1A1A1C',
      boxShadow: '0 28px 70px rgba(0,0,0,0.22), 0 8px 22px rgba(0,0,0,0.14)',
    }}>
      {/* Side buttons */}
      <div style={{
        position: 'absolute',
        left: -4,
        top: scaleLen(0.33),
        width: 3,
        height: scaleLen(0.12),
        borderRadius: '3px 0 0 3px',
        background: '#111113',
      }} />
      <div style={{
        position: 'absolute',
        left: -4,
        top: scaleLen(0.5),
        width: 3,
        height: scaleLen(0.17),
        borderRadius: '3px 0 0 3px',
        background: '#111113',
      }} />
      <div style={{
        position: 'absolute',
        right: -4,
        top: scaleLen(0.48),
        width: 3,
        height: scaleLen(0.22),
        borderRadius: '0 3px 3px 0',
        background: '#111113',
      }} />

      {/* Screen */}
      <div style={{
        position: 'absolute',
        top: phoneBezel,
        left: phoneBezel,
        right: phoneBezel,
        bottom: phoneBezel,
        borderRadius: screenRadius,
        overflow: 'hidden',
        background: dark ? '#12122A' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
      }}>
        {children ?? (
          <div style={{
            width: '100%', height: '100%',
            background: dark
              ? 'repeating-linear-gradient(135deg,#1a1a2e,#1a1a2e 1px,#1e1e36 1px,#1e1e36 10px)'
              : 'repeating-linear-gradient(135deg,#e8eef6,#e8eef6 1px,#f0f4fa 1px,#f0f4fa 10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9, color: dark ? '#4466aa' : '#8899aa', fontFamily: 'monospace', textAlign: 'center', padding: 8 }}>{label}</span>
          </div>
        )}
      </div>

      {/* Dynamic Island */}
      <div style={{
        position: 'absolute',
        top: scaleLen(0.033, 9),
        left: '50%',
        transform: 'translateX(-50%)',
        width: scaleLen(0.28),
        height: scaleLen(0.068, 14),
        background: '#030304',
        borderRadius: 999,
        zIndex: 5,
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
      }}>
        <span style={{
          position: 'absolute',
          right: scaleLen(0.035),
          top: '50%',
          transform: 'translateY(-50%)',
          width: scaleLen(0.022, 5),
          height: scaleLen(0.022, 5),
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #4C7DFF 0%, #173060 38%, #07101F 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
        }} />
      </div>

      {/* Frame border overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: phoneR,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 0 0 3px rgba(0,0,0,0.88)',
        pointerEvents: 'none', zIndex: 6,
      }}/>
    </div>
  )
}

function MiniRouteScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: MUTED }}>9:41</div>
        <div style={{ fontSize: 10, color: MUTED }}>100%</div>
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: DARK, letterSpacing: '-0.04em' }}>Japan Route</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>7 days · Culture + food</div>
      </div>
      <div style={{ height: 90, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
        <Image src={IMGS.japan} alt="Japan" fill style={{ objectFit: 'cover' }} sizes="180px" />
      </div>
      {[
        ['Tokyo', '3 days', BLUE],
        ['Kyoto', '2 days', '#C7C7CC'],
        ['Osaka', '2 days', '#C7C7CC'],
      ].map(([city, days, color], i) => (
        <div key={city} style={{ background: CARD, borderRadius: 12, padding: '10px 12px', border: `1px solid ${BDL}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{city}</div>
            <div style={{ fontSize: 9, color: MUTED }}>{days}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 'auto', background: BLBG, borderRadius: 12, padding: '10px 12px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: BLUE, fontWeight: 700 }}>Total estimate</span>
        <span style={{ fontSize: 11, color: DARK, fontWeight: 800 }}>$1,240</span>
      </div>
    </div>
  )
}

function DestinationPickerScreen() {
  const destinations = [
    { name: 'Tokyo', sub: 'Culture · Food', src: IMGS.japan },
    { name: 'Paris', sub: 'Art · Romance', src: IMGS.europe },
    { name: 'Bali', sub: 'Beach · Relax', src: IMGS.beach },
    { name: 'Alps', sub: 'Adventure · Nature', src: IMGS.adventure },
    { name: 'New York', sub: 'City · Food', src: IMGS.city },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', padding: '18px 12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: MUTED }}>9:41</span>
        <span style={{ fontSize: 10, color: MUTED }}>100%</span>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Where next?
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>
          Pick destinations for your route
        </div>
      </div>

      <div style={{ height: 'calc(100% - 80px)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'destination-scroll 24s linear infinite' }}>
          {[...destinations, ...destinations].map((d, i) => (
            <div key={`${d.name}-${i}`} style={{
              background: CARD,
              border: `1px solid ${BDL}`,
              borderRadius: 16,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ width: 54, height: 54, borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <Image src={d.src} alt={d.name} fill style={{ objectFit: 'cover' }} sizes="54px" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{d.name}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{d.sub}</div>
              </div>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: i % 3 === 0 ? BLUE : BLBG,
                color: i % 3 === 0 ? '#fff' : BLUE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
              }}>
                +
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 28, background: 'linear-gradient(to bottom, #F8F8FB 0%, rgba(248,248,251,0) 100%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 38, background: 'linear-gradient(to top, #F8F8FB 0%, rgba(248,248,251,0) 100%)' }} />
      </div>
    </div>
  )
}

function MiniChatScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: MUTED }}>9:41</div>
        <div style={{ fontSize: 10, color: MUTED }}>100%</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: BLBG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✈️</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: DARK }}>Tripverse AI</div>
          <div style={{ fontSize: 9, color: BLUE }}>Planning assistant</div>
        </div>
      </div>
      {[
        ['ai', 'I found the best 10-day Japan route for culture and food.'],
        ['user', 'Can you add Nara as a day trip?'],
        ['ai', 'Done. I updated day 4, transport, costs, and the Kyoto guide.'],
      ].map(([from, text]) => (
        <div key={text} style={{
          alignSelf: from === 'user' ? 'flex-end' : 'flex-start',
          maxWidth: '84%',
          background: from === 'user' ? BLUE : CARD,
          color: from === 'user' ? '#fff' : DARK,
          borderRadius: from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          padding: '9px 10px',
          fontSize: 10,
          lineHeight: 1.45,
          border: from === 'user' ? 'none' : `1px solid ${BDL}`,
        }}>
          {text}
        </div>
      ))}
      <div style={{ marginTop: 'auto', background: CARD, border: `1px solid ${BDL}`, borderRadius: 99, padding: '9px 12px', color: MUTED, fontSize: 10 }}>
        Ask anything about your trip...
      </div>
    </div>
  )
}

// ── Image wrapper ─────────────────────────────────────────────────────────────
function Img({ src, h = 400, r = 24, alt = '' }: { src: string; h?: number; r?: number; alt?: string; label?: string; tint?: string }) {
  return (
    <div style={{ height: h, borderRadius: r, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
    </div>
  )
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function Bubble({ text, from, delay = 0 }: { text: string; from: 'user' | 'ai'; delay?: number }) {
  const isUser = from === 'user'
  return (
    <Reveal delay={delay} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '75%', padding: '10px 14px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? BLUE : CARD,
        color: isUser ? '#fff' : DARK,
        fontSize: 14, lineHeight: 1.55,
        boxShadow: isUser ? 'none' : SHADOW,
        border: isUser ? 'none' : `1px solid ${BDL}`,
      }}>
        {text}
      </div>
    </Reveal>
  )
}

// ── Pill tag ──────────────────────────────────────────────────────────────────
function Pill({ label, icon }: { label: string; icon: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: CARD, border: `1px solid ${BDL}`,
      borderRadius: 99, padding: '8px 16px', fontSize: 13,
      fontWeight: 500, color: DARK, boxShadow: SHADOW,
    }}>
      <span>{icon}</span> {label}
    </div>
  )
}

// ── Icon feature ──────────────────────────────────────────────────────────────
function IconFeature({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, background: BLBG,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        boxShadow: SHADOW,
      }}>{icon}</div>
      <span style={{ fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 64 }}>{label}</span>
    </div>
  )
}

function FeatureChip({ icon, label, color = BLUE }: { icon: string; label: string; color?: string }) {
  return (
    <div style={{
      minWidth: 132,
      background: CARD,
      border: `1px solid ${BDL}`,
      borderRadius: 18,
      padding: '18px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 13, color: DARK, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em' }}>{label}</span>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return

    const nextSoundEnabled = !soundEnabled
    video.muted = !nextSoundEnabled
    void video.play()
    setSoundEnabled(nextSoundEnabled)
  }

  return (
    <section id="hero" className="hero-section" style={{ background: CARD, padding: '118px 24px 92px', overflow: 'hidden' }}>
      <div className="hero-inner" style={{ maxWidth: 1180, margin: '0 auto', textAlign: 'left' }}>
        <Reveal className="hero-grid">
          <div className="hero-copy">
          <h1 className="hero-title" style={{
            fontSize: 'clamp(46px, 4.7vw, 68px)', fontWeight: 800,
            color: DARK, letterSpacing: '-0.06em', lineHeight: 1,
            margin: '0 0 24px', maxWidth: 760,
          }}>
            <span className="hero-title-line">Plan your next trip</span>
            <span className="hero-title-break"><br /></span>
            <span className="hero-title-line">in seconds.</span>
          </h1>
          <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.65, maxWidth: 560, margin: '0 0 34px' }}>
            Tripverse turns your travel ideas into a complete route with guides,
            transport, costs, and everything you need to go.
          </p>
          <div className="hero-cta-block" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <a href="#" className="app-store-cta" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: BLUE, color: '#fff', borderRadius: 99,
              padding: '17px 38px', fontSize: 17, fontWeight: 700,
              letterSpacing: '-0.01em', textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(2,134,253,0.30)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(2,134,253,0.42)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,134,253,0.30)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v10M10 13l-4-4M10 13l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download on the App Store
            </a>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 14, marginBottom: 0, textAlign: 'center' }}>Available on iOS · Designed for people who love to travel</p>
          </div>
          </div>

          <div className="hero-video-card" style={{
            position: 'relative',
            borderRadius: 30,
            overflow: 'hidden',
            background: '#F7F7FB',
            border: `1px solid ${BDL}`,
            boxShadow: '0 22px 60px rgba(0,0,0,0.09)',
            aspectRatio: '16 / 10',
          }}>
            <video
              ref={videoRef}
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: 'transparent',
              }}
            />
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute video' : 'Enable video sound'}
              style={{
                position: 'absolute',
                right: 18,
                bottom: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: 'none',
                borderRadius: 99,
                padding: '11px 15px',
                background: 'rgba(255,255,255,0.92)',
                color: DARK,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(14px)',
              }}
            >
              {soundEnabled ? (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 8v4h3l4 3V5L6 8H3Z" fill="currentColor"/>
                  <path d="M13 7c1 .9 1.5 1.9 1.5 3S14 12.1 13 13M15.5 4.8A7 7 0 0 1 18 10a7 7 0 0 1-2.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 8v4h3l4 3V5L6 8H3Z" fill="currentColor"/>
                  <path d="M13.5 8.5 17 12M17 8.5 13.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
              {soundEnabled ? 'Sound on' : 'Enable sound'}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Features() {
  const destinationPhotos = [
    { src: IMGS.japan, label: 'Tokyo' },
    { src: IMGS.europe, label: 'Paris' },
    { src: IMGS.beach, label: 'Bali' },
    { src: IMGS.adventure, label: 'Alps' },
    { src: IMGS.city, label: 'New York' },
    { src: IMGS.kyoto, label: 'Kyoto' },
    { src: IMGS.london, label: 'London' },
    { src: IMGS.rome, label: 'Rome' },
    { src: IMGS.barcelona, label: 'Barcelona' },
    { src: IMGS.santorini, label: 'Santorini' },
    { src: IMGS.istanbul, label: 'Istanbul' },
    { src: IMGS.marrakech, label: 'Marrakech' },
    { src: IMGS.rio, label: 'Rio' },
    { src: IMGS.singapore, label: 'Singapore' },
    { src: IMGS.capetown, label: 'Cape Town' },
    { src: IMGS.venice, label: 'Venice' },
    { src: IMGS.iceland, label: 'Iceland' },
    { src: IMGS.dubai, label: 'Dubai' },
    { src: IMGS.sydney, label: 'Sydney' },
    { src: IMGS.mexicoCity, label: 'Mexico City' },
  ]
  const photoRows = [
    destinationPhotos.slice(0, 10),
    destinationPhotos.slice(10),
  ]

  return (
    <section id="features" style={{ background: BG, padding: '72px 0 88px', overflow: 'hidden' }}>
      <Reveal>
        <div className="features-stage" style={{ position: 'relative', minHeight: 840, overflow: 'visible' }}>
          <div className="features-copy" style={{ position: 'relative', zIndex: 4, textAlign: 'center', padding: '28px 24px 0' }}>
            <h2 style={{
              fontSize: 'clamp(34px, 5vw, 64px)',
              fontWeight: 800,
              color: DARK,
              letterSpacing: '-0.055em',
              lineHeight: 1.04,
              margin: '0 auto 16px',
              maxWidth: 700,
            }}>
              Scroll destinations.<br />
              Build the perfect route.
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
              Pick the places you want to visit and Tripverse turns them into a route
              with timing, transport, guides and costs.
            </p>
          </div>

          {/* Moving photos directly on the grey background */}
          <div className="photo-ticker-stack">
            {photoRows.map((rowPhotos, row) => (
              <div key={row} style={{ overflow: 'visible', background: BG }}>
                <div className={`photo-ticker-track ${row === 0 ? 'photo-ticker-track--left' : 'photo-ticker-track--right'}`}>
                  {[...rowPhotos, ...rowPhotos, ...rowPhotos, ...rowPhotos].map((p, i) => (
                    <div key={`${p.label}-${row}-${i}`} className="hover-scale destination-photo-card" style={{
                      width: row === 0 ? 210 : 170,
                      height: row === 0 ? 138 : 112,
                      borderRadius: 28,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      boxShadow: '0 14px 40px rgba(0,0,0,0.10)',
                      background: BG,
                    }}>
                      <Image src={p.src} alt={p.label} fill style={{ objectFit: 'cover' }} sizes="220px" />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.30), transparent 58%)' }} />
                      <div style={{ position: 'absolute', left: 14, bottom: 12, color: '#fff', fontSize: 14, fontWeight: 800 }}>
                        {p.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Soft glow only behind the phone, matching the page background */}
          <div style={{
            position: 'absolute',
            top: 270,
            left: '50%',
            width: 640,
            height: 560,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242,242,247,1) 0%, rgba(242,242,247,0.96) 42%, rgba(242,242,247,0) 72%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', paddingTop: 84, paddingBottom: 46 }}>
            <Phone width={285}>
              <DestinationPickerScreen />
            </Phone>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ── Ticker rows ───────────────────────────────────────────────────────────────
const ROW1 = ['London', 'Paris', 'Tokyo', 'New York', 'Rome', 'Barcelona', 'Lisbon', 'Bali', 'Sydney', 'Dubai']
const ROW2 = ['Amsterdam', 'Kyoto', 'Cape Town', 'Santorini', 'Mexico City', 'Vienna', 'Prague', 'Istanbul', 'Marrakech', 'Buenos Aires']
const ROW3 = ['Singapore', 'Bangkok', 'Maldives', 'Reykjavik', 'Dubrovnik', 'Osaka', 'Miami', 'Zurich', 'Rio de Janeiro', 'Edinburgh']
const ROW4 = ['Seoul', 'Copenhagen', 'Athens', 'Florence', 'Havana', 'Porto', 'Seville', 'Vancouver', 'Nairobi', 'Queenstown']
const ROW5 = ['Lima', 'Cusco', 'Cartagena', 'Hanoi', 'Helsinki', 'Budapest', 'Krakow', 'Doha', 'Auckland', 'Montreal']

function TickerRow({ items, reverse = false, dim = false }: { items: string[]; reverse?: boolean; dim?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div className={`destination-ticker-track ${reverse ? 'destination-ticker-track--right' : 'destination-ticker-track--left'}`}>
        {doubled.map((city, i) => (
          <span key={i} className="destination-name-ticker" style={{
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: dim ? 'rgba(10,10,10,0.07)' : 'rgba(10,10,10,0.10)',
            userSelect: 'none',
          }}>
            {city}
          </span>
        ))}
      </div>
    </div>
  )
}

function AnimatedStat({
  target,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  target: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const { ref, visible } = useReveal(0.35)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!visible) return

    const duration = 1400
    const start = performance.now()
    let frame = 0

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setValue(target * eased)

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [target, visible])

  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()

  return (
    <div ref={ref} className="hover-scale" style={{
      textAlign: 'center',
      padding: '16px 18px',
    }}>
      <div style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: DARK, letterSpacing: '-0.06em', lineHeight: 0.95 }}>
        {prefix}{displayValue}{suffix}
      </div>
      <div style={{ fontSize: 15, color: MUTED, marginTop: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>
        {label}
      </div>
    </div>
  )
}

function ProofStrip() {
  return (
    <section style={{ background: BG, padding: '0 24px 40px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 18 }}>
            <AnimatedStat target={10} suffix="K+" label="Trips planned" />
            <AnimatedStat target={80} suffix="+" label="Countries covered" />
            <AnimatedStat target={4.9} suffix="★" label="Average rating" decimals={1} />
            <AnimatedStat target={60} prefix="<" suffix="s" label="To generate your route" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Destinations() {
  return (
    <section id="destinations" style={{ background: BG, padding: '80px 24px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        <div className="route-card" style={{
          background: CARD, borderRadius: 32,
          border: `1px solid ${BDL}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 720,
          padding: '56px 24px 48px',
        }}>

          <Reveal style={{ position: 'relative', zIndex: 3, textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800,
              color: DARK, letterSpacing: '-0.04em', lineHeight: 1.12,
              margin: '0 auto', maxWidth: 520,
            }}>
              Plan any route with no destination limits
            </h2>
          </Reveal>

          <div className="route-ticker-stack">
            <TickerRow items={ROW1} />
            <TickerRow items={ROW2} reverse dim />
            <TickerRow items={ROW3} />
            <TickerRow items={ROW4} reverse dim />
            <TickerRow items={ROW5} />
          </div>

          <div className="route-glow" style={{
            position: 'absolute', top: 104, left: '50%', transform: 'translateX(-50%)',
            width: 520, height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 42%, rgba(255,255,255,0.72) 58%, rgba(255,255,255,0) 78%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}/>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', paddingTop: 0 }}>
            <Phone width={255}>
              <MiniRouteScreen />
            </Phone>
          </div>

          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #fff 0%, transparent 100%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #fff 0%, transparent 100%)', pointerEvents: 'none' }}/>
        </div>

      </div>
    </section>
  )
}

function AiChat() {
  return (
    <section id="ai-chat" style={{ background: BG, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <div style={{ background: CARD, borderRadius: 32, border: `1px solid ${BDL}`, boxShadow: '0 8px 40px rgba(0,0,0,0.06)', minHeight: 640, position: 'relative', overflow: 'hidden', padding: '64px 24px 52px', textAlign: 'center' }}>
            <div style={{ position: 'absolute', right: 120, top: 120, fontSize: 180, color: 'rgba(2,134,253,0.05)', lineHeight: 1 }}>✦</div>
            <div style={{ position: 'absolute', left: 120, bottom: 150, fontSize: 120, color: 'rgba(2,134,253,0.04)', lineHeight: 1 }}>✦</div>

            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <Phone width={255}>
                <MiniChatScreen />
              </Phone>
            </div>

            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.12, margin: '36px auto 14px', maxWidth: 520 }}>
              Get an answer on any travel question
            </h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 28px' }}>
              Ask Tripverse to change your route, add a day trip, lower the budget, or explain the best transport option.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Will this route fit my budget?', 'Add one beach stop', 'What train should I take?'].map(q => (
                <span key={q} style={{ background: '#F7F7FB', color: BLUE, borderRadius: 99, padding: '10px 16px', fontSize: 13, fontWeight: 700, border: `1px solid ${BDL}` }}>
                  {q}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StatsCallout() {
  const [budget, setBudget] = useState(3000)
  const [budgetTouched, setBudgetTouched] = useState(false)
  const [activeStyle, setActiveStyle] = useState(0)
  const budgetOptions = [300, 2000, 5000, 10000, 20000]
  const formatBudget = (value: number) => `$ ${value >= 20000 ? '20000+' : value.toLocaleString('en-US')}`

  useEffect(() => {
    if (budgetTouched) return

    let frame = 0
    let direction = 1
    const timer = window.setInterval(() => {
      frame += direction
      if (frame >= 100) direction = -1
      if (frame <= 0) direction = 1

      const eased = (1 - Math.cos((frame / 100) * Math.PI)) / 2
      const next = Math.round((300 + eased * (10000 - 300)) / 100) * 100
      setBudget(next)
    }, 80)

    return () => window.clearInterval(timer)
  }, [budgetTouched])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStyle(current => (current + 1) % 8)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section style={{ background: BG, padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          <Reveal>
            <div className="stat-callout-card" style={{ background: CARD, borderRadius: 32, height: 360, border: `1px solid ${BDL}`, boxShadow: '0 8px 40px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '42px 28px 34px', display: 'flex', flexDirection: 'column' }}>
              <div className="stat-card-visual" style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 390 }}>
                {['Culture', 'Beach', 'Food', 'Road trip', 'Family', 'Luxury', 'Adventure', 'Budget'].map((item, i) => (
                  <span key={item} className="hover-scale travel-style-tag" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    top: activeStyle === i ? -2 : 0,
                    background: activeStyle === i ? BLUE : '#F7F7FB',
                    border: `1px solid ${activeStyle === i ? BLUE : BDL}`,
                    borderRadius: 18,
                    padding: '16px 20px',
                    minWidth: 112,
                    textAlign: 'center',
                    color: activeStyle === i ? '#fff' : DARK,
                    fontSize: 14,
                    fontWeight: 800,
                    boxShadow: activeStyle === i ? '0 8px 24px rgba(2,134,253,0.22)' : 'none',
                    transition: 'background 0.25s, border-color 0.25s, color 0.25s, top 0.25s, transform 0.25s, box-shadow 0.25s',
                  }}>
                    {item}
                  </span>
                ))}
                </div>
              </div>
              <div className="small-card-copy" style={{ textAlign: 'center', marginTop: 'auto' }}>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 8px' }}>
                  See trips for every travel style
                </h3>
                <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>Tripverse adapts the itinerary to how you actually travel.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="stat-callout-card" style={{ background: CARD, borderRadius: 32, height: 360, border: `1px solid ${BDL}`, boxShadow: '0 8px 40px rgba(0,0,0,0.05)', padding: '42px 28px 34px', display: 'flex', flexDirection: 'column' }}>
              <div className="stat-card-visual" style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: 430 }}>
                  <div className="budget-value" style={{ fontSize: 56, fontWeight: 800, color: DARK, letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 28, textAlign: 'center' }}>
                    {formatBudget(budget)}
                  </div>
                  <div style={{ position: 'relative', height: 28, marginBottom: 22 }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 11,
                      height: 5,
                      borderRadius: 99,
                      background: `linear-gradient(to right, ${BLUE} 0%, ${BLUE} ${((budget - 300) / (20000 - 300)) * 100}%, ${BDL} ${((budget - 300) / (20000 - 300)) * 100}%, ${BDL} 100%)`,
                    }} />
                    <input
                      type="range"
                      min={300}
                      max={20000}
                      step={100}
                      value={budget}
                      onPointerDown={() => setBudgetTouched(true)}
                      onChange={e => {
                        setBudgetTouched(true)
                        setBudget(Number(e.currentTarget.value))
                      }}
                      aria-label="Trip budget"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      left: `${((budget - 300) / (20000 - 300)) * 100}%`,
                      top: 0,
                      width: 54,
                      height: 28,
                      borderRadius: 14,
                      background: CARD,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {budgetOptions.map(value => (
                      <button
                        key={value}
                        type="button"
                        className="hover-scale budget-option"
                        onClick={() => {
                          setBudgetTouched(true)
                          setBudget(value)
                        }}
                        style={{
                          background: Math.abs(budget - value) < 250 ? BLUE : BLBG,
                          color: Math.abs(budget - value) < 250 ? '#fff' : BLUE,
                          borderRadius: 14,
                          padding: '8px 14px',
                          fontSize: 13,
                          fontWeight: 800,
                          border: `1px solid ${Math.abs(budget - value) < 250 ? BLUE : 'transparent'}`,
                          cursor: 'pointer',
                          boxShadow: Math.abs(budget - value) < 250 ? '0 8px 24px rgba(2,134,253,0.22)' : 'none',
                          transition: 'background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s',
                        }}
                      >
                        {value >= 20000 ? '$20k+' : value >= 1000 ? `$${value / 1000}k` : `$${value}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="small-card-copy" style={{ textAlign: 'center', marginTop: 'auto' }}>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 8px' }}>
                  Pick a budget before you plan
                </h3>
                <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>Tripverse uses your budget to shape routes, stays and transport.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const reviews = [
    {
      name: 'Sarah K.', meta: 'Dec 27th, 2025 / App Store',
      title: 'Japan in 10 days, planned perfectly',
      quote: 'I had a full Japan route with transport, costs and city guides in under two minutes. Every connection actually worked.',
      src: IMGS.person1,
      photo: IMGS.japan,
    },
    {
      name: 'Marco D.', meta: 'May 23rd, 2025 / Verified',
      title: 'No more spreadsheet planning',
      quote: 'The app knows how I travel. It gave me a route that felt personal, realistic, and easy to follow.',
      src: IMGS.person2,
    },
    {
      name: 'Jess T.', meta: 'Nov 18th, 2025 / Family trip',
      title: 'Simply love it!',
      quote: 'We booked 6 cities in Southeast Asia following a Tripverse route. The cost estimate was spot on.',
      src: IMGS.person3,
    },
    {
      name: 'Lena W.', meta: 'Sep 4th, 2025 / Backpacker',
      title: 'Better than my old travel spreadsheet',
      quote: 'I planned three weeks across South America. Tripverse gave me a cleaner route than anything I built manually.',
      src: IMGS.person4,
      photo: IMGS.adventure,
    },
    {
      name: 'David R.', meta: 'Aug 12th, 2025 / Frequent flyer',
      title: 'Transport finally makes sense',
      quote: 'The biggest win is that it understands actual train and bus timing. The route felt like something I could follow.',
      src: IMGS.person5,
    },
    {
      name: 'Aiko M.', meta: 'Jul 29th, 2025 / Weekend explorer',
      title: 'Perfect for short trips',
      quote: 'Used it for a four-day Tokyo itinerary. The guide was specific, practical, and much better than generic blogs.',
      src: IMGS.person6,
      photo: IMGS.kyoto,
    },
    {
      name: 'Nora P.', meta: 'Jun 18th, 2025 / Solo traveler',
      title: 'Saved me hours',
      quote: 'I went from an idea to a real route in minutes. I still edited it, but the starting point was excellent.',
      src: IMGS.traveler1,
    },
    {
      name: 'Mateo G.', meta: 'May 2nd, 2025 / Couple trip',
      title: 'The budget estimate helped a lot',
      quote: 'We changed cities twice and the cost estimate updated with the route. That made planning way less stressful.',
      src: IMGS.traveler2,
      photo: IMGS.beach,
    },
  ]
  const carousel = [...reviews, ...reviews]
  const reviewTrackRef = useRef<HTMLDivElement>(null)
  const reviewDragStartX = useRef(0)
  const reviewDragStartOffset = useRef(0)
  const [reviewOffset, setReviewOffset] = useState(0)
  const [draggingReviews, setDraggingReviews] = useState(false)

  const normalizeReviewOffset = (value: number) => {
    const halfWidth = (reviewTrackRef.current?.scrollWidth ?? 0) / 2
    if (!halfWidth) return value

    let next = value
    while (next <= -halfWidth) next += halfWidth
    while (next > 0) next -= halfWidth
    return next
  }

  useEffect(() => {
    if (draggingReviews) return

    let frame = 0
    let lastTime = performance.now()

    const tick = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      setReviewOffset(current => normalizeReviewOffset(current - delta * 0.025))
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [draggingReviews])

  return (
    <section id="testimonials" style={{ background: BG, padding: '96px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 64px)', fontWeight: 800, color: DARK, letterSpacing: '-0.05em', lineHeight: 1.02, margin: 0 }}>
            Loved by both<br />planners & explorers
          </h2>
          <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 460, margin: '18px auto 0' }}>
            Real travelers using Tripverse for real routes, budgets, guides and transport decisions.
          </p>
        </Reveal>
      </div>

      <Reveal style={{ overflowX: 'hidden', overflowY: 'visible', position: 'relative', padding: '28px 0 42px' }}>
        <div
          ref={reviewTrackRef}
          onPointerDown={e => {
            setDraggingReviews(true)
            reviewDragStartX.current = e.clientX
            reviewDragStartOffset.current = reviewOffset
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={e => {
            if (!draggingReviews) return
            const delta = e.clientX - reviewDragStartX.current
            setReviewOffset(normalizeReviewOffset(reviewDragStartOffset.current + delta))
          }}
          onPointerUp={e => {
            setDraggingReviews(false)
            e.currentTarget.releasePointerCapture(e.pointerId)
          }}
          onPointerCancel={() => setDraggingReviews(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 18,
            padding: '0 24px',
            transform: `translateX(${reviewOffset}px)`,
            cursor: draggingReviews ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          }}
        >
          {carousel.map((p, i) => (
            <div key={`${p.name}-${i}`} className="hover-scale" style={{
              width: p.photo ? 360 : 330,
              minHeight: p.photo ? 430 : (i % 3 === 0 ? 350 : 310),
              background: CARD,
              borderRadius: 26,
              padding: 24,
              border: `1px solid ${BDL}`,
              boxShadow: '0 12px 34px rgba(0,0,0,0.06)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <Image src={p.src} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="38px" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: DARK }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{p.meta}</div>
                  </div>
                </div>
                <div style={{ color: '#16A34A', fontSize: 14, letterSpacing: 1 }}>★★★★★</div>
              </div>
              {p.photo && (
                <div style={{ height: i % 2 === 0 ? 160 : 130, borderRadius: 18, overflow: 'hidden', position: 'relative', marginBottom: 20 }}>
                  <Image src={p.photo} alt={`${p.name} trip photo`} fill style={{ objectFit: 'cover' }} sizes="360px" />
                </div>
              )}
              <h3 style={{ fontSize: 21, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.15, margin: '0 0 14px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 15, color: DARK, lineHeight: 1.68, margin: 0 }}>
                {p.quote}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 22, fontSize: 12, color: MUTED }}>
                Verified Tripverse user
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${BG} 0%, rgba(242,242,247,0) 100%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${BG} 0%, rgba(242,242,247,0) 100%)`, pointerEvents: 'none' }} />
      </Reveal>
    </section>
  )
}

type ShowcaseFeature = {
  title: string
  description: string
  image: string
  eyebrow: string
  bullets: string[]
  accent: string
}

function ShowcasePhoneScreen({ feature }: { feature: ShowcaseFeature }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#F8F8FB', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '42%', overflow: 'hidden' }}>
        <Image src={feature.image} alt={feature.title} fill style={{ objectFit: 'cover' }} sizes="260px" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.46), rgba(0,0,0,0.05))' }} />
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 800, opacity: 0.86, marginBottom: 6 }}>
            {feature.eyebrow}
          </div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            {feature.title}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: MUTED, fontWeight: 700 }}>Tripverse</div>
            <div style={{ fontSize: 14, color: DARK, fontWeight: 800, letterSpacing: '-0.03em' }}>Smart planning</div>
          </div>
          <div style={{ background: `color-mix(in srgb, ${feature.accent} 10%, transparent)`, color: feature.accent, borderRadius: 99, padding: '7px 10px', fontSize: 10, fontWeight: 800 }}>
            Live
          </div>
        </div>

        {feature.bullets.map((bullet, i) => (
          <div key={bullet} style={{ background: CARD, border: `1px solid ${BDL}`, borderRadius: 14, padding: '10px 11px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? feature.accent : BLBG, color: i === 0 ? '#fff' : BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
              {i + 1}
            </div>
            <div style={{ fontSize: 11, color: DARK, fontWeight: 700, lineHeight: 1.25 }}>
              {bullet}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductShowcase() {
  const features: ShowcaseFeature[] = [
    {
      title: 'Personalized route generator',
      description: 'Build realistic itineraries around your dates, budget, pace, and favorite destinations.',
      image: IMGS.japan,
      eyebrow: 'Route builder',
      bullets: ['Day-by-day route', 'Costs and transport', 'Instant adjustments'],
      accent: BLUE,
    },
    {
      title: 'Community trips',
      description: 'Explore real routes from other travelers and adapt their best ideas to your own style.',
      image: IMGS.travelerGroup,
      eyebrow: 'Community trips',
      bullets: ['Shared itineraries', 'Traveler tips', 'Ideas ready to save'],
      accent: '#34C759',
    },
    {
      title: 'City activity recommendations',
      description: 'Find activities, neighborhoods, food spots, and local experiences for every stop.',
      image: IMGS.city,
      eyebrow: 'City guide',
      bullets: ['Nearby activities', 'Best times to go', 'Local experiences'],
      accent: '#FF9500',
    },
    {
      title: 'Safety checklist',
      description: 'Keep documents, insurance, health notes, alerts, and trip prep under control.',
      image: IMGS.mapPlanning,
      eyebrow: 'Safety checklist',
      bullets: ['Important documents', 'Alerts and prep', 'Before-you-go tasks'],
      accent: '#AF52DE',
    },
  ]
  const [activeFeature, setActiveFeature] = useState(0)
  const [featureTouched, setFeatureTouched] = useState(false)
  const selected = features[activeFeature]

  useEffect(() => {
    if (featureTouched) return

    const timer = window.setInterval(() => {
      setActiveFeature(current => (current + 1) % features.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [featureTouched, features.length])

  return (
    <section id="capabilities" style={{ background: BG, padding: '0 24px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <div className="product-showcase-card" style={{
            background: CARD,
            border: `1px solid ${BDL}`,
            borderRadius: 32,
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            minHeight: 720,
            padding: '56px 36px 48px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.12, textAlign: 'center', margin: '0 0 34px' }}>
              What can you do with Tripverse?
            </h2>

            <div className="product-showcase-grid" style={{ display: 'grid', gridTemplateColumns: '0.86fr 1fr', gap: 34, alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 10 }}>
                <div key={activeFeature} style={{ animation: 'showcase-phone-swap 0.7s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                  <Phone width={265}>
                    <ShowcasePhoneScreen feature={selected} />
                  </Phone>
                </div>
              </div>

              <div className="product-selector-list" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440 }}>
                {features.map((feature, i) => {
                  const isActive = activeFeature === i

                  return (
                    <button
                      key={feature.title}
                      type="button"
                      className="hover-scale product-selector"
                      onClick={() => {
                        setFeatureTouched(true)
                        setActiveFeature(i)
                      }}
                      style={{
                        textAlign: 'left',
                        background: isActive ? BLUE : '#F7F7FB',
                        border: `1px solid ${isActive ? BLUE : BDL}`,
                        borderRadius: 18,
                        padding: '18px 20px',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 12px 30px rgba(2,134,253,0.22)' : 'none',
                        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.22s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: isActive ? '#fff' : DARK, letterSpacing: '-0.035em', lineHeight: 1.15, margin: 0 }}>
                          {feature.title}
                        </h3>
                      </div>
                      <p style={{ fontSize: 14, color: isActive ? 'rgba(255,255,255,0.82)' : MUTED, lineHeight: 1.5, margin: 0 }}>
                        {feature.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AccentCallout() {
  return (
    <section style={{ background: BG, padding: '0 24px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          <Reveal>
            <div className="accent-card" style={{ background: CARD, borderRadius: 32, border: `1px solid ${BDL}`, boxShadow: '0 8px 40px rgba(0,0,0,0.05)', height: 360, padding: '42px 34px 34px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 142, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, width: '100%', maxWidth: 430 }}>
                {[
                  ['Tripverse', 118, BLUE],
                  ['Generic AI', 58, SEC],
                  ['Manual plan', 74, SEC],
                  ['Travel blog', 50, SEC],
                ].map(([name, height, color]) => (
                  <div key={name} style={{ flex: 1 }}>
                    <div className="hover-scale accent-bar" style={{ height: Number(height), borderRadius: 12, background: color as string, opacity: name === 'Tripverse' ? 0.85 : 1 }} />
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 8, textAlign: 'center' }}>{name}</div>
                  </div>
                ))}
                </div>
              </div>
              <div className="small-card-copy" style={{ textAlign: 'center', marginTop: 'auto' }}>
                <h3 style={{ fontSize: 25, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 8px' }}>
                  Best-in-class planning assistant
                </h3>
                <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>
                  Built for real routes, not generic inspiration.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="accent-card" style={{ background: CARD, borderRadius: 32, border: `1px solid ${BDL}`, boxShadow: '0 8px 40px rgba(0,0,0,0.05)', height: 360, padding: '42px 34px 34px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 142, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="suggestion-chip-group" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 420 }}>
                {['Will it fit my budget?', 'Can I add one beach stop?', 'What train should I book?'].map((q, i) => (
                  <div key={q} className="hover-scale suggestion-chip" style={{ background: i === 1 ? BLUE : '#EEF4FF', color: i === 1 ? '#fff' : BLUE, borderRadius: 99, padding: '12px 18px', fontSize: 15, fontWeight: 700, width: 'fit-content', boxShadow: i === 1 ? '0 8px 24px rgba(2,134,253,0.22)' : 'none' }}>
                    {q}
                  </div>
                ))}
                </div>
              </div>
              <div className="small-card-copy" style={{ textAlign: 'center', marginTop: 'auto' }}>
                <h3 style={{ fontSize: 25, fontWeight: 800, color: DARK, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 8px' }}>
                  Suggestions personalized to you
                </h3>
                <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>
                  Ask follow-ups and refine your route instantly.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section id="cta" style={{ background: BG, padding: '0 24px 64px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <div className="final-image-card" style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', minHeight: 360, boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <Img src={IMGS.heroAlt} h={360} r={0} alt="Travel planning" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.40), rgba(10,10,10,0.05))' }} />
            <div style={{ position: 'absolute', left: 36, bottom: 36, maxWidth: 420 }}>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0 }}>
                Tripverse feels like<br />travel planning made simple
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="final-copy" style={{ maxWidth: 720, margin: '44px auto 0', textAlign: 'center' }}>
          <h3 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: DARK, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0 0 24px' }}>
            Follow your route from idea to booked trip.
          </h3>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <a href="#" className="app-store-cta" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: '#0286fd', color: '#fff',
              borderRadius: 99, padding: '18px 48px',
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(2,134,253,0.30)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(2,134,253,0.42)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,134,253,0.30)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v10M10 13l-4-4M10 13l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download on the App Store
            </a>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
              Available on iOS · Designed for people who love to travel
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ProofStrip />
      <Destinations />
      <StatsCallout />
      <Testimonials />
      <ProductShowcase />
      <AccentCallout />
      <FinalCTA />
    </>
  )
}
