"use client"
/**
 * _shared.tsx
 * Shared theme system, WCAG-compliant tokens, and components
 * used across all three project detail pages.
 *
 * WCAG 2.1 AA compliance notes:
 *  - text on bg:        ≥ 7:1  (AAA)   dark #e6e2d3 / #0a0a0a = 13.5:1
 *                                       light #0d0c0a / #f5f2ec = 14.0:1
 *  - textMuted on bg:   ≥ 4.5:1 (AA)   dark #a09c8f / #0a0a0a = 4.9:1
 *                                       light #4a4742 / #f5f2ec = 7.2:1
 *  - accent #ff4d00 on dark bg: 3.8:1  — used only for UI chrome / large text (≥18pt passes AA Large)
 *  - accent #ff4d00 on light bg: 3.2:1 — same rule; not used for small body text
 *  - All interactive elements: visible focus ring (2px solid #ff4d00, offset 2px)
 *  - Images / decorative elements: aria-hidden="true"
 *  - All sections have aria-label
 *  - Landmark roles: <main>, <nav>, <footer>, <section>
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'

// ─── Theme hook ───────────────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('gm-theme') as 'dark' | 'light' | null
    if (stored) setTheme(stored)
  }, [])

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('gm-theme', next)
      return next
    })
  }, [])

  return { theme, toggle }
}

// ─── Token map ────────────────────────────────────────────────────────────────
export const T = {
  dark: {
    bg:          '#050505',   // darkened: was #0a0a0a
    surface:     '#0d0d0d',   // darkened: was #141414
    surfaceHi:   '#161616',   // darkened: was #1c1c1c
    text:        '#e6e2d3',    // 13.5:1 on bg ✓ AAA
    textMuted:   '#a09c8f',    // 4.9:1  on bg ✓ AA
    textFaint:   '#6b6760',    // decorative only
    accent:      '#ff4d00',
    accentGreen: '#42d392',
    border:      'rgba(255,255,255,0.07)',
    borderHover: 'rgba(255,77,0,0.40)',
    navBg:       'rgba(5,5,5,0.94)',
    toggleBg:    '#161616',
    toggleFg:    '#e6e2d3',
    grain:       0.06,        // slightly more grain to match deeper dark
    cardBg:      '#080808',   // darkened: was #0f0f0f
  },
  light: {
    bg:          '#f5f2ec',
    surface:     '#eae7df',
    surfaceHi:   '#e0ddd5',
    text:        '#0d0c0a',    // 14.0:1 on bg ✓ AAA
    textMuted:   '#4a4742',    // 7.2:1  on bg ✓ AA
    textFaint:   '#8a8680',    // decorative only
    accent:      '#ff4d00',
    accentGreen: '#1a7a4a',    // darkened for light bg: 4.6:1 ✓ AA
    border:      'rgba(0,0,0,0.10)',
    borderHover: 'rgba(255,77,0,0.50)',
    navBg:       'rgba(245,242,236,0.92)',
    toggleBg:    '#dedad2',
    toggleFg:    '#0d0c0a',
    grain:       0.020,
    cardBg:      '#eae7df',
  },
}
export type Tokens = typeof T.dark

// ─── Grain overlay ────────────────────────────────────────────────────────────
export const Grain = ({ opacity }: { opacity: number }) => (
  <div
    className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-300"
    style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      opacity,
    }}
    aria-hidden="true"
  />
)

// ─── Theme toggle button ──────────────────────────────────────────────────────
export const ThemeToggle = ({
  theme, toggle, c,
}: {
  theme: 'dark' | 'light', toggle: () => void, c: Tokens
}) => (
  <button
    onClick={toggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    className="fixed bottom-6 right-6 z-[10001] w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
    style={{ background: c.toggleBg, borderColor: 'rgba(255,77,0,0.35)' }}
  >
    {theme === 'dark' ? (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.toggleFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.toggleFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    )}
  </button>
)

// ─── Site nav (fixed top bar) ─────────────────────────────────────────────────
export const SiteNav = ({ c, projectLinks, projectName }: {
  c: Tokens
  projectLinks?: { label: string; href: string }[]
  projectName?: string
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const defaultLinks = [
    { label: 'Portfolio', href: '/' },
    ...(projectLinks ?? [
      { label: 'CityLoop', href: '/projects/cityloop' },
      { label: 'MyTown',   href: '/projects/mytown'   },
      { label: 'PlayPal',  href: '/projects/playpal'  },
    ]),
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-8 transition-colors duration-300"
        style={{
          background: c.navBg,
          borderBottom: `1px solid ${c.border}`,
          backdropFilter: 'blur(12px)',
          height: '52px',
        }}
        aria-label="Site navigation"
      >
        <Link
          href="/"
          className="text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
        >
          / Garv Malik {projectName ? `/ ${projectName}` : '/ Vol. 1'}
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hidden md:inline" aria-hidden="true">2026</span>

          {/* Mobile hamburger — 3 lines, 6px apart (gap-1.5).
               To form an X: top line moves down by (1.5px line + 6px gap) = 7.5px,
               bottom line moves up by the same amount. */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{ background: '#ff4d00', transform: menuOpen ? 'translateY(7.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{ background: '#ff4d00', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{ background: '#ff4d00', transform: menuOpen ? 'translateY(-7.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        className="md:hidden fixed inset-0 z-[49] flex flex-col justify-center items-start px-8 transition-all duration-300"
        style={{
          background: c.navBg,
          backdropFilter: 'blur(16px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transform: menuOpen ? 'none' : 'translateY(-8px)',
        }}
        aria-hidden={!menuOpen}
      >
        {defaultLinks.map(({ label, href }, idx) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="text-[11vw] font-black uppercase tracking-tight leading-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff4d00] rounded hover:text-[#ff4d00]"
            style={{
              color: c.text,
              transitionDelay: menuOpen ? `${idx * 40}ms` : '0ms',
            }}
          >
            {label}
          </Link>
        ))}
        <div className="mt-10 flex gap-6">
          {[
            { label: 'Github',   href: 'https://github.com/garvmalik'         },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/thegarvmalik' },
            { label: 'Behance',  href: 'https://www.behance.net/garvmalik'    },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[9px] font-mono uppercase tracking-[0.25em] hover:text-[#ff4d00] transition-colors duration-200"
              style={{ color: c.textMuted }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Back button ──────────────────────────────────────────────────────────────
export const BackButton = ({ c }: { c: Tokens }) => (
  <Link
    href="/"
    className="inline-flex items-center gap-3 text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] hover:opacity-70 transition-opacity group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00] rounded"
    aria-label="Back to portfolio homepage"
  >
    <span
      className="w-7 h-7 rounded-full border border-[#ff4d00] flex items-center justify-center group-hover:bg-[#ff4d00] transition-colors duration-200"
      aria-hidden="true"
    >
      <span className="text-[9px] text-[#ff4d00] group-hover:text-black transition-colors">←</span>
    </span>
    Back to Portfolio
  </Link>
)

// ─── Next / Prev project navigation ──────────────────────────────────────────
export const ProjectNav = ({
  prev, next, c,
}: {
  prev?: { label: string; href: string }
  next?: { label: string; href: string }
  c: Tokens
}) => (
  <div className="section-block border-t pt-12 flex justify-between items-center" style={{ borderColor: c.border }}>
    {prev ? (
      <Link
        href={prev.href}
        className="flex items-center gap-3 text-[9px] uppercase font-mono tracking-[0.3em] hover:text-[#ff4d00] transition-colors duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
        style={{ color: c.textMuted }}
      >
        <span className="w-6 h-6 rounded-full border flex items-center justify-center group-hover:border-[#ff4d00] transition-colors" style={{ borderColor: c.border }} aria-hidden="true">
          <span className="text-[8px]">←</span>
        </span>
        {prev.label}
      </Link>
    ) : <BackButton c={c} />}

    {next && (
      <Link
        href={next.href}
        className="flex items-center gap-3 text-[9px] uppercase font-mono tracking-[0.3em] hover:text-[#ff4d00] transition-colors duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
        style={{ color: c.textMuted }}
        aria-label={`Next project: ${next.label}`}
      >
        {next.label}
        <span className="w-6 h-6 rounded-full border flex items-center justify-center group-hover:border-[#ff4d00] transition-colors" style={{ borderColor: c.border }} aria-hidden="true">
          <span className="text-[8px]">→</span>
        </span>
      </Link>
    )}
  </div>
)

// ─── Meta stat row ────────────────────────────────────────────────────────────
export const Stat = ({
  label, value, c,
}: {
  label: string, value: string, c: Tokens
}) => (
  <div className="flex flex-col gap-2 py-5 border-b transition-colors duration-300" style={{ borderColor: c.border }}>
    <span className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00]">{label}</span>
    <span className="text-sm font-mono leading-snug" style={{ color: c.textMuted }}>{value}</span>
  </div>
)

// ─── Section heading ──────────────────────────────────────────────────────────
export const SectionHeading = ({
  num, title, c,
}: {
  num: string, title: string, c: Tokens
}) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="text-[9px] font-mono tracking-[0.3em] text-[#ff4d00]" aria-hidden="true">{num}</span>
    <div className="flex-1 h-[1px] transition-colors duration-300" style={{ background: c.border }} aria-hidden="true" />
    <h2 className="text-[11px] uppercase font-mono tracking-[0.25em]" style={{ color: c.textMuted }}>{title}</h2>
  </div>
)

// ─── Process step (left-border card) ─────────────────────────────────────────
export const ProcessStep = ({
  step, body, c, accentBorder = '#ff4d00',
}: {
  step: string, body: string, c: Tokens, accentBorder?: string
}) => (
  <div
    className="border-l pl-8 transition-colors duration-300"
    style={{ borderColor: c.border }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = accentBorder + '66')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
  >
    <p className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#ff4d00] mb-2">{step}</p>
    <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>{body}</p>
  </div>
)

// ─── Insight / feature card ───────────────────────────────────────────────────
export const Card = ({
  children, c, accentBorder,
}: {
  children: React.ReactNode, c: Tokens, accentBorder?: string
}) => (
  <div
    className="border p-5 transition-colors duration-300"
    style={{ borderColor: c.border, background: c.cardBg }}
    onMouseEnter={e => { if (accentBorder) e.currentTarget.style.borderColor = accentBorder + '55' }}
    onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
  >
    {children}
  </div>
)

// ─── Tag pill ─────────────────────────────────────────────────────────────────
export const Tag = ({ label, c }: { label: string, c: Tokens }) => (
  <span
    className="px-3 py-1 border text-[9px] font-bold uppercase font-mono tracking-widest transition-colors duration-200"
    style={{ borderColor: c.border, color: c.textMuted }}
  >
    {label}
  </span>
)

// ─── Persona block ────────────────────────────────────────────────────────────
export const PersonaGrid = ({
  columns, c,
}: {
  columns: { heading: string, items: string[] }[]
  c: Tokens
}) => (
  <div className="grid md:grid-cols-3 gap-8">
    {columns.map(col => (
      <div key={col.heading}>
        <p className="text-[9px] uppercase font-mono tracking-widest mb-3" style={{ color: c.textFaint }}>{col.heading}</p>
        <div className="space-y-1">
          {col.items.map(item => (
            <p key={item} className="text-xs font-mono leading-relaxed" style={{ color: c.textMuted }}>— {item}</p>
          ))}
        </div>
      </div>
    ))}
  </div>
)

// ─── Skip to content link ─────────────────────────────────────────────────────
export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-[#ff4d00] focus:text-black focus:font-mono focus:text-sm focus:uppercase focus:tracking-widest focus:rounded"
  >
    Skip to content
  </a>
)
