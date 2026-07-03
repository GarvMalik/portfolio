"use client"
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
// Fix: removed duplicate useTheme and T — now imported from _shared
import { useTheme, T } from './projects/_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/* ── Marquee ─────────────────────────────────────────────────────────────── */
const Marquee = ({ items, speed = 40, reverse = false, textColor }: {
  items: string[], speed?: number, reverse?: boolean, textColor: string
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  useEffect(() => {
    const track = trackRef.current
    if (!track || reduced) return
    const w = track.scrollWidth / 2
    const tween = gsap.fromTo(track, { x: reverse ? -w : 0 }, { x: reverse ? 0 : -w, duration: w / speed, ease: 'none', repeat: -1 })
    return () => { tween.kill() }
  }, [speed, reverse, reduced])
  return (
    <div className="overflow-hidden whitespace-nowrap select-none py-2" aria-hidden="true">
      <div ref={trackRef} className="inline-flex">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center text-[11px] uppercase font-mono tracking-[0.3em] px-8" style={{ color: textColor }}>
            {item}<span className="ml-8 text-[#ff4d00]" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Layered hero text ───────────────────────────────────────────────────── */
const LayeredText = ({ text, className = '', color }: { text: string, className?: string, color: string }) => (
  <span className={`flex flex-wrap ${className}`} aria-label={text} role="text">
    {text.split('').map((char, i) => (
      <span key={i} className="relative inline-flex justify-center overflow-hidden" style={{ width: char === ' ' ? '0.3em' : 'auto' }} aria-hidden="true">
        <span className="layered-bottom opacity-0" style={{ color }}>{char}</span>
        <span className="absolute top-0 left-0 w-full h-full layered-top" style={{ color }}>{char}</span>
      </span>
    ))}
  </span>
)

/* ── List row ────────────────────────────────────────────────────────────── */
const ListRow = ({ label, value, borderColor, textColor, labelColor }: {
  label: string, value: string, borderColor: string, textColor: string, labelColor: string
}) => (
  // Issue 3 fix: increased label from 9px→11px, value from 11px→13px for readability
  <div className="split-item flex justify-between items-baseline py-3.5 border-b transition-colors duration-300" style={{ borderColor }}>
    <span className="text-[11px] uppercase font-mono tracking-[0.2em] flex-shrink-0 mr-6" style={{ color: labelColor }}>{label}</span>
    <span className="text-[13px] uppercase tracking-wide font-mono text-right leading-snug" style={{ color: textColor }}>{value}</span>
  </div>
)

/* ── Hover wave email ────────────────────────────────────────────────────── */
const HoverWaveText = ({ text, color }: { text: string, color: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current || reduced) return
        gsap.to(ref.current.children, { y: -12, stagger: 0.025, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' })
        gsap.to(ref.current.children, { color: '#ff4d00', stagger: 0.025, duration: 0.18, overwrite: 'auto' })
      }}
      onMouseLeave={() => { if (!ref.current) return; gsap.to(ref.current.children, { color, duration: 0.4, stagger: 0.02, overwrite: 'auto' }) }}
      aria-hidden="true"
      className="text-[6vw] md:text-[3.2vw] font-bold uppercase leading-none tracking-tighter flex flex-wrap"
      style={{ color }}
    >
      {text.split('').map((char, i) => <span key={i} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>)}
    </div>
  )
}

/* ── Theme toggle ────────────────────────────────────────────────────────────
 * WCAG 4.1.2: aria-label describes action, not state
 * WCAG 2.4.7: focus-visible ring
 * WCAG 2.5.5: 48×48px touch target
 */
const ThemeToggle = ({ theme, toggle, bg, fg }: { theme: 'dark' | 'light', toggle: () => void, bg: string, fg: string }) => (
  <button
    onClick={toggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    className="fixed bottom-6 right-6 z-[10001] w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
    style={{ background: bg, borderColor: 'rgba(255,77,0,0.45)' }}
  >
    {theme === 'dark' ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    )}
  </button>
)

/* ── Project card ────────────────────────────────────────────────────────────
 * FIX: Changed from <div> to <article> (WCAG 1.3.1 — self-contained content)
 * FIX: Tags use <ul>/<li> (WCAG 1.3.1)
 * FIX: Video gets tabIndex=-1 + disablePictureInPicture (WCAG 1.2.2)
 * FIX: Link has aria-label with project title (WCAG 2.4.4)
 * FIX: focus-visible on link (WCAG 2.4.7)
 */
/* ── Desktop card illustrations — no SVG filters for Safari ─────────────── */
const DESKTOP_ILLUSTRATIONS: Record<number, React.ReactNode> = {
  0: ( // CityLoop — radar rings
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.55 }}>
      {[120, 220, 330, 460, 600, 760, 930].map((r, ri) => (
        <circle key={ri} cx="1100" cy="240" r={r} fill="none"
          stroke={ri % 2 === 0 ? '#D95F30' : 'rgba(215,223,216,0.7)'}
          strokeWidth={ri % 2 === 0 ? '2' : '0.8'} />
      ))}
      <circle cx="1100" cy="240" r="12" fill="#D95F30" />
      <line x1="1100" y1="240" x2="1100" y2="-600" stroke="#D95F30" strokeWidth="1.5" opacity="0.5" />
      <line x1="1100" y1="240" x2="1800" y2="800" stroke="rgba(215,223,216,0.4)" strokeWidth="1" />
    </svg>
  ),
  1: ( // MyTown — city grid
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.5 }}>
      {[0,1,2,3,4,5,6,7,8,9].map(col => <line key={`v${col}`} x1={col * 160} y1="0" x2={col * 160} y2="900" stroke="#FF844B" strokeWidth="0.7" opacity="0.5" />)}
      {[0,1,2,3,4,5,6,7,8,9].map(row => <line key={`h${row}`} x1="0" y1={row * 100} x2="1440" y2={row * 100} stroke="#55A6EC" strokeWidth="0.7" opacity="0.45" />)}
      <rect x="780" y="400" width="60" height="400" fill="#FF844B" opacity="0.28" />
      <rect x="860" y="310" width="80" height="490" fill="#FF844B" opacity="0.35" rx="2" />
      <rect x="960" y="360" width="56" height="440" fill="#FF844B" opacity="0.22" />
      <rect x="1030" y="450" width="56" height="350" fill="#55A6EC" opacity="0.22" />
      <polyline points="900,310 900,240 874,262 900,232 926,262 900,240" stroke="#FF844B" strokeWidth="4" fill="none" opacity="0.8" />
    </svg>
  ),
  2: ( // PlayPal — basketball court
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.55 }}>
      <rect x="700" y="60" width="640" height="780" fill="none" stroke="#2978FF" strokeWidth="2" opacity="0.7" rx="4" />
      <line x1="700" y1="450" x2="1340" y2="450" stroke="#2978FF" strokeWidth="1.5" opacity="0.6" />
      <circle cx="1020" cy="450" r="110" fill="none" stroke="#2978FF" strokeWidth="2.5" opacity="0.8" />
      <circle cx="1020" cy="450" r="14" fill="#FFC107" opacity="0.9" />
      <path d="M 740 60 A 260 260 0 0 1 1300 60" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
      <path d="M 740 840 A 260 260 0 0 0 1300 840" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
      <rect x="860" y="60" width="320" height="240" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
      <rect x="860" y="600" width="320" height="240" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
      <circle cx="1020" cy="230" r="90" fill="none" stroke="#2978FF" strokeWidth="2.5" opacity="0.9" />
    </svg>
  ),
  3: ( // Noise — waveform
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.55 }}>
      <line x1="700" y1="450" x2="1380" y2="450" stroke="#E8B84B" strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 60 }).map((_, idx) => {
        const x = 720 + idx * 11
        const h = 10 + Math.abs(Math.sin(idx * 0.7 + 1.2) * 160 + Math.sin(idx * 1.5) * 80)
        return <rect key={idx} x={x} y={450 - h / 2} width="5" height={h} fill={idx % 4 === 0 ? '#E8B84B' : 'rgba(232,184,75,0.30)'} rx="2" />
      })}
      {Array.from({ length: 60 }).map((_, idx) => {
        const x = 720 + idx * 11
        const h = 6 + Math.abs(Math.sin(idx * 1.1 + 2.5) * 60)
        return <rect key={`b${idx}`} x={x} y={260 - h / 2} width="5" height={h} fill="rgba(232,184,75,0.18)" rx="1" />
      })}
      {Array.from({ length: 60 }).map((_, idx) => {
        const x = 720 + idx * 11
        const h = 6 + Math.abs(Math.sin(idx * 0.9 + 0.5) * 100 + Math.sin(idx * 2.1) * 50)
        return <rect key={`c${idx}`} x={x} y={640 - h / 2} width="5" height={h} fill="rgba(232,184,75,0.22)" rx="1" />
      })}
    </svg>
  ),
  5: ( // EEG ADHD — brainwave / neural
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.55 }}>
      {[0,1,2,3,4,5,6,7,8].map(col => <line key={`bv${col}`} x1={col * 180} y1="0" x2={col * 180} y2="900" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />)}
      {[0,1,2,3,4,5,6,7,8,9].map(row => <line key={`bh${row}`} x1="0" y1={row * 100} x2="1440" y2={row * 100} stroke="#7c3aed" strokeWidth="0.6" opacity="0.25" />)}
      {/* EEG waveform — main */}
      <polyline points="580,450 650,450 700,450 740,290 780,610 818,340 855,475 900,450 960,450 1020,450 1068,450 1108,295 1148,605 1186,338 1222,468 1270,450 1340,450" stroke="#8B5CF6" strokeWidth="3.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      {/* Secondary quieter wave */}
      <polyline points="580,250 650,250 700,250 736,218 765,282 793,234 820,254 860,250 960,250 1020,250 1068,250 1104,222 1134,278 1162,232 1190,254 1270,250 1340,250" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
      {/* Third wave */}
      <polyline points="580,650 650,650 700,650 736,620 762,680 788,636 814,656 860,650 960,650 1020,650 1068,650 1104,620 1130,680 1156,634 1182,654 1270,650 1340,650" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.45" />
      {/* Accuracy badge dot */}
      <circle cx="780" cy="610" r="8" fill="#10B981" opacity="0.9" />
    </svg>
  ),
  4: ( // Talos — ECG
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.55 }}>
      {[0,1,2,3,4,5,6,7,8].map(col => <line key={`tv${col}`} x1={col * 180} y1="0" x2={col * 180} y2="900" stroke="#386641" strokeWidth="0.6" opacity="0.35" />)}
      {[0,1,2,3,4,5,6,7,8,9].map(row => <line key={`th${row}`} x1="0" y1={row * 100} x2="1440" y2={row * 100} stroke="#5B9B43" strokeWidth="0.6" opacity="0.25" />)}
      <polyline points="600,450 700,450 760,450 820,340 878,580 934,400 980,460 1040,450 1140,450 1200,450 1260,450 1318,345 1374,570 1420,415 1440,452" stroke="#5B9B43" strokeWidth="3.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <polyline points="600,270 700,270 760,270 820,230 876,310 930,248 984,272 1040,270 1140,270 1200,270 1260,270 1318,230 1374,310 1420,248 1440,270" stroke="#386641" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
      <circle cx="1020" cy="450" r="10" fill="#A7C957" opacity="0.9" />
    </svg>
  ),
}

const ProjectCard = ({ index, title, desc, tags, accentColor, pageNum, showLabel, href, bgGradient, surfaceColor, borderColor }: {
  index: number, title: string, desc: string, tags: string[], accentColor: string,
  pageNum: string, showLabel: boolean, href: string, bgGradient: string,
  videoSrc?: string, surfaceColor: string, borderColor: string
}) => (
  <article className="project-card w-screen h-full relative overflow-hidden flex flex-col justify-end p-6 md:p-16 group" aria-label={`Project: ${title}`}>
    {showLabel && <div className="absolute top-10 left-10 text-[10px] uppercase font-mono italic text-[#ff4d00] tracking-widest z-10" aria-hidden="true">/ STUFF I BUILT / {pageNum}</div>}
    <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 text-[22vw] font-black leading-none select-none pointer-events-none z-0 opacity-[0.04]" style={{ color: 'gray', fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">0{index + 1}</div>

    <div className="absolute inset-0" style={{ background: bgGradient, opacity: 0.70 }} aria-hidden="true" />
    {DESKTOP_ILLUSTRATIONS[index]}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 20%, rgba(5,5,5,0.68) 50%, rgba(5,5,5,0.12) 100%)' }} aria-hidden="true" />

    {/* Content — left-aligned text block, max half width on desktop so button has room */}
    <div className="relative z-10 max-w-xl flex flex-col">
      <div className="flex items-center gap-4 mb-4" aria-hidden="true">
        <div className="w-5 h-[1px] bg-[#ff4d00]" />
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ff4d00]">Project 0{index + 1}</span>
      </div>
      <h2 className="text-[7vw] md:text-[5vw] font-black uppercase tracking-tight mb-3 leading-[0.92]" style={{ color: accentColor }}>{title}</h2>
      <p className="font-mono text-xs md:text-sm mb-4 leading-relaxed" style={{ color: 'rgba(230,226,211,0.88)' }}>{desc}</p>

      {/* Tags — mobile only inline with button below; desktop just tags, button is absolute */}
      <div className="flex flex-col gap-4">
        <ul className="flex flex-wrap gap-2" aria-label="Project tags">
          {tags.map(tag => (
            <li key={tag} className="px-2 py-1 border text-[8px] md:text-[9px] font-bold uppercase font-mono tracking-widest" style={{ borderColor, color: 'rgba(230,226,211,0.65)' }}>{tag}</li>
          ))}
        </ul>
        {/* Mobile-only inline button — hidden on desktop */}
        <Link
          href={href}
          className="md:hidden flex items-center gap-3 z-20 group/link rounded-full self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00]"
          aria-label={`View project: ${title}`}
        >
          <div className="w-9 h-9 rounded-full border border-[#ff4d00] flex items-center justify-center group-hover/link:bg-[#ff4d00] transition-colors duration-200" aria-hidden="true">
            <span className="text-[#ff4d00] group-hover/link:text-black text-sm transition-colors duration-200" aria-hidden="true">→</span>
          </div>
          <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-[0.2em] whitespace-nowrap">View Project</span>
        </Link>
      </div>
    </div>

    {/* Desktop-only button — absolute bottom-right, exactly like the original design */}
    <Link
      href={href}
      className="hidden md:flex absolute bottom-12 right-12 items-center gap-3 z-20 group/link rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00]"
      aria-label={`View project: ${title}`}
    >
      <div className="w-10 h-10 rounded-full border border-[#ff4d00] flex items-center justify-center group-hover/link:bg-[#ff4d00] transition-colors duration-200" aria-hidden="true">
        <span className="text-[#ff4d00] group-hover/link:text-black text-sm transition-colors duration-200" aria-hidden="true">→</span>
      </div>
      <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-[0.2em]">View Project</span>
    </Link>
  </article>
)

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function Home() {
  const container = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  // Set isMobile after mount (useEffect is client-only — safe for SSR/hydration)
  // Also handles orientation changes
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check() // run immediately on mount
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])
  const [mobileScrolled, setMobileScrolled] = useState(false)
  const [reduced, setReduced] = useState(false)
  
  // Navigation State from page (2).tsx
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('main-content')
  
  const { theme, toggle } = useTheme()
  const c = T[theme]

  // Fix: seed activeSection from URL hash on first paint so the correct
  // nav link is highlighted immediately, before the user scrolls.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const valid = ['main-content', 'manifesto', 'about-skills', 'projects', 'about', 'contact']
    if (hash && valid.includes(hash)) setActiveSection(hash)
  }, [])

  // Detect reduced-motion (client-side only to avoid SSR mismatch)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Mobile scroll listener
  useEffect(() => {
    const h = () => setMobileScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Scrollspy — highlights the active nav link based on visible section
  useEffect(() => {
    const ids = ['main-content', 'manifesto', 'about-skills', 'projects', 'about', 'contact']
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.1 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lightweight CSS parallax for hero on mobile — rAF-throttled to prevent layout thrash on Safari
  useEffect(() => {
    if (!isMobile || reduced) return
    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        const garv  = document.querySelector<HTMLElement>('.hero-garv')
        const malik = document.querySelector<HTMLElement>('.hero-malik')
        if (garv)  garv.style.transform  = `translateY(${y * -0.18}px)`
        if (malik) malik.style.transform = `translateY(${y * -0.10}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isMobile, reduced])

  // GSAP scroll animations
  useGSAP(() => {
    // Kill all existing ScrollTriggers before re-registering — prevents
    // the horizontal trigger from competing with native mobile scroll
    // during the isMobile state flip after hydration.
    ScrollTrigger.getAll().forEach(t => t.kill())

    if (reduced) {
      gsap.set(['.layered-top', '.layered-bottom', '.intro-label', '.quote-line', '.manifesto-sub', '.split-header', '.split-item', '.now-item', '.footer-email'], { clearProps: 'all' })
      return
    }

    // ── Hero entrance — same on all devices ──
    gsap.fromTo('.layered-top',    { yPercent: 105 }, { yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'power4.out', delay: 0.3 })
    gsap.fromTo('.layered-bottom', { opacity: 0 },    { opacity: 1,  duration: 1.4, stagger: 0.06, ease: 'power4.out', delay: 0.3 })
    gsap.fromTo('.intro-label',    { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 1.2, ease: 'power2.out' })

    if (!isMobile) {
      // ── DESKTOP: full scrub parallax + pinning ──
      const heroTrigger = { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-garv',  { y: -420, ease: 'none', scrollTrigger: heroTrigger })
      gsap.to('.hero-malik', { y: -240, ease: 'none', scrollTrigger: heroTrigger })

      // Manifesto: pinned reveal with scrub
      const mTl = gsap.timeline({ scrollTrigger: { trigger: '.manifesto-section', pin: true, start: 'top top', end: '+=160%', scrub: 1.2 } })
      mTl.to('.quote-line', { y: '0%', stagger: 0.4, ease: 'power3.out', duration: 1 })
         .to('.manifesto-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')

      // Split section: scrub reveal
      const sTl = gsap.timeline({ scrollTrigger: { trigger: '.split-section', start: 'top 65%', end: 'bottom 85%', scrub: 1 } })
      sTl.to('.center-line', { height: '100%', ease: 'none', duration: 2 })
         .to('.split-header', { opacity: 1, y: 0, stagger: 0.15, duration: 1 }, '<0.3')
         .to('.split-item',   { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 }, '<0.4')
    } else {
      // ── MOBILE: trigger-based animations — NO scrub, NO pin on manifesto/split ──

      // Manifesto: lines stagger in when section enters viewport, one-shot
      gsap.fromTo('.quote-line',
        { y: '100%' },
        { y: '0%', stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto-section', start: 'top 75%', once: true } }
      )
      gsap.fromTo('.manifesto-sub',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5,
          scrollTrigger: { trigger: '.manifesto-section', start: 'top 75%', once: true } }
      )

      // Split section: simple stagger fade-up, no scrub
      gsap.fromTo('.center-line',
        { height: '0%' },
        { height: '100%', duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.split-section', start: 'top 70%', once: true } }
      )
      gsap.fromTo('.split-header',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.split-section', start: 'top 70%', once: true } }
      )
      gsap.fromTo('.split-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: '.split-section', start: 'top 70%', once: true } }
      )
    }

    // ── Horizontal cards — desktop only, mobile uses vertical stack ──
    if (!isMobile) {
      const cards = gsap.utils.toArray<HTMLElement>('.project-card')
      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '.horizontal-section',
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / (cards.length - 1), duration: { min: 0.2, max: 0.4 }, ease: 'power2.inOut' },
          end: () => '+=' + (window.innerWidth * (cards.length - 0.5)),
        }
      })
    }

    // ── Shared trigger-based animations — same on all devices ──
    gsap.fromTo('.now-item',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.now-section', start: 'top 70%', once: true } }
    )
    gsap.fromTo('.footer-email',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-section', start: 'top 80%', once: true } }
    )
  }, { scope: container, dependencies: [isMobile] })

  const MARQUEE_ITEMS = ['UX/UI Designer', 'Open to Work', 'Tampere, Finland', 'Interaction Design', 'User Research', 'Figma', 'Design Systems', 'Prototyping']
  const projects = [
    {
      title: 'CityLoop Discovery',
      desc: 'How do you help someone decide what to do when they don\'t know what they want? CityLoop surfaces local places and events based on mood, weather, and time of day.',
      tags: ['UX/UI Design', 'Figma', 'UX Research', 'Prototyping'],
      accentColor: '#D95F30',   // CityLoop terracotta
      pageNum: 'P. 004', showLabel: true, href: '/projects/cityloop',
      bgGradient: 'radial-gradient(ellipse at 30% 60%, #3d1a0e 0%, #1a0a05 40%, transparent 70%), radial-gradient(ellipse at 70% 30%, #2a1208 0%, transparent 60%)',
      videoSrc: '',
    },
    {
      title: 'MyTown Relocation',
      desc: 'Moving to a new country is overwhelming. MyTown guides international students through their first weeks in Finland — step by step.',
      tags: ['Product Design', 'Service Concept', 'Figma', 'Research'],
      accentColor: '#FF844B',   // MyTown orange
      pageNum: 'P. 005', showLabel: false, href: '/projects/mytown',
      bgGradient: 'radial-gradient(ellipse at 20% 70%, #2a1e18 0%, #1a1208 40%, transparent 70%), radial-gradient(ellipse at 75% 25%, #1e2535 0%, transparent 60%)',
      videoSrc: '',
    },
    {
      title: 'PlayPal Community',
      desc: 'Finding someone to play sports with is harder than it should be. PlayPal connects people by sport, skill level, and location.',
      tags: ['Design System', 'Interaction', 'Figma', 'Motion'],
      accentColor: '#2978FF',   // PlayPal blue
      pageNum: 'P. 006', showLabel: false, href: '/projects/playpal',
      bgGradient: 'radial-gradient(ellipse at 25% 65%, #0a1530 0%, #050c1e 40%, transparent 70%), radial-gradient(ellipse at 70% 25%, #0d1828 0%, transparent 60%)',
      videoSrc: '',
    },
    {
      title: 'Noise & Reaction',
      desc: 'Does environmental noise slow people down? We ran a controlled experiment across 3 noise conditions — and found the answer is more nuanced than expected.',
      tags: ['Experimental Research', 'ANOVA', 'E-Prime', 'SPSS'],
      accentColor: '#E8B84B',   // Amber — research/academic
      pageNum: 'P. 007', showLabel: false, href: '/projects/noise-experiment',
      bgGradient: 'radial-gradient(ellipse at 30% 60%, #1e1500 0%, #0c0b08 40%, transparent 70%), radial-gradient(ellipse at 70% 30%, #0a0e1a 0%, transparent 60%)',
      videoSrc: '',
    },
    {
      title: 'Talos Care',
      desc: 'Patients lie to their doctors out of shame. Talos is a conversational AI pre-screening agent that uses the Automaton Effect to help them disclose sensitive symptoms safely.',
      tags: ['Conversational UX', 'Voice Design', 'AI Integration', 'Accessibility'],
      accentColor: '#5B9B43',   // Talos sage green
      pageNum: 'P. 008', showLabel: false, href: '/projects/talos',
      bgGradient: 'radial-gradient(ellipse at 25% 65%, #061208 0%, #030805 40%, transparent 70%), radial-gradient(ellipse at 72% 28%, #081a0a 0%, transparent 60%)',
      videoSrc: '',
    },
    {
      title: 'EEG ADHD Thesis',
      desc: 'Can a machine read a child\'s brainwaves and detect ADHD? A full ML pipeline on 19-channel EEG from 121 children — CNN reached 98.53% accuracy. B.Tech final thesis.',
      tags: ['Machine Learning', 'CNN', 'EEG Signal Processing', 'Python', 'Research'],
      accentColor: '#8B5CF6',   // violet — neuro/brain
      pageNum: 'P. 009', showLabel: false, href: '/projects/eeg-adhd',
      bgGradient: 'radial-gradient(ellipse at 22% 60%, #0d0818 0%, #060410 40%, transparent 70%), radial-gradient(ellipse at 75% 28%, #10082a 0%, transparent 60%)',
      videoSrc: '',
    },
  ]

  return (
    <main ref={container} className="overflow-x-hidden selection:bg-[#ff4d00] selection:text-black transition-colors duration-300" style={{ background: c.bg, color: c.text }}>
      {/* WCAG 2.4.1 Bypass Blocks — skip link */}
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[99999] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-[#ff4d00] focus-visible:text-black focus-visible:font-mono focus-visible:text-sm focus-visible:uppercase focus-visible:tracking-widest focus-visible:rounded">
        Skip to main content
      </a>

      <ThemeToggle theme={theme} toggle={toggle} bg={c.toggleBg} fg={c.toggleFg} />

      {/* ── NAVIGATION ──────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-8 transition-colors duration-300"
        aria-label="Site navigation"
        style={{
          background: c.navBg,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${c.border}`,
          height: '52px',
        }}
      >
        {/* Logo / name */}
        <a
          href="#main-content"
          onClick={e => { e.preventDefault(); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="intro-label opacity-0 text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00] rounded"
          aria-label="Garv Malik — scroll to top"
        >
          / Garv Malik
        </a>

        {/* Centre nav links — desktop only */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home',   id: 'main-content' },
            { label: 'Approach', id: 'about-skills' },
            { label: 'Work',     id: 'projects'    },
            { label: 'About',    id: 'about'        },
            { label: 'Contact',  id: 'contact'      },
          ].map(({ label, id }) => {
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="relative px-3 py-1 text-[10px] uppercase font-mono tracking-[0.25em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
                style={{ color: isActive ? c.accentText : c.textMuted }}
                aria-current={isActive ? 'true' : undefined}
              >
                {label}
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff4d00]"
                    aria-hidden="true"
                  />
                )}
              </a>
            )
          })}
        </div>

        {/* Right side: year + mobile menu toggle */}
        <div className="flex items-center gap-4">
          <span className="intro-label opacity-0 text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hidden md:inline" aria-hidden="true">
            2026
          </span>

          {/* Mobile hamburger — gap-1.5 = 6px between 1.5px lines.
               X requires translateY of 7.5px (line height + gap). */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{
                background: '#ff4d00',
                transform: menuOpen ? 'translateY(7.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: '#ff4d00',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'none',
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{
                background: '#ff4d00',
                transform: menuOpen ? 'translateY(-7.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu overlay */}
      <div
        className="md:hidden fixed inset-0 z-[49] flex flex-col justify-center items-start px-8 transition-all duration-300"
        style={{
          background: c.navBg,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transform: menuOpen ? 'none' : 'translateY(-8px)',
        }}
        aria-hidden={!menuOpen}
      >
        {[
          { label: 'Home',    id: 'main-content' },
          { label: 'Approach', id: 'about-skills' },
          { label: 'Work',    id: 'projects'     },
          { label: 'About',   id: 'about'        },
          { label: 'Contact', id: 'contact'      },
        ].map(({ label, id }, idx) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={e => {
              e.preventDefault()
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              setMenuOpen(false)
            }}
            className="text-[11vw] font-black uppercase tracking-tight leading-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff4d00] rounded"
            style={{
              color: activeSection === id ? '#ff4d00' : c.text,
              transitionDelay: menuOpen ? `${idx * 40}ms` : '0ms',
            }}
          >
            {label}
          </a>
        ))}
        <div className="mt-10 flex gap-6">
          {[
            { label: 'Github',   href: 'https://github.com/garvmalik' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/thegarvmalik' },
            { label: 'Behance',  href: 'https://www.behance.net/garvmalik' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} — opens in a new tab`}
              className="text-[9px] font-mono uppercase tracking-[0.25em] hover:text-[#ff4d00] transition-colors duration-200"
              style={{ color: c.textMuted }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div
        className={`md:hidden fixed z-40 left-0 right-0 flex items-center px-6 pointer-events-none transition-colors duration-300`}
        style={{
          bottom: mobileScrolled ? 'auto' : '2rem',
          top:    mobileScrolled ? '0'    : 'auto',
          opacity: mobileScrolled ? 1 : 0,
          paddingTop:    mobileScrolled ? '0.75rem' : '0',
          paddingBottom: mobileScrolled ? '0.75rem' : '0',
          background:       mobileScrolled ? c.navBg        : 'transparent',
          borderBottom:     mobileScrolled ? `1px solid ${c.border}` : 'none',
          transition: 'top 0.45s ease, bottom 0.45s ease, padding 0.45s ease, background 0.45s ease',
        }}
        aria-hidden="true"
      >
        <span
          style={{
            color: c.text,
            fontSize: mobileScrolled ? '4.5vw' : '8vw',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            transition: 'font-size 0.45s ease, color 0.3s ease',
          }}
        >
          GARV <span style={{ color: '#ff4d00' }}>MALIK</span>
        </span>
      </div>

     {/* ── HERO ── */}
      <section id="main-content" className="hero-section relative h-screen flex flex-col justify-end pb-[12vh] md:justify-center md:pb-0 px-6 md:px-16 overflow-hidden transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg }} aria-label="Hero Garv Malik, UX UI Designer">
        
        {/* Hero background — concentric arcs + SVG gradients. No filters (Safari-safe). */}
        <svg
          className="hero-bg absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ opacity: theme === 'dark' ? 0.75 : 0.50 }}
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Warm radial glow from bottom-left — gradient, not filter */}
            <radialGradient id="cornerGlow" cx="0" cy="900" r="1300" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#ff4d00" stopOpacity={theme === 'dark' ? '0.22' : '0.14'} />
              <stop offset="45%"  stopColor="#ff4d00" stopOpacity={theme === 'dark' ? '0.06' : '0.03'} />
              <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
            </radialGradient>
            {/* Cool violet accent top-right */}
            <radialGradient id="topGlow" cx="1440" cy="0" r="820" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#8B5CF6" stopOpacity={theme === 'dark' ? '0.10' : '0.06'} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Gradient glow layers */}
          <rect width="1440" height="900" fill="url(#cornerGlow)" />
          <rect width="1440" height="900" fill="url(#topGlow)" />

          {/* Concentric arcs radiating from bottom-left corner */}
          {[300, 500, 700, 900, 1100, 1300, 1500, 1700, 1920].map((r, i) => (
            <circle key={`arc-${i}`} cx="-60" cy="960" r={r} fill="none"
              stroke={theme === 'dark' ? 'rgba(180,200,220,0.10)' : 'rgba(30,60,100,0.08)'}
              strokeWidth={i === 3 || i === 6 ? 1.4 : 0.7}
            />
          ))}
          {/* Orange accent arcs — every other ring */}
          {[600, 1100, 1600].map((r, i) => (
            <circle key={`oa-${i}`} cx="-60" cy="960" r={r} fill="none"
              stroke={theme === 'dark' ? 'rgba(255,77,0,0.16)' : 'rgba(255,77,0,0.11)'}
              strokeWidth="1.0"
            />
          ))}

          {/* Subtle verticals for rhythm */}
          {[480, 960, 1200].map((x, i) => (
            <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="900"
              stroke={theme === 'dark' ? 'rgba(180,200,220,0.05)' : 'rgba(30,60,100,0.04)'}
              strokeWidth="0.7"
            />
          ))}

          {/* Horizon accent line */}
          <line x1="0" y1="520" x2="1440" y2="520"
            stroke={theme === 'dark' ? 'rgba(255,77,0,0.09)' : 'rgba(255,77,0,0.06)'}
            strokeWidth="0.9"
          />
        </svg>

        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: c.border }} aria-hidden="true" />
        <div className="intro-label opacity-0 absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Home / P. 001</div>
        <h1 className="sr-only">Garv Malik — UX/UI Designer specialising in research-led, accessible digital products. Based in Tampere, Finland.</h1>


        {/* Stacked name */}
        <div className="hero-name-wrap flex flex-col items-start gap-0 relative z-10 w-full" aria-hidden="true">
          <div className="hero-garv">
            <LayeredText text="GARV"  className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color={c.text} />
          </div>
          <div className="hero-malik">
            <LayeredText text="MALIK" className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color="#ff4d00" />
          </div>
        </div>

        {/* Role + tagline line */}
        <div className="intro-label opacity-0 relative z-10 flex flex-wrap items-center gap-3 mt-5 mb-1">
          <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>UX/UI Designer</span>
          <span className="text-[#ff4d00] opacity-50" aria-hidden="true">·</span>
          <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>Research-led products</span>
          <span className="text-[#ff4d00] opacity-50" aria-hidden="true">·</span>
          <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.28em]" style={{ color: c.textMuted }}>Tampere, Finland</span>
        </div>

        {/* Hero CTAs */}
        <div className="intro-label opacity-0 relative z-10 flex flex-wrap items-center gap-4 mt-5 mb-2">
          <a
            href="mailto:thegarvmalik@gmail.com"
            data-cursor-hover
            className="inline-flex items-center gap-2 px-5 py-2.5 border text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-[#ff4d00] hover:text-black transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded-sm"
            style={{ borderColor: c.accentText, color: c.accentText }}
            aria-label="Send email to Garv Malik"
          >
            Hire me →
          </a>
          <a
            href="/garv-malik-cv.pdf"
            download
            data-cursor-hover
            className="inline-flex items-center gap-2 px-5 py-2.5 border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-[#ff4d00] hover:text-[#ff4d00] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded-sm"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}
            aria-label="Download Garv Malik CV PDF"
          >
            Download CV ↓
          </a>
        </div>

        <div className="intro-label opacity-0 absolute bottom-0 left-0 right-0 border-t" style={{ borderColor: c.border }}>
          <Marquee items={MARQUEE_ITEMS} speed={35} textColor={c.textMuted} />
        </div>
        <div className="intro-label opacity-0 absolute bottom-16 left-6 md:left-16 flex items-center gap-3" aria-hidden="true">
          <div className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: c.border }}>
            <span className="text-[8px]" style={{ color: c.textFaint }}>↓</span>
          </div>
          <span className="text-[9px] uppercase font-mono tracking-[0.3em] hidden md:inline" style={{ color: c.textFaint }}>Scroll</span>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section id="manifesto" className="manifesto-section relative h-screen flex flex-col justify-center px-6 md:px-16 transition-colors duration-300" style={{ background: c.bg }} aria-label="Design philosophy">
        {/* Issue 1 fix: top-16 clears the fixed nav bar (~60px) */}
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Manifesto / P. 002</div>
        {/* Issue 4 fix:
            - Font switched to Bebas Neue (heading font) — eliminates JetBrains Mono
              monospace wide-spacing that made words look broken/gapped
            - tracking-normal instead of tracking-tighter — Bebas already has tight spacing
            - indent lines use pl-[8%] on the line's own div, not ml-% which was
              misaligning when combined with the overflow-hidden clip
            - Reduced gap between lines for denser, designed look
        */}
        <blockquote className="w-full max-w-7xl flex flex-col gap-0 pt-16">
          {[
            { text: 'Good design is not',        indent: false, col: c.text    },
            { text: 'what you see first.',        indent: false,  col: c.text    },
            { text: "It's what you don't notice", indent: false, col: c.text    },
            { text: 'while everything just works.', indent: false, col: '#ff4d00' },
          ].map((line, i) => (
            <div
              key={i}
              className={`overflow-hidden leading-none ${line.indent ? 'pl-[8%] md:pl-[10%]' : ''}`}
            >
              <p
                className="quote-line translate-y-full uppercase leading-[0.92] text-[10vw] md:text-[8vw]"
                style={{
                  color: line.col,
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: '0.01em',
                  fontWeight: 400,
                }}
              >
                {line.text}
              </p>
            </div>
          ))}
          <div className="overflow-hidden mt-8 ml-auto">
            <p className="manifesto-sub opacity-0 translate-y-4 text-[9px] font-mono uppercase tracking-[0.3em] text-right max-w-xs leading-loose" style={{ color: c.textMuted }}>
              — A belief in invisible craft.<br />In clarity over complexity. In design that earns trust.
            </p>
          </div>
        </blockquote>
      </section>

      {/* ── SPLIT — What I Build / What Moves Me ── */}
      <section id="about-skills" className="split-section relative min-h-screen w-full border-t flex flex-col md:flex-row px-6 md:px-16 py-28 md:py-36 gap-16 md:gap-0 transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="Skills and values">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Who Am I / P. 003</div>
        <div className="center-line absolute left-1/2 top-0 w-[1px] h-0 -translate-x-1/2 hidden md:block" style={{ background: 'rgba(255,77,0,0.22)' }} aria-hidden="true" />
        <div className="w-full md:w-1/2 md:pr-20 flex flex-col justify-center pt-16 md:pt-0">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">What I Do</p>
          <h2 className="split-header opacity-0 translate-y-6 text-6xl md:text-7xl font-black uppercase leading-[0.88] mb-10 tracking-tight" style={{ color: c.text }}>What<br />I Build</h2>
          <dl className="flex flex-col">
            <ListRow label="Design"  value="UX/UI · Design Systems"      borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Process" value="User Flows · Prototyping"     borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Tools"   value="Figma · Miro · Mural"         borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Research" value="Interviews · Testing · Affinity Mapping" borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
          </dl>
        </div>
        <div className="w-full md:w-1/2 md:pl-20 flex flex-col justify-center">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">What Drives Me</p>
          <h2 className="split-header opacity-0 translate-y-6 text-6xl md:text-7xl font-black uppercase leading-[0.88] mb-10 tracking-tight" style={{ color: c.text }}>What<br />Moves Me</h2>
          <dl className="flex flex-col">
            <ListRow label="Principle"     value="Human-centered clarity"        borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Interest"      value="Emotional interaction"          borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Curious about" value="Behavior and research"          borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Goal"          value="Interfaces that feel intuitive" borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
          </dl>
        </div>
      </section>

      <div className="w-full bg-[#ff4d00] py-3 overflow-hidden" aria-hidden="true">
        <Marquee items={['5 Projects', 'Research-Led Design', 'Figma', 'Tampere, Finland', '2024–2026', 'UX/UI Design']} speed={60} reverse textColor="rgba(255,255,255,0.88)" />
      </div>

      {/* ── PROJECTS ── */}
      {isMobile ? (
        <div id="projects" className="flex flex-col scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects">
          {projects.map((p, i) => (
            <div key={i} className="relative w-full overflow-hidden flex flex-col justify-end p-6 border-b" style={{ minHeight: '85vh', borderColor: c.border, background: theme === 'light' ? '#f5f2ec' : '#050505' }}>

              {/* Progress indicator — top right */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5" aria-label={`Project ${i + 1} of ${projects.length}`}>
                {projects.map((_, di) => (
                  <div
                    key={di}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:   di === i ? '16px' : '5px',
                      height:  '5px',
                      background: di === i ? p.accentColor : (theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)'),
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Base brand gradient — dark theme: rich dark; light theme: soft tinted wash */}
              <div className="absolute inset-0" style={{
                background: p.bgGradient,
                opacity: theme === 'dark' ? 0.95 : 0.12
              }} aria-hidden="true" />

              {/* Per-project decorative SVG pattern — unique to each brand */}
              {i === 0 && (
                // CityLoop — concentric circles / radar motif — no SVG filters (Safari perf)
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  {[40, 90, 140, 195, 255, 320, 390].map((r, ri) => (
                    <circle key={ri} cx="310" cy="160" r={r} fill="none"
                      stroke={ri % 2 === 0 ? '#D95F30' : '#D7DFD8'}
                      strokeWidth={ri % 2 === 0 ? '2.5' : '1'}
                    />
                  ))}
                  <circle cx="310" cy="160" r="10" fill="#D95F30" />
                  <line x1="310" y1="160" x2="310" y2="-230" stroke="#D95F30" strokeWidth="2" opacity="0.6" />
                  <line x1="310" y1="160" x2="650" y2="450" stroke="#D7DFD8" strokeWidth="1" opacity="0.4" />
                </svg>
              )}

              {i === 1 && (
                // MyTown — city grid + building silhouettes — no SVG filters
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  {[0,1,2,3,4,5,6].map(col => (
                    <line key={`v${col}`} x1={col * 65} y1="0" x2={col * 65} y2="700" stroke="#FF844B" strokeWidth="0.8" opacity="0.5" />
                  ))}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(row => (
                    <line key={`h${row}`} x1="0" y1={row * 70} x2="390" y2={row * 70} stroke="#55A6EC" strokeWidth="0.8" opacity="0.5" />
                  ))}
                  <rect x="240" y="380" width="30" height="200" fill="#FF844B" opacity="0.30" />
                  <rect x="278" y="310" width="40" height="270" fill="#FF844B" opacity="0.40" rx="1" />
                  <rect x="326" y="350" width="28" height="230" fill="#FF844B" opacity="0.25" />
                  <rect x="362" y="420" width="28" height="160" fill="#55A6EC" opacity="0.25" />
                  <polyline points="298,310 298,255 285,272 298,252 311,272 298,255" stroke="#FF844B" strokeWidth="3" fill="none" opacity="0.85" />
                </svg>
              )}

              {i === 2 && (
                // PlayPal — basketball court — no SVG filters
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  <rect x="30" y="80" width="330" height="540" fill="none" stroke="#2978FF" strokeWidth="2" opacity="0.7" rx="4" />
                  <line x1="30" y1="350" x2="360" y2="350" stroke="#2978FF" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="195" cy="350" r="55" fill="none" stroke="#2978FF" strokeWidth="2.5" opacity="0.8" />
                  <circle cx="195" cy="350" r="8" fill="#FFC107" opacity="0.9" />
                  <path d="M 60 80 A 135 135 0 0 1 330 80" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
                  <path d="M 60 620 A 135 135 0 0 0 330 620" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
                  <rect x="130" y="80" width="130" height="140" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
                  <rect x="130" y="480" width="130" height="140" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
                  <circle cx="195" cy="180" r="45" fill="none" stroke="#2978FF" strokeWidth="2.5" opacity="0.9" />
                  <line x1="195" y1="135" x2="195" y2="225" stroke="#2978FF" strokeWidth="2" opacity="0.7" />
                  <line x1="150" y1="180" x2="240" y2="180" stroke="#2978FF" strokeWidth="2" opacity="0.7" />
                  <path d="M 165 140 Q 195 162 165 220" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.7" />
                  <path d="M 225 140 Q 195 162 225 220" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.7" />
                  <line x1="30" y1="638" x2="360" y2="638" stroke="#FFC107" strokeWidth="4" opacity="0.7" />
                </svg>
              )}

              {i === 3 && (
                // Noise & Reaction — waveform / soundwave pattern — no SVG filters
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  {/* Horizontal axis */}
                  <line x1="20" y1="350" x2="370" y2="350" stroke="#E8B84B" strokeWidth="1" opacity="0.4" />
                  {/* Waveform bars — simulated audio waveform */}
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const x = 20 + idx * 7.3
                    const h = 8 + Math.abs(Math.sin(idx * 0.7 + 1.2) * 80 + Math.sin(idx * 1.5) * 40)
                    return (
                      <rect key={idx}
                        x={x} y={350 - h / 2} width="3.5" height={h}
                        fill={idx % 4 === 0 ? '#E8B84B' : 'rgba(232,184,75,0.35)'}
                        rx="1.5"
                      />
                    )
                  })}
                  {/* Second waveform — quieter, offset */}
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const x = 20 + idx * 7.3
                    const h = 4 + Math.abs(Math.sin(idx * 1.1 + 2.5) * 30)
                    return (
                      <rect key={`b${idx}`}
                        x={x} y={210 - h / 2} width="3.5" height={h}
                        fill="rgba(232,184,75,0.2)"
                        rx="1"
                      />
                    )
                  })}
                  {/* Third waveform — high noise */}
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const x = 20 + idx * 7.3
                    const h = 4 + Math.abs(Math.sin(idx * 0.9 + 0.5) * 50 + Math.sin(idx * 2.1) * 25)
                    return (
                      <rect key={`c${idx}`}
                        x={x} y={490 - h / 2} width="3.5" height={h}
                        fill="rgba(232,184,75,0.25)"
                        rx="1"
                      />
                    )
                  })}
                  {/* dB labels */}
                  <text x="25" y="200" fontSize="9" fill="rgba(232,184,75,0.4)" fontFamily="monospace">40–60 dB</text>
                  <text x="25" y="345" fontSize="9" fill="rgba(232,184,75,0.6)" fontFamily="monospace">SILENT</text>
                  <text x="25" y="485" fontSize="9" fill="rgba(232,184,75,0.4)" fontFamily="monospace">60–80 dB</text>
                </svg>
              )}

              {i === 4 && (
                // Talos Care — ECG heartbeat + medical grid — no SVG filters
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  {[0,1,2,3,4,5,6].map(col => (
                    <line key={`tv${col}`} x1={col * 65} y1="0" x2={col * 65} y2="700" stroke="#386641" strokeWidth="0.6" opacity="0.4" />
                  ))}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(row => (
                    <line key={`th${row}`} x1="0" y1={row * 70} x2="390" y2={row * 70} stroke="#5B9B43" strokeWidth="0.6" opacity="0.3" />
                  ))}
                  <polyline
                    points="20,350 60,350 80,350 100,290 118,420 135,310 152,365 170,350 230,350 260,350 278,350 296,295 314,415 332,305 350,360 370,350"
                    stroke="#5B9B43" strokeWidth="3" fill="none"
                    strokeLinejoin="round" strokeLinecap="round" opacity="0.9"
                  />
                  <polyline
                    points="20,200 60,200 80,200 98,165 112,235 126,178 140,205 160,200 220,200 250,200 268,200 284,168 298,230 312,173 326,202 370,200"
                    stroke="#386641" strokeWidth="1.5" fill="none"
                    strokeLinejoin="round" strokeLinecap="round" opacity="0.5"
                  />
                  <rect x="175" y="480" width="40" height="12" fill="#5B9B43" opacity="0.6" rx="2" />
                  <rect x="189" y="466" width="12" height="40" fill="#5B9B43" opacity="0.6" rx="2" />
                  <circle cx="195" cy="350" r="6" fill="#A7C957" opacity="0.9" />
                </svg>
              )}

              {i === 5 && (
                // EEG ADHD — brainwave pattern — no SVG filters
                <svg className="absolute inset-0 w-full h-full pointer-events-none project-svg-illustration" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.55 }}>
                  {[0,1,2,3,4,5,6].map(col => <line key={`ev${col}`} x1={col * 65} y1="0" x2={col * 65} y2="700" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />)}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(row => <line key={`eh${row}`} x1="0" y1={row * 70} x2="390" y2={row * 70} stroke="#7c3aed" strokeWidth="0.6" opacity="0.25" />)}
                  <polyline points="20,350 60,350 90,350 118,250 148,460 174,300 198,365 230,350 270,350 300,350 320,350 344,252 364,462 384,350" stroke="#8B5CF6" strokeWidth="3.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
                  <polyline points="20,200 60,200 90,200 116,178 138,222 158,188 178,204 210,200 270,200 300,200 320,200 340,180 360,220 380,200" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
                  <polyline points="20,510 60,510 90,510 114,490 136,530 158,496 178,514 210,510 270,510 300,510 320,510 340,492 360,528 380,510" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity="0.45" />
                  <circle cx="148" cy="460" r="7" fill="#10B981" opacity="0.9" />
                </svg>
              )}

              {/* Overlay — dark mode: gradient to black; light mode: none needed (bg is already light) */}
              {theme === 'dark' && (
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(5,5,5,0.96) 30%, rgba(5,5,5,0.70) 58%, rgba(5,5,5,0.30) 100%)'
                }} aria-hidden="true" />
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-[1px] bg-[#ff4d00]" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ff4d00]">Project 0{i + 1}</span>
                </div>
                <h2 className="text-[10vw] font-black uppercase tracking-tight mb-2 leading-[0.92]" style={{ color: p.accentColor }}>{p.title}</h2>
                <p className="font-mono text-xs mb-4 leading-relaxed" style={{ color: theme === 'dark' ? 'rgba(230,226,211,0.85)' : c.textMuted }}>{p.desc}</p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map(tag => (
                    <li key={tag} className="px-2 py-1 border text-[8px] font-bold uppercase font-mono tracking-widest" style={{ borderColor: c.border, color: theme === 'dark' ? 'rgba(230,226,211,0.6)' : c.textFaint }}>{tag}</li>
                  ))}
                </ul>
                <Link href={p.href} className="inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00]" aria-label={`View project: ${p.title}`}>
                  <div className="w-9 h-9 rounded-full border border-[#ff4d00] flex items-center justify-center">
                    <span className="text-[#ff4d00] text-sm">→</span>
                  </div>
                  <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-[0.2em]">View Project</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div id="projects" className="horizontal-section flex w-[500vw] h-screen overflow-hidden scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects — scroll to explore">
          {projects.map((p, i) => <ProjectCard key={i} index={i} {...p} surfaceColor={c.surface} borderColor={c.border} />)}
        </div>
      )}

      {/* ── ABOUT ── */}
      <section id="about" className="about-section relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-28 border-t overflow-hidden transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="About Garv Malik">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ About / P. 007</div>

        {/* WHO AM I */}
        <h2 className="flex flex-col mb-8 md:mb-12 pt-16 md:pt-6" aria-label="Who am I">
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: c.text, fontFamily: "'Bebas Neue', sans-serif" }}>WHO</span>
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: '#ff4d00', fontFamily: "'Bebas Neue', sans-serif" }}>AM I</span>
        </h2>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <ul className="flex flex-col gap-4" aria-label="Credentials">
            {['M.Sc. Human-Technology Interaction — Year 1', 'Tampere University, Finland', 'UX/UI Design · Research · Accessibility'].map(item => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] flex-shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: c.textMuted }}>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <p className="text-base md:text-lg font-mono leading-relaxed" style={{ color: c.text }}>I'm Garv — a UI/UX Designer with a background in Computer Science, currently pursuing a Master's in Human-Technology Interaction at Tampere University, Finland.</p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>I enjoy designing thoughtful digital experiences that feel calm, intuitive, and accessible. My work is rooted in research, where I explore user needs through interviews, testing, and iterative design. I’ve built projects ranging from lifestyle discovery apps to student support services, always focusing on clarity and real-world impact. I care deeply about how technology fits into everyday life, and I aim to create solutions that are not just functional, but genuinely meaningful for the people who use them.</p>

            <blockquote className="border-l-2 border-[#ff4d00] pl-4">
              <p className="font-mono text-sm italic" style={{ color: c.text }}>"Good design removes itself from the conversation." — that's what I'm working towards.</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── RIGHT NOW ── */}
      <section className="now-section relative min-h-[55vh] flex flex-col justify-center px-6 md:px-16 py-24 border-t transition-colors duration-300" style={{ background: c.bg, borderColor: c.border }} aria-label="What Garv is doing right now">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Right Now / P. 008</div>
        <h2 className="now-item opacity-0 flex flex-col mb-10 md:mb-14 pt-16 md:pt-6" aria-label="Right Now">
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: c.text, fontFamily: "'Bebas Neue', sans-serif" }}>RIGHT</span>
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: '#ff4d00', fontFamily: "'Bebas Neue', sans-serif" }}>NOW</span>
        </h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 font-mono">
          {[
            { label: 'Listening', value: 'Pink Floyd\nGorillaz\nTame Impala' },
            { label: 'Reading',   value: "1984\nHarry Potter and the Chamber of Secrets" },
            { label: 'Building',  value: 'Talos - AI Medical Screen' },
            { label: 'Wearing',   value: "YSL Y" },
          ].map(({ label, value }) => (
            <div key={label} className="now-item opacity-0">
              <dt className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: c.accentText }}>{label}</dt>
              <dd className="text-sm leading-relaxed whitespace-pre-line" style={{ color: c.textMuted }}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="footer-section min-h-screen flex flex-col justify-center px-6 md:px-16 border-t relative overflow-hidden transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="Contact and social links">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Open Channel / P. 009</div>
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-[22vw] font-black leading-none select-none pointer-events-none" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }} aria-hidden="true">+</div>
        <div className="footer-email opacity-0 mt-20 mb-10">
          {/* Issue 6 fix: label bumped from text-[9px] → text-[11px] for light mode readability */}
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-6 font-bold" style={{ color: c.accentText }}>Open to UX/UI internships in Finland and Europe.</p>
          <a href="mailto:thegarvmalik@gmail.com" data-cursor-hover aria-label="Send email to thegarvmalik@gmail.com" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00] rounded py-1">
            <HoverWaveText text="THEGARVMALIK@GMAIL.COM" color={c.text} />
          </a>
        </div>
        <div className="w-full h-[1px] mb-10" style={{ background: c.border }} aria-hidden="true" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <nav className="flex flex-wrap gap-6 md:gap-8" aria-label="Social and professional links">
            {[
              { label: 'Github',   href: 'https://github.com/garvmalik',         display: 'Github ↗' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/thegarvmalik', display: 'LinkedIn ↗' },
              { label: 'Behance',  href: 'https://www.behance.net/garvmalik',    display: 'Behance ↗' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" data-cursor-hover
                aria-label={`${link.label} — opens in a new tab`}
                className="text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-200 hover:text-[#ff4d00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded py-1.5 px-1 border-b-2 border-transparent hover:border-[#ff4d00]"
                style={{ color: c.textMuted }}>
                {link.display}
              </a>
            ))}
            <a
              href="/garv-malik-cv.pdf"
              download
              data-cursor-hover
              aria-label="Download CV PDF"
              className="text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-200 hover:text-[#ff4d00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded py-1.5 px-1 border-b-2 border-transparent hover:border-[#ff4d00]"
              style={{ color: c.textMuted }}
            >
              CV ↓
            </a>
          </nav>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: c.textMuted }}>© 2026 Garv Malik</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t py-1" style={{ borderColor: c.border }} aria-hidden="true">
          <Marquee items={['Open to Work', 'UX/UI Internships', 'Finland & Europe', 'Interaction Design', 'Research-Led', 'Tampere, Finland']} speed={30} textColor={c.textFaint} />
        </div>
      </footer>
    </main>
  )
}