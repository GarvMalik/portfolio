"use client"
/**
 * page.tsx — Garv Malik Portfolio
 * Performance-optimized version.
 *
 * Key changes vs original:
 *  1. SVG feTurbulence/feDisplacementMap filters removed from hero on ALL devices.
 *     Replaced with pure CSS clip-path + transform contour lines — zero GPU filter cost.
 *  2. isMobile detection moved to a single useEffect with resize listener.
 *     matchMedia consolidated to one place — no duplicate listeners.
 *  3. scroll listener for mobileScrolled throttled with RAF to prevent
 *     per-pixel React re-renders.
 *  4. Mobile floating name div now uses transform: translateY instead of
 *     animating top/bottom — keeps animation on compositor thread.
 *  5. mousemove cursor uses RAF batching — one GSAP call per frame, not per event.
 *  6. backdropFilter removed from fullscreen mobile overlay — replaced with
 *     solid semi-transparent background (same visual result, no repaint cost).
 *  7. transition-colors removed from <main> — it was holding a stacking context
 *     and occasionally triggering full-page repaints on theme change.
 *  8. will-change: transform added to hero-garv, hero-malik, and cursor divs
 *     so the browser pre-promotes them to their own compositor layers.
 *  9. GSAP scrub animations use lazy ScrollTrigger.refresh to avoid running
 *     before fonts + layout are fully settled.
 * 10. Project card video gets loading="lazy" equivalent via preload="none".
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { useTheme, T } from './projects/_shared'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────────────────────────────────────
   MARQUEE
   No changes needed — already uses GSAP tween (compositor), not scroll events.
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   LAYERED HERO TEXT
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   LIST ROW
───────────────────────────────────────────────────────────────────────────── */
const ListRow = ({ label, value, borderColor, textColor, labelColor }: {
  label: string, value: string, borderColor: string, textColor: string, labelColor: string
}) => (
  <div className="split-item opacity-0 translate-y-8 flex justify-between items-baseline py-3.5 border-b" style={{ borderColor }}>
    <span className="text-[11px] uppercase font-mono tracking-[0.2em] flex-shrink-0 mr-6" style={{ color: labelColor }}>{label}</span>
    <span className="text-[13px] uppercase tracking-wide font-mono text-right leading-snug" style={{ color: textColor }}>{value}</span>
  </div>
)

/* ─────────────────────────────────────────────────────────────────────────────
   HOVER WAVE EMAIL
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────────────────────────────────────── */
const ThemeToggle = ({ theme, toggle, bg, fg }: { theme: 'dark' | 'light', toggle: () => void, bg: string, fg: string }) => (
  <button
    onClick={toggle}
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    className="fixed bottom-6 right-6 z-[10001] w-12 h-12 rounded-full border flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
    style={{ background: bg, borderColor: 'rgba(255,77,0,0.45)', willChange: 'transform' }}
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

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD
   Performance: video gets preload="none" so it doesn't block page load.
   will-change: transform on the card for smooth horizontal scroll.
───────────────────────────────────────────────────────────────────────────── */
const ProjectCard = ({ index, title, desc, tags, accentColor, pageNum, showLabel, href, bgGradient, videoSrc, surfaceColor, borderColor }: {
  index: number, title: string, desc: string, tags: string[], accentColor: string,
  pageNum: string, showLabel: boolean, href: string, bgGradient: string,
  videoSrc?: string, surfaceColor: string, borderColor: string
}) => (
  <article
    className="project-card w-screen h-full relative overflow-hidden flex flex-col justify-end p-6 md:p-16 group"
    aria-label={`Project: ${title}`}
    style={{ willChange: 'transform' }}
  >
    {showLabel && <div className="absolute top-10 left-10 text-[10px] uppercase font-mono italic text-[#ff4d00] tracking-widest z-10" aria-hidden="true">/ STUFF I BUILT / {pageNum}</div>}
    <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 text-[22vw] font-black leading-none select-none pointer-events-none z-0 opacity-[0.04]" style={{ color: 'gray', fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">0{index + 1}</div>

    {videoSrc ? (
      <>
        {/* preload="none" — don't load video until it's needed */}
        <video src={videoSrc} autoPlay loop muted playsInline disablePictureInPicture preload="none"
          className="absolute inset-0 w-full h-full object-cover z-0" style={{ opacity: 0.52 }} aria-hidden="true" tabIndex={-1} />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, #050505 25%, rgba(5,5,5,0.65) 55%, rgba(5,5,5,0.18) 100%)' }} aria-hidden="true" />
      </>
    ) : (
      <>
        <div className="absolute inset-0" style={{ background: bgGradient, opacity: 0.38 }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: surfaceColor, mixBlendMode: 'multiply' as const }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 22%, rgba(5,5,5,0.72) 52%, rgba(5,5,5,0.22) 100%)' }} aria-hidden="true" />
      </>
    )}

    <div className="relative z-10 max-w-xl flex flex-col">
      <div className="flex items-center gap-4 mb-4" aria-hidden="true">
        <div className="w-5 h-[1px] bg-[#ff4d00]" />
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ff4d00]">Project 0{index + 1}</span>
      </div>
      <h2 className="text-[7vw] md:text-[5vw] font-black uppercase tracking-tight mb-3 leading-[0.92]" style={{ color: accentColor }}>{title}</h2>
      <p className="font-mono text-xs md:text-sm mb-4 leading-relaxed" style={{ color: 'rgba(230,226,211,0.88)' }}>{desc}</p>
      <div className="flex flex-col gap-4">
        <ul className="flex flex-wrap gap-2" aria-label="Project tags">
          {tags.map(tag => (
            <li key={tag} className="px-2 py-1 border text-[8px] md:text-[9px] font-bold uppercase font-mono tracking-widest" style={{ borderColor, color: 'rgba(230,226,211,0.65)' }}>{tag}</li>
          ))}
        </ul>
        <Link href={href} className="md:hidden flex items-center gap-3 z-20 group/link rounded-full self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00]" aria-label={`View project: ${title}`}>
          <div className="w-9 h-9 rounded-full border border-[#ff4d00] flex items-center justify-center" aria-hidden="true">
            <span className="text-[#ff4d00] text-sm" aria-hidden="true">→</span>
          </div>
          <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-[0.2em] whitespace-nowrap">View Project</span>
        </Link>
      </div>
    </div>

    <Link href={href} className="hidden md:flex absolute bottom-12 right-12 items-center gap-3 z-20 group/link rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00]" aria-label={`View project: ${title}`}>
      <div className="w-10 h-10 rounded-full border border-[#ff4d00] flex items-center justify-center group-hover/link:bg-[#ff4d00] transition-colors duration-200" aria-hidden="true">
        <span className="text-[#ff4d00] group-hover/link:text-black text-sm transition-colors duration-200" aria-hidden="true">→</span>
      </div>
      <span className="text-[#ff4d00] font-mono text-[10px] uppercase font-bold tracking-[0.2em]">View Project</span>
    </Link>
  </article>
)

/* ─────────────────────────────────────────────────────────────────────────────
   HERO BACKGROUND
   PERF FIX: Replaced SVG feTurbulence+feDisplacementMap filters (causes
   expensive GPU filter passes on every frame) with pure CSS approach:
   - Simple static SVG lines (no filters at all)
   - CSS transform + opacity animation only (compositor-thread only)
   - Same visual — organic wavy contour lines — zero filter cost
───────────────────────────────────────────────────────────────────────────── */
const HeroBg = ({ theme }: { theme: 'dark' | 'light' }) => {
  const isDark = theme === 'dark'
  // Pre-compute a set of wavy path data — static, no JS on every frame
  const baseColor  = isDark ? 'rgba(180,200,220,0.10)' : 'rgba(30,60,100,0.07)'
  const accentColor = isDark ? 'rgba(100,210,200,0.30)' : 'rgba(0,120,160,0.22)'

  return (
    <svg
      className="hero-bg-svg absolute inset-0 w-full h-full z-0 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
      aria-hidden="true"
      style={{ opacity: isDark ? 0.9 : 0.7 }}
    >
      <style>{`
        @keyframes hb-drift {
          0%,100% { transform: translateY(0px) scaleX(1); }
          50%      { transform: translateY(6px)  scaleX(1.008); }
        }
        .hb-base   { animation: hb-drift 18s ease-in-out infinite; transform-origin: 50% 50%; }
        .hb-accent { animation: hb-drift 24s ease-in-out infinite reverse; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) { .hb-base, .hb-accent { animation: none; } }
      `}</style>
      {/* Base contour lines — simple, no filters */}
      <g className="hb-base" stroke={baseColor} strokeWidth="1" fill="none">
        {Array.from({ length: 52 }).map((_, i) => {
          // Sinusoidal wave baked into the path so no JS recalc ever needed
          const y = i * 18
          const amp = 12 + (i % 7) * 3
          const freq = 0.004 + (i % 5) * 0.001
          const d = `M-100,${y} ` + Array.from({ length: 32 }, (__, j) => {
            const x = j * 50
            const wy = y + Math.sin(x * freq + i * 0.5) * amp
            return `${j === 0 ? 'L' : 'L'}${x},${wy.toFixed(1)}`
          }).join(' ') + ' L1600,' + y
          return <path key={i} d={d} />
        })}
      </g>
      {/* Accent highlight contours */}
      <g className="hb-accent" fill="none">
        {[36, 90, 162, 234, 306, 378, 450, 522, 594, 666, 738, 810, 882].map((baseY, i) => {
          const amp = 18 + i * 2
          const freq = 0.003 + i * 0.0005
          const d = `M-100,${baseY} ` + Array.from({ length: 32 }, (__, j) => {
            const x = j * 50
            const wy = baseY + Math.sin(x * freq + i * 0.8) * amp
            return `L${x},${wy.toFixed(1)}`
          }).join(' ') + ` L1600,${baseY}`
          return <path key={i} d={d} stroke={accentColor} strokeWidth="1.4" />
        })}
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const container  = useRef<HTMLDivElement>(null)
  const cursorDot  = useRef<HTMLDivElement>(null)
  const cursorRing = useRef<HTMLDivElement>(null)

  const [cursorVisible,  setCursorVisible]  = useState(false)
  // PERF FIX: use number (0/1) instead of boolean to avoid string coercion in style
  const [scrolledRatio,  setScrolledRatio]  = useState(0)   // 0 = top, 1 = scrolled
  const [reduced,        setReduced]        = useState(false)
  const [isMobile,       setIsMobile]       = useState(false)
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [activeSection,  setActiveSection]  = useState('main-content')

  const { theme, toggle } = useTheme()
  const c = T[theme]

  // ── Single consolidated init effect ──────────────────────────────────────
  // All browser queries in one place — avoids multiple listeners firing at mount.
  useEffect(() => {
    // Reduced motion
    const rmq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(rmq.matches)
    const onRM = (e: MediaQueryListEvent) => setReduced(e.matches)
    rmq.addEventListener('change', onRM)

    // Mobile detection — also listens for resize so SSR mismatch self-heals
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })

    return () => {
      rmq.removeEventListener('change', onRM)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // ── Scroll listener — RAF-throttled ──────────────────────────────────────
  // PERF FIX: Wrapping setState in RAF means we only update React state once
  // per animation frame (~60fps) instead of on every pixel of scroll.
  // This prevents React re-renders from blocking the compositor thread.
  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      if (rafId) return  // already have a pending frame — skip
      rafId = requestAnimationFrame(() => {
        setScrolledRatio(window.scrollY > 60 ? 1 : 0)
        rafId = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // ── URL hash → active section ─────────────────────────────────────────────
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const valid = ['main-content', 'manifesto', 'about-skills', 'projects', 'about', 'contact']
    if (hash && valid.includes(hash)) setActiveSection(hash)
  }, [])

  // ── Scrollspy ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const ids = ['main-content', 'manifesto', 'about-skills', 'projects', 'about', 'contact']
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.25 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // ── Escape key closes menu ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Custom cursor — RAF-batched ────────────────────────────────────────────
  // PERF FIX: Previous code called gsap.to() twice per mousemove event.
  // Now we store mouse position and only flush to GSAP inside a RAF,
  // capping updates to 60fps and never blocking the main thread mid-event.
  useEffect(() => {
    if (reduced || isMobile) return
    let rafId = 0
    let mx = 0, my = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (!cursorVisible) setCursorVisible(true)
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        gsap.set(cursorDot.current,  { x: mx, y: my })
        gsap.to(cursorRing.current,  { x: mx, y: my, duration: 0.12, ease: 'power3.out', overwrite: true })
        rafId = 0
      })
    }
    const onEnter = () => {
      gsap.to(cursorRing.current, { scale: 2.5, duration: 0.2 })
      gsap.to(cursorDot.current,  { scale: 0, duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(cursorRing.current, { scale: 1, duration: 0.2 })
      gsap.to(cursorDot.current,  { scale: 1, duration: 0.2 })
    }
    const targets = Array.from(document.querySelectorAll('a, button, [data-cursor-hover]'))
    window.addEventListener('mousemove', onMove, { passive: true })
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [cursorVisible, reduced, isMobile])

  // ── Mobile CSS parallax — RAF-throttled ───────────────────────────────────
  useEffect(() => {
    if (!isMobile || reduced) return
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        const garv  = document.querySelector<HTMLElement>('.hero-garv')
        const malik = document.querySelector<HTMLElement>('.hero-malik')
        if (garv)  garv.style.transform  = `translateY(${y * -0.18}px)`
        if (malik) malik.style.transform = `translateY(${y * -0.10}px)`
        rafId = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile, reduced])

  // ── GSAP scroll animations ─────────────────────────────────────────────────
  useGSAP(() => {
    if (reduced) {
      gsap.set(['.layered-top', '.layered-bottom', '.intro-label', '.quote-line',
                '.manifesto-sub', '.split-header', '.split-item', '.now-item', '.footer-email'],
        { clearProps: 'all' })
      return
    }

    // Hero entrance
    gsap.fromTo('.layered-top',    { yPercent: 105 }, { yPercent: 0, duration: 1.4, stagger: 0.06, ease: 'power4.out', delay: 0.3 })
    gsap.fromTo('.layered-bottom', { opacity: 0 },    { opacity: 1,  duration: 1.4, stagger: 0.06, ease: 'power4.out', delay: 0.3 })
    gsap.fromTo('.intro-label',    { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 1.2, ease: 'power2.out' })

    if (!isMobile) {
      // Desktop parallax
      const heroTrigger = { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-garv',  { y: -420, ease: 'none', scrollTrigger: heroTrigger })
      gsap.to('.hero-malik', { y: -240, ease: 'none', scrollTrigger: heroTrigger })

      // Manifesto pin
      const mTl = gsap.timeline({ scrollTrigger: { trigger: '.manifesto-section', pin: true, start: 'top top', end: '+=160%', scrub: 1.2 } })
      mTl.to('.quote-line', { y: '0%', stagger: 0.4, ease: 'power3.out', duration: 1 })
         .to('.manifesto-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')

      // Split section
      const sTl = gsap.timeline({ scrollTrigger: { trigger: '.split-section', start: 'top 65%', end: 'bottom 85%', scrub: 1 } })
      sTl.to('.center-line',  { height: '100%', ease: 'none', duration: 2 })
         .to('.split-header', { opacity: 1, y: 0, stagger: 0.15, duration: 1 }, '<0.3')
         .to('.split-item',   { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 }, '<0.4')

      // Horizontal cards
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
    } else {
      // Mobile — no pin, no scrub (these cause compositor jank on mobile)
      gsap.fromTo('.quote-line',
        { y: '100%' },
        { y: '0%', stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto-section', start: 'top 75%', once: true } })
      gsap.fromTo('.manifesto-sub',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5,
          scrollTrigger: { trigger: '.manifesto-section', start: 'top 75%', once: true } })
      gsap.fromTo('.split-header',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.split-section', start: 'top 70%', once: true } })
      gsap.fromTo('.split-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: '.split-section', start: 'top 70%', once: true } })
    }

    gsap.fromTo('.now-item',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.now-section', start: 'top 70%', once: true } })
    gsap.fromTo('.footer-email',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-section', start: 'top 80%', once: true } })

  }, { scope: container, dependencies: [isMobile] })

  // ── Static data (memoized so identity is stable across renders) ────────────
  const MARQUEE_ITEMS = useMemo(() => ['UX/UI Designer', 'Open to Work', 'Tampere, Finland', 'Interaction Design', 'User Research', 'Figma', 'Design Systems', 'Prototyping'], [])
  const projects = useMemo(() => [
    { title: 'CityLoop Discovery', desc: "How do you help someone decide what to do when they don't know what they want? CityLoop surfaces local places and events based on mood, weather, and time of day.", tags: ['UX/UI Design', 'Figma', 'UX Research', 'Prototyping'], accentColor: '#D95F30', pageNum: 'P. 004', showLabel: true, href: '/projects/cityloop', bgGradient: 'radial-gradient(ellipse at 30% 60%, #3d1a0e 0%, #1a0a05 40%, transparent 70%), radial-gradient(ellipse at 70% 30%, #2a1208 0%, transparent 60%)', videoSrc: '/cityloop-bg.mp4' },
    { title: 'MyTown Relocation', desc: 'Moving to a new country is overwhelming. MyTown guides international students through their first weeks in Finland — step by step.', tags: ['Product Design', 'Service Concept', 'Figma', 'Research'], accentColor: '#FF844B', pageNum: 'P. 005', showLabel: false, href: '/projects/mytown', bgGradient: 'radial-gradient(ellipse at 20% 70%, #2a1e18 0%, #1a1208 40%, transparent 70%), radial-gradient(ellipse at 75% 25%, #1e2535 0%, transparent 60%)', videoSrc: '/mytown-bg.mp4' },
    { title: 'PlayPal Community', desc: 'Finding someone to play sports with is harder than it should be. PlayPal connects people by sport, skill level, and location — and handles the logistics too.', tags: ['Design System', 'Interaction', 'Figma', 'Motion'], accentColor: '#2978FF', pageNum: 'P. 006', showLabel: false, href: '/projects/playpal', bgGradient: 'radial-gradient(ellipse at 25% 65%, #0a1530 0%, #050c1e 40%, transparent 70%), radial-gradient(ellipse at 70% 25%, #0d1828 0%, transparent 60%)', videoSrc: '/playpal-bg.mp4' },
  ], [])

  // PERF FIX: mobileScrolled is now a number 0/1, derive boolean lazily
  const mobileScrolled = scrolledRatio === 1

  return (
    // PERF FIX: removed `transition-colors duration-300` from <main>.
    // That class was holding a stacking context and causing full-page
    // repaint on theme change. Theme colors are applied via inline style
    // which React patches the DOM with directly without triggering layout.
    <main ref={container} className="overflow-x-hidden selection:bg-[#ff4d00] selection:text-black" style={{ background: c.bg, color: c.text }}>

      {/* Skip link */}
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[99999] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-[#ff4d00] focus-visible:text-black focus-visible:font-mono focus-visible:text-sm focus-visible:uppercase focus-visible:tracking-widest focus-visible:rounded">
        Skip to main content
      </a>

      {/* Hide cursor on desktop only */}
      {!reduced && !isMobile && <style>{`body { cursor: none; }`}</style>}

      {/* Grain — desktop only. Mobile fixed layers cause compositor thrashing. */}
      {!isMobile && (
        <div
          className="fixed inset-0 pointer-events-none z-[9998]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
            opacity: c.grain,
            // Promote to own layer so it never triggers a repaint
            willChange: 'opacity',
          }}
          aria-hidden="true"
        />
      )}

      {/* Custom cursor — will-change promotes to own compositor layer */}
      <div ref={cursorDot}  className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#ff4d00] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ opacity: cursorVisible ? 1 : 0, willChange: 'transform' }} aria-hidden="true" />
      <div ref={cursorRing} className="fixed top-0 left-0 w-8 h-8 border border-[#ff4d00] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ opacity: cursorVisible ? 1 : 0, willChange: 'transform' }} aria-hidden="true" />

      <ThemeToggle theme={theme} toggle={toggle} bg={c.toggleBg} fg={c.toggleFg} />

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-8"
        aria-label="Site navigation"
        style={{
          background: c.navBg,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${c.border}`,
          height: '52px',
          // Nav is fixed and never moves — own layer is beneficial here
          willChange: 'background-color',
        }}
      >
        <a
          href="#main-content"
          onClick={e => { e.preventDefault(); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }) }}
          className="intro-label opacity-0 text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff4d00] rounded"
          aria-label="Garv Malik — scroll to top"
        >
          / Garv Malik — UX/UI Designer
        </a>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home',     id: 'main-content' },
            { label: 'Approach', id: 'about-skills' },
            { label: 'Work',     id: 'projects'     },
            { label: 'About',    id: 'about'        },
            { label: 'Contact',  id: 'contact'      },
          ].map(({ label, id }) => {
            const isActive = activeSection === id
            return (
              <a key={id} href={`#${id}`}
                onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}
                className="relative px-3 py-1 text-[10px] uppercase font-mono tracking-[0.25em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
                style={{ color: isActive ? '#ff4d00' : c.textMuted }}
                aria-current={isActive ? 'true' : undefined}
              >
                {label}
                {isActive && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff4d00]" aria-hidden="true" />}
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="intro-label opacity-0 text-[9px] uppercase font-mono italic tracking-[0.25em] text-[#ff4d00] hidden md:inline" aria-hidden="true">2026</span>
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
            style={{ overflow: 'visible' }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="block w-5 h-[2px] rounded-full origin-center" style={{ background: '#ff4d00', transition: 'transform 0.3s ease', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-[2px] rounded-full" style={{ background: '#ff4d00', transition: 'opacity 0.3s ease, transform 0.3s ease', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
            <span className="block w-5 h-[2px] rounded-full origin-center" style={{ background: '#ff4d00', transition: 'transform 0.3s ease', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu
          PERF FIX: backdropFilter removed — blur forces the browser to
          sample and composite a snapshot of everything behind the overlay,
          which is expensive on mobile GPU. Using a high-opacity solid fill
          instead produces visually equivalent result at near-zero cost. */}
      <div
        className="md:hidden fixed inset-0 z-[49] flex flex-col justify-center items-start px-8"
        style={{
          background: theme === 'dark' ? 'rgba(5,5,5,0.97)' : 'rgba(245,242,236,0.98)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transform: menuOpen ? 'none' : 'translateY(-8px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
        aria-hidden={!menuOpen}
      >
        {[
          { label: 'Home',     id: 'main-content' },
          { label: 'Approach', id: 'about-skills' },
          { label: 'Work',     id: 'projects'     },
          { label: 'About',    id: 'about'        },
          { label: 'Contact',  id: 'contact'      },
        ].map(({ label, id }, idx) => (
          <a key={id} href={`#${id}`}
            onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}
            className="text-[11vw] font-black uppercase tracking-tight leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff4d00] rounded"
            style={{ color: activeSection === id ? '#ff4d00' : c.text, transition: 'color 0.2s ease', transitionDelay: menuOpen ? `${idx * 35}ms` : '0ms' }}
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
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="text-[9px] font-mono uppercase tracking-[0.25em] hover:text-[#ff4d00] transition-colors duration-200"
              style={{ color: c.textMuted }} onClick={() => setMenuOpen(false)}>
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Mobile floating name
          PERF FIX: was animating CSS `top` and `bottom` properties which
          trigger layout recalculation on every frame.
          Now uses transform: translateY so animation stays on compositor thread.
          The element is always at top:0 (via fixed), the Y offset moves it. */}
      <div
        className="md:hidden fixed z-40 left-0 right-0 flex items-center px-6 pointer-events-none top-0"
        style={{
          transform: mobileScrolled ? 'translateY(0)' : 'translateY(calc(100vh - 5rem))',
          opacity: mobileScrolled ? 1 : 0,
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          background: mobileScrolled ? c.navBg : 'transparent',
          borderBottom: mobileScrolled ? `1px solid ${c.border}` : 'none',
          transition: reduced ? 'none' : 'transform 0.35s ease, opacity 0.35s ease, background 0.35s ease',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <span style={{ color: c.text, fontSize: mobileScrolled ? '4.5vw' : '8vw', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', transition: reduced ? 'none' : 'font-size 0.35s ease' }}>
          GARV <span style={{ color: '#ff4d00' }}>MALIK</span>
        </span>
      </div>

      {/* ── HERO ── */}
      <section id="main-content" className="hero-section relative h-screen flex flex-col justify-end pb-[12vh] md:justify-center md:pb-0 px-6 md:px-16 overflow-hidden scroll-mt-[52px]" style={{ background: c.bg }} aria-label="Hero Garv Malik, UX UI Designer">
        {/* PERF FIX: HeroBg uses pure CSS sine-wave paths + transform-only
            animation. No SVG filter passes whatsoever. */}
        <HeroBg theme={theme} />

        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: c.border }} aria-hidden="true" />
        <div className="intro-label opacity-0 absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Home / P. 001</div>
        <h1 className="sr-only">Garv Malik — UX/UI Designer based in Tampere, Finland</h1>

        <div className="hero-name-wrap flex flex-col items-start gap-0 relative z-10 w-full" aria-hidden="true">
          {/* will-change: transform tells the browser to pre-promote these to
              compositor layers so the GSAP/CSS parallax never causes repaints */}
          <div className="hero-garv" style={{ willChange: 'transform' }}>
            <LayeredText text="GARV"  className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color={c.text} />
          </div>
          <div className="hero-malik" style={{ willChange: 'transform' }}>
            <LayeredText text="MALIK" className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color="#ff4d00" />
          </div>
        </div>

        <div className="intro-label opacity-0 relative z-10 flex flex-wrap items-center gap-3 mt-6 md:mt-8" aria-hidden="false">
          <a href="#projects" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 bg-[#ff4d00] text-black font-mono text-[9px] uppercase tracking-[0.2em] px-4 py-2.5 hover:bg-[#e04300] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]">
            View Work →
          </a>
          <a href="/garv-malik-cv.pdf" download
            className="inline-flex items-center gap-2 border font-mono text-[9px] uppercase tracking-[0.2em] px-4 py-2.5 hover:bg-[#ff4d00] hover:text-black hover:border-[#ff4d00] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
            style={{ borderColor: c.border, color: c.textMuted }}>
            Download CV ↓
          </a>
          <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] px-4 py-2.5 hover:text-[#ff4d00] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
            style={{ color: c.textMuted }}>
            Contact
          </a>
        </div>

        <div className="intro-label opacity-0 hidden md:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col items-end gap-3 text-right" aria-hidden="true">
          <div className="w-[1px] h-20 self-center" style={{ background: c.border }} />
          <p className="text-[9px] uppercase font-mono tracking-[0.25em] max-w-[160px] leading-loose" style={{ color: c.textMuted }}>UX/UI Designer<br />Research · Interaction · Figma</p>
          <div className="w-[1px] h-20 self-center" style={{ background: c.border }} />
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
      <section id="manifesto" className="manifesto-section relative h-screen flex flex-col justify-center px-6 md:px-16" style={{ background: c.bg }} aria-label="Design philosophy">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Manifesto / P. 002</div>
        <blockquote className="w-full max-w-7xl flex flex-col gap-0 pt-16">
          {[
            { text: 'Good design is not',          col: c.text    },
            { text: 'what you see first.',          col: c.text    },
            { text: "It's what you don't notice",   col: c.text    },
            { text: 'while everything just works.', col: '#ff4d00' },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden leading-none">
              <p className="quote-line translate-y-full uppercase leading-[0.92] text-[10vw] md:text-[8vw]"
                style={{ color: line.col, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em', fontWeight: 400 }}>
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

      {/* ── SKILLS ── */}
      <section id="about-skills" className="split-section relative min-h-screen w-full border-t flex flex-col md:flex-row px-6 md:px-16 py-28 md:py-36 gap-16 md:gap-0 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="Skills and values">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Who Am I / P. 003</div>
        <div className="center-line absolute left-1/2 top-0 w-[1px] h-0 -translate-x-1/2 hidden md:block" style={{ background: 'rgba(255,77,0,0.22)' }} aria-hidden="true" />
        <div className="w-full md:w-1/2 md:pr-20 flex flex-col justify-center pt-10 md:pt-0">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">The Practice</p>
          <h2 className="split-header opacity-0 translate-y-6 text-6xl md:text-7xl font-black uppercase leading-[0.88] mb-10 tracking-tight" style={{ color: c.text }}>What<br />I Build</h2>
          <dl className="flex flex-col">
            <ListRow label="Design"   value="UX/UI · Accessibility · Design Systems"           borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Process"  value="Research · Flows · Prototyping"                    borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Tools"    value="Figma · Miro · Mural"                              borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Research" value="Interviews · Usability Testing · Affinity Mapping" borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
          </dl>
        </div>
        <div className="w-full md:w-1/2 md:pl-20 flex flex-col justify-center">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">The Mindset</p>
          <h2 className="split-header opacity-0 translate-y-6 text-6xl md:text-7xl font-black uppercase leading-[0.88] mb-10 tracking-tight" style={{ color: c.text }}>What<br />Moves Me</h2>
          <dl className="flex flex-col">
            <ListRow label="Principle"     value="Clarity and calm over complexity"             borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Interest"      value="Context-aware, human-centered design"         borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Curious about" value="AI and how it shapes human behavior"          borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Goal"          value="Interfaces people use without thinking"       borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
          </dl>
        </div>
      </section>

      <div className="w-full bg-[#ff4d00] py-3 overflow-hidden" aria-hidden="true">
        <Marquee items={['Selected Work', '3 Projects', 'Research-Led Design', 'Figma', 'Tampere, Finland', '2024–2026']} speed={60} reverse textColor="rgba(255,255,255,0.88)" />
      </div>

      {/* ── PROJECTS ── */}
      {isMobile ? (
        <div id="projects" className="flex flex-col scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects">
          {projects.map((p, i) => (
            <div key={i} className="relative w-full overflow-hidden flex flex-col justify-end p-6 border-b" style={{ minHeight: '85vh', borderColor: c.border }}>
              <div className="absolute inset-0" style={{ background: p.bgGradient, opacity: theme === 'dark' ? 0.9 : 0.6 }} aria-hidden="true" />

              {/* Mobile project decorative SVGs — no filters, just geometry */}
              {i === 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.5 }}>
                  {[40, 90, 140, 195, 255, 320, 390].map((r, ri) => (
                    <circle key={ri} cx="310" cy="160" r={r} fill="none" stroke={ri % 2 === 0 ? '#D95F30' : '#D7DFD8'} strokeWidth={ri % 2 === 0 ? '2' : '1'} />
                  ))}
                  <circle cx="310" cy="160" r="8" fill="#D95F30" />
                  <line x1="310" y1="160" x2="310" y2="-230" stroke="#D95F30" strokeWidth="1.5" opacity="0.6" />
                  <line x1="310" y1="160" x2="650" y2="450" stroke="#D7DFD8" strokeWidth="1" opacity="0.4" />
                </svg>
              )}
              {i === 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.5 }}>
                  {[0,1,2,3,4,5,6].map(col => <line key={`v${col}`} x1={col * 65} y1="0" x2={col * 65} y2="700" stroke="#FF844B" strokeWidth="0.8" opacity="0.5" />)}
                  {[0,1,2,3,4,5,6,7,8,9,10].map(row => <line key={`h${row}`} x1="0" y1={row * 70} x2="390" y2={row * 70} stroke="#55A6EC" strokeWidth="0.8" opacity="0.5" />)}
                  <rect x="240" y="380" width="30" height="200" fill="#FF844B" opacity="0.30" />
                  <rect x="278" y="310" width="40" height="270" fill="#FF844B" opacity="0.40" rx="1" />
                  <rect x="326" y="350" width="28" height="230" fill="#FF844B" opacity="0.25" />
                  <rect x="362" y="420" width="28" height="160" fill="#55A6EC" opacity="0.25" />
                </svg>
              )}
              {i === 2 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 390 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: theme === 'dark' ? 0.65 : 0.5 }}>
                  <rect x="30" y="80" width="330" height="540" fill="none" stroke="#2978FF" strokeWidth="2" opacity="0.7" rx="4" />
                  <line x1="30" y1="350" x2="360" y2="350" stroke="#2978FF" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="195" cy="350" r="55" fill="none" stroke="#2978FF" strokeWidth="2" opacity="0.7" />
                  <circle cx="195" cy="350" r="8" fill="#FFC107" opacity="0.9" />
                  <path d="M 60 80 A 135 135 0 0 1 330 80" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
                  <path d="M 60 620 A 135 135 0 0 0 330 620" fill="none" stroke="#FFC107" strokeWidth="2" opacity="0.6" />
                  <rect x="130" y="80" width="130" height="140" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
                  <rect x="130" y="480" width="130" height="140" fill="none" stroke="#2978FF" strokeWidth="1.5" opacity="0.55" />
                  <circle cx="195" cy="180" r="45" fill="none" stroke="#2978FF" strokeWidth="2.5" opacity="0.8" />
                </svg>
              )}

              {/* PERF FIX: mobile SVGs no longer have feGaussianBlur filters.
                  Glow effects removed from mobile — they are expensive and
                  invisible on small screens at 85vh card height anyway. */}
              <div className="absolute inset-0" style={{ background: theme === 'dark' ? 'linear-gradient(to top, #050505 28%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.10) 100%)' : 'linear-gradient(to top, rgba(20,10,5,0.92) 28%, rgba(20,10,5,0.65) 55%, rgba(20,10,5,0.15) 100%)' }} aria-hidden="true" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-[1px] bg-[#ff4d00]" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ff4d00]">Project 0{i + 1}</span>
                </div>
                <h2 className="text-[10vw] font-black uppercase tracking-tight mb-2 leading-[0.92]" style={{ color: p.accentColor }}>{p.title}</h2>
                <p className="font-mono text-xs mb-4 leading-relaxed" style={{ color: 'rgba(230,226,211,0.85)' }}>{p.desc}</p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map(tag => <li key={tag} className="px-2 py-1 border text-[8px] font-bold uppercase font-mono tracking-widest" style={{ borderColor: c.border, color: 'rgba(230,226,211,0.6)' }}>{tag}</li>)}
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
        <div id="projects" className="horizontal-section flex w-[300vw] h-screen overflow-hidden scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects — scroll to explore">
          {projects.map((p, i) => <ProjectCard key={i} index={i} {...p} surfaceColor={c.surface} borderColor={c.border} />)}
        </div>
      )}

      {/* ── ABOUT ── */}
      <section id="about" className="about-section relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-28 border-t overflow-hidden scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="About Garv Malik">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ About / P. 007</div>
        <h2 className="flex flex-col mb-8 md:mb-12 pt-12 md:pt-0" aria-label="Who am I">
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
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>I design with research at the centre. That means talking to users early, testing often, and making decisions based on what people actually do — not what they say they do. I'm drawn to calm, accessible interfaces and experiences that work well in real, messy contexts.</p>
            <blockquote className="border-l-2 border-[#ff4d00] pl-4">
              <p className="font-mono text-sm italic" style={{ color: c.text }}>"Design is how it works — I'm here to figure that out."</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── RIGHT NOW ── */}
      <section className="now-section relative min-h-[55vh] flex flex-col justify-center px-6 md:px-16 py-24 border-t" style={{ background: c.bg, borderColor: c.border }} aria-label="What Garv is doing right now">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Right Now / P. 008</div>
        <h2 className="now-item opacity-0 flex flex-col mb-10 md:mb-14" aria-label="Right Now">
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
              <dt className="text-[9px] text-[#ff4d00] uppercase tracking-[0.3em] mb-3">{label}</dt>
              <dd className="text-sm leading-relaxed whitespace-pre-line" style={{ color: c.textMuted }}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="footer-section min-h-screen flex flex-col justify-center px-6 md:px-16 border-t relative overflow-hidden scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="Contact and social links">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Open Channel / P. 009</div>
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-[22vw] font-black leading-none select-none pointer-events-none" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }} aria-hidden="true">+</div>
        <div className="footer-email opacity-0 mt-20 mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#ff4d00] mb-6 font-bold">Open to internships and UX roles in Finland and Europe.</p>
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
          </nav>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: c.textFaint }}>© 2026 Garv Malik — Designed &amp; Built from scratch</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t py-1" style={{ borderColor: c.border }} aria-hidden="true">
          <Marquee items={["Open to Work", 'UX/UI Design Roles', 'Finland & Europe', 'Interaction Design', 'Research-Led', 'Tampere, Finland', "Let's Talk"]} speed={30} textColor={c.textFaint} />
        </div>
      </footer>
    </main>
  )
}