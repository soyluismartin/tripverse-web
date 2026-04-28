'use client'

import { ReactNode, MouseEventHandler } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  href?:    string
  onClick?: MouseEventHandler<HTMLButtonElement>
  variant?: Variant
  size?:    Size
  fullWidth?: boolean
  className?: string
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: '#0A0A0A',   // rText — matches CTAButton in Swift
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: '#0286fd',   // accent blue
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 8px 32px rgba(2,134,253,0.20)',
  },
  ghost: {
    background: 'transparent',
    color: '#8E8E93',        // rSub
    border: '1.5px solid #C7C7CC',  // rBorderMid
  },
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '8px 18px',  fontSize: 13, borderRadius: 99 },
  md: { padding: '12px 26px', fontSize: 15, borderRadius: 99 },
  lg: { padding: '15px 36px', fontSize: 17, borderRadius: 99 },
}

const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

export default function Button({
  children,
  href,
  onClick,
  variant  = 'primary',
  size     = 'md',
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const combined: React.CSSProperties = {
    ...base,
    ...styles[variant],
    ...sizes[size],
    width: fullWidth ? '100%' : undefined,
  }

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.opacity = '0.82'
      e.currentTarget.style.transform = 'translateY(-1px)'
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.opacity = '1'
      e.currentTarget.style.transform = 'none'
    },
  }

  if (href) {
    return (
      <a href={href} style={combined} className={className} {...handlers}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} style={combined} className={className} {...handlers}>
      {children}
    </button>
  )
}
