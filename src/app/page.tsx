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
  <div className="split-item opacity-0 translate-y-8 flex justify-between items-baseline py-3.5 border-b transition-colors duration-300" style={{ borderColor }}>
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
    className="fixed bottom-6 right-6 z-[10001] w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00]"
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
const ProjectCard = ({ index, title, desc, tags, accentColor, pageNum, showLabel, href, bgGradient, videoSrc, surfaceColor, borderColor }: {
  index: number, title: string, desc: string, tags: string[], accentColor: string,
  pageNum: string, showLabel: boolean, href: string, bgGradient: string,
  videoSrc?: string, surfaceColor: string, borderColor: string
}) => (
  <article className="project-card w-screen h-full relative overflow-hidden flex flex-col justify-end p-6 md:p-16 group" aria-label={`Project: ${title}`}>
    {showLabel && <div className="absolute top-10 left-10 text-[10px] uppercase font-mono italic text-[#ff4d00] tracking-widest z-10" aria-hidden="true">/ STUFF I BUILT / {pageNum}</div>}
    <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 text-[22vw] font-black leading-none select-none pointer-events-none z-0 opacity-[0.04]" style={{ color: 'gray', fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">0{index + 1}</div>

    {videoSrc ? (
      <>
        <video src={videoSrc} autoPlay loop muted playsInline disablePictureInPicture className="absolute inset-0 w-full h-full object-cover z-0" style={{ opacity: 0.52 }} aria-hidden="true" tabIndex={-1} />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, #050505 25%, rgba(5,5,5,0.65) 55%, rgba(5,5,5,0.18) 100%)' }} aria-hidden="true" />
      </>
    ) : (
      <>
        <div className="absolute inset-0" style={{ background: bgGradient, opacity: 0.38 }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: surfaceColor, mixBlendMode: 'multiply' as const }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 22%, rgba(5,5,5,0.72) 52%, rgba(5,5,5,0.22) 100%)' }} aria-hidden="true" />
      </>
    )}

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
  const cursorDot = useRef<HTMLDivElement>(null)
  const cursorRing = useRef<HTMLDivElement>(null)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
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
      { threshold: 0.25 }
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

  // Custom cursor — desktop, not reduced-motion
  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      if (!cursorVisible) setCursorVisible(true)
      gsap.to(cursorDot.current, { x: e.clientX, y: e.clientY, duration: 0 })
      gsap.to(cursorRing.current, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power3.out' })
    }
    const onEnter = () => { gsap.to(cursorRing.current, { scale: 2.5, duration: 0.2 }); gsap.to(cursorDot.current, { scale: 0, duration: 0.2 }) }
    const onLeave = () => { gsap.to(cursorRing.current, { scale: 1, duration: 0.2 }); gsap.to(cursorDot.current, { scale: 1, duration: 0.2 }) }

    // Fix: capture the NodeList as an array so we can remove the same
    // listeners on cleanup — prevents memory leak on remount.
    const hoverTargets = Array.from(document.querySelectorAll('a, button, [data-cursor-hover]'))

    window.addEventListener('mousemove', onMove)
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      window.removeEventListener('mousemove', onMove)
      hoverTargets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [cursorVisible, reduced])

  // Lightweight CSS parallax for hero on mobile — avoids GSAP scrub entirely
  useEffect(() => {
    if (!isMobile || reduced) return
    const onScroll = () => {
      const y = window.scrollY
      const garv  = document.querySelector<HTMLElement>('.hero-garv')
      const malik = document.querySelector<HTMLElement>('.hero-malik')
      if (garv)  garv.style.transform  = `translateY(${y * -0.18}px)`
      if (malik) malik.style.transform = `translateY(${y * -0.10}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile, reduced])

  // GSAP scroll animations
  useGSAP(() => {
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

  const MARQUEE_ITEMS = ['UX/UI Design', 'Interaction Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Tampere, Finland', 'Open to Work']
  const projects = [
    {
      title: 'CityLoop Discovery',
      desc: 'Lifestyle discovery app helping users find places and events based on mood and weather in Tampere.',
      tags: ['UX/UI Design', 'Figma', 'UX Research', 'Prototyping'],
      accentColor: '#D95F30',   // CityLoop terracotta
      pageNum: 'P. 004', showLabel: true, href: '/projects/cityloop',
      bgGradient: 'radial-gradient(ellipse at 30% 60%, #3d1a0e 0%, #1a0a05 40%, transparent 70%), radial-gradient(ellipse at 70% 30%, #2a1208 0%, transparent 60%)',
      videoSrc: '/cityloop-bg.mp4',
    },
    {
      title: 'MyTown Relocation',
      desc: 'Service concept centralizing guidance and peer support for international students moving to Finland.',
      tags: ['Product Design', 'Service Concept', 'Figma', 'Research'],
      accentColor: '#FF844B',   // MyTown orange
      pageNum: 'P. 005', showLabel: false, href: '/projects/mytown',
      bgGradient: 'radial-gradient(ellipse at 20% 70%, #2a1e18 0%, #1a1208 40%, transparent 70%), radial-gradient(ellipse at 75% 25%, #1e2535 0%, transparent 60%)',
      videoSrc: '/mytown-bg.mp4',
    },
    {
      title: 'PlayPal Community',
      desc: 'Concept designed to help people find sports partners, organize games, and book venues effortlessly.',
      tags: ['Design System', 'Interaction', 'Figma', 'Motion'],
      accentColor: '#2978FF',   // PlayPal blue
      pageNum: 'P. 006', showLabel: false, href: '/projects/playpal',
      bgGradient: 'radial-gradient(ellipse at 25% 65%, #0a1530 0%, #050c1e 40%, transparent 70%), radial-gradient(ellipse at 70% 25%, #0d1828 0%, transparent 60%)',
      videoSrc: '/playpal-bg.mp4',
    },
  ]

  return (
    <main ref={container} className="overflow-x-hidden selection:bg-[#ff4d00] selection:text-black transition-colors duration-300" style={{ background: c.bg, color: c.text }}>
      {/* WCAG 2.4.1 Bypass Blocks — skip link */}
      <a href="#main-content" className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[99999] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-[#ff4d00] focus-visible:text-black focus-visible:font-mono focus-visible:text-sm focus-visible:uppercase focus-visible:tracking-widest focus-visible:rounded">
        Skip to main content
      </a>

      {/* Hide system cursor only on desktop when not reduced */}
      {!reduced && <style>{`@media (min-width: 768px) { body { cursor: none; } }`}</style>}

      {/* Grain — desktop only for performance, fixed layers cause constant repaints on mobile */}
      {!isMobile && <div className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-300" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px', opacity: c.grain }} aria-hidden="true" />}

      {/* Custom cursor — desktop, decorative */}
      <div ref={cursorDot}  className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#ff4d00] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ opacity: cursorVisible ? 1 : 0 }} aria-hidden="true" />
      <div ref={cursorRing} className="fixed top-0 left-0 w-8 h-8 border border-[#ff4d00] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ opacity: cursorVisible ? 1 : 0 }} aria-hidden="true" />

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
        <div className="hidden md:flex items-center gap-10" role="list">
          {[
            { label: 'Home',   id: 'main-content' },
            { label: 'Skills',   id: 'about-skills' },
            { label: 'Work',     id: 'projects'    },
            { label: 'About',    id: 'about'        },
            { label: 'Contact',  id: 'contact'      },
          ].map(({ label, id }) => {
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                role="listitem"
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="relative px-3 py-1 text-[10px] uppercase font-mono tracking-[0.25em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d00] rounded"
                style={{ color: isActive ? '#ff4d00' : c.textMuted }}
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
          backdropFilter: 'blur(16px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transform: menuOpen ? 'none' : 'translateY(-8px)',
        }}
        aria-hidden={!menuOpen}
      >
        {[
          { label: 'Home',    id: 'main-content' },
          { label: 'Skills',  id: 'about-skills' },
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
          backdropFilter:   mobileScrolled ? 'blur(12px)'   : 'none',
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
        
        {/* Topographic terrain background —
             Desktop: animated SVG with feTurbulence (GPU-intensive, looks great on desktop)
             Mobile:  lightweight CSS-only static contour lines (no filters, no JS, smooth) */}
        {!isMobile ? (
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: theme === 'dark' ? 0.55 : 0.45 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" aria-hidden="true">
            <defs>
              <filter id="topo-warp" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0032" numOctaves="5" seed="42" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="220" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="topo-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <style>{`
                @keyframes topo-drift {
                  0%   { transform: translate(0px,   0px)   scale(1.00); }
                  33%  { transform: translate(-18px, 12px)  scale(1.02); }
                  66%  { transform: translate(14px,  -8px)  scale(0.99); }
                  100% { transform: translate(0px,   0px)   scale(1.00); }
                }
                @keyframes topo-accent-drift {
                  0%   { transform: translate(0px,  0px); }
                  50%  { transform: translate(22px, -14px); }
                  100% { transform: translate(0px,  0px); }
                }
                .topo-base    { animation: topo-drift        42s ease-in-out infinite; transform-origin: 50% 50%; }
                .topo-accent  { animation: topo-accent-drift 28s ease-in-out infinite; transform-origin: 50% 50%; }
                @media (prefers-reduced-motion: reduce) { .topo-base, .topo-accent { animation: none; } }
              `}</style>
            </defs>
            <g className="topo-base" filter="url(#topo-warp)" stroke={theme === 'dark' ? 'rgba(180,200,220,0.13)' : 'rgba(30,60,100,0.09)'} strokeWidth="1" fill="none">
              {Array.from({ length: 52 }).map((_, i) => <line key={`h-${i}`} x1="-100" y1={i * 18} x2="1600" y2={i * 18} />)}
            </g>
            <g className="topo-accent" filter="url(#topo-warp)" fill="none">
              {[36, 90, 162, 234, 306, 378, 450, 522, 594, 666, 738, 810, 882].map((y, i) => (
                <line key={`a-${i}`} x1="-100" y1={y} x2="1600" y2={y} stroke={theme === 'dark' ? 'rgba(100,210,200,0.38)' : 'rgba(0,120,160,0.28)'} strokeWidth="1.4" filter="url(#topo-glow)" />
              ))}
            </g>
          </svg>
        ) : (
          /* Mobile: pure CSS radial contour rings — zero filter cost, no animation, still textural */
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: theme === 'dark' ? 0.18 : 0.12 }} aria-hidden="true">
            {[
              { top: '15%', left: '10%',  w: 340, h: 220 },
              { top: '45%', left: '55%',  w: 280, h: 180 },
              { top: '70%', left: '5%',   w: 200, h: 140 },
              { top: '20%', left: '65%',  w: 180, h: 260 },
              { top: '60%', left: '35%',  w: 320, h: 200 },
            ].map((ring, ri) => (
              <div key={ri} className="absolute" style={{ top: ring.top, left: ring.left }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute rounded-[60%_40%_55%_45%/45%_55%_40%_60%] border"
                    style={{
                      width:  ring.w + i * 28,
                      height: ring.h + i * 18,
                      top:    -(i * 9),
                      left:   -(i * 14),
                      borderColor: i % 3 === 0
                        ? (theme === 'dark' ? 'rgba(100,210,200,0.55)' : 'rgba(0,120,160,0.4)')
                        : (theme === 'dark' ? 'rgba(180,200,220,0.25)' : 'rgba(30,60,100,0.18)'),
                      borderWidth: i % 3 === 0 ? '1.5px' : '1px',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: c.border }} aria-hidden="true" />
        <div className="intro-label opacity-0 absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Home / P. 001</div>
        <h1 className="sr-only">Garv Malik UX UI Designer</h1>
        
        {/* Stacked bottom-left style */}
        <div className="hero-name-wrap flex flex-col items-start gap-0 relative z-10 w-full" aria-hidden="true">
          <div className="hero-garv">
            <LayeredText text="GARV"  className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color={c.text} />
          </div>
          <div className="hero-malik">
            <LayeredText text="MALIK" className="text-[28vw] md:text-[21vw] leading-[0.82] font-black uppercase tracking-tighter" color="#ff4d00" />
          </div>
        </div>




        <div className="intro-label opacity-0 hidden md:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col items-end gap-3 text-right" aria-hidden="true">
          <div className="w-[1px] h-20 self-center" style={{ background: c.border }} />
          <p className="text-[9px] uppercase font-mono tracking-[0.25em] max-w-[160px] leading-loose" style={{ color: c.textMuted }}>UX/UI Designer<br />& Creative Developer</p>
          <div className="w-[1px] h-20 self-center" style={{ background: c.border }} />
        </div>
        <div className="intro-label opacity-0 absolute bottom-0 left-0 right-0 border-t" style={{ borderColor: c.border }}>
          <Marquee items={MARQUEE_ITEMS} speed={35} textColor={c.textMuted} />
        </div>
        {/* Issue 2 fix: scroll cue moved up from bottom-8 to bottom-16
            so it clears the marquee strip (~40px tall) and doesn't collide */}
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
              — A belief in invisible craft.<br />In feeling over function. In rawness.
            </p>
          </div>
        </blockquote>
      </section>

      {/* ── SPLIT — What I Build / What Moves Me ── */}
      <section id="about-skills" className="split-section relative min-h-screen w-full border-t flex flex-col md:flex-row px-6 md:px-16 py-28 md:py-36 gap-16 md:gap-0 transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="Skills and values">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Who Am I / P. 003</div>
        <div className="center-line absolute left-1/2 top-0 w-[1px] h-0 -translate-x-1/2 hidden md:block" style={{ background: 'rgba(255,77,0,0.22)' }} aria-hidden="true" />
        <div className="w-full md:w-1/2 md:pr-20 flex flex-col justify-center pt-10 md:pt-0">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">The Practice</p>
          <h2 className="split-header opacity-0 translate-y-6 text-6xl md:text-7xl font-black uppercase leading-[0.88] mb-10 tracking-tight" style={{ color: c.text }}>What<br />I Build</h2>
          <dl className="flex flex-col">
            <ListRow label="Design"  value="UX/UI · Design Systems"      borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Process" value="User Flows · Prototyping"     borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Tools"   value="Figma · Miro · Mural"         borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
            <ListRow label="Output"  value="AI-assisted product building" borderColor={c.border} textColor={c.textMuted} labelColor="#ff4d00" />
          </dl>
        </div>
        <div className="w-full md:w-1/2 md:pl-20 flex flex-col justify-center">
          <p className="split-header opacity-0 translate-y-6 text-[9px] uppercase text-[#ff4d00] mb-5 font-mono tracking-[0.3em]" aria-hidden="true">The Mindset</p>
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
        <Marquee items={['Selected Work', 'Case Studies', '2024–2026', 'Figma', 'UX Research', 'Interaction Design']} speed={60} reverse textColor="rgba(255,255,255,0.88)" />
      </div>

      {/* ── PROJECTS ── */}
      {/* Desktop: horizontal scroll pinned by GSAP. Mobile: vertical stack, native scroll, no GSAP */}
      {isMobile ? (
        <div id="projects" className="flex flex-col scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects">
          {projects.map((p, i) => (
            <div key={i} className="relative w-full overflow-hidden flex flex-col justify-end p-6 border-b" style={{ minHeight: '85vh', borderColor: c.border }}>
              {/* Background */}
              {p.videoSrc ? (
                <>
                  <video src={p.videoSrc} autoPlay loop muted playsInline disablePictureInPicture className="absolute inset-0 w-full h-full object-cover z-0" style={{ opacity: 0.45 }} aria-hidden="true" tabIndex={-1} />
                  <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to top, #050505 30%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.15) 100%)' }} aria-hidden="true" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0" style={{ background: p.bgGradient, opacity: 0.5 }} aria-hidden="true" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 28%, rgba(5,5,5,0.7) 55%, rgba(5,5,5,0.2) 100%)' }} aria-hidden="true" />
                </>
              )}
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-[1px] bg-[#ff4d00]" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#ff4d00]">Project 0{i + 1}</span>
                </div>
                <h2 className="text-[10vw] font-black uppercase tracking-tight mb-2 leading-[0.92]" style={{ color: p.accentColor }}>{p.title}</h2>
                <p className="font-mono text-xs mb-4 leading-relaxed" style={{ color: 'rgba(230,226,211,0.85)' }}>{p.desc}</p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map(tag => (
                    <li key={tag} className="px-2 py-1 border text-[8px] font-bold uppercase font-mono tracking-widest" style={{ borderColor: c.border, color: 'rgba(230,226,211,0.6)' }}>{tag}</li>
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
        <div id="projects" className="horizontal-section flex w-[300vw] h-screen overflow-hidden scroll-mt-[52px]" style={{ background: c.bg }} role="region" aria-label="Selected projects — scroll to explore">
          {projects.map((p, i) => <ProjectCard key={i} index={i} {...p} surfaceColor={c.surface} borderColor={c.border} />)}
        </div>
      )}

      {/* ── ABOUT ── */}
      <section id="about" className="about-section relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-28 border-t overflow-hidden transition-colors duration-300 scroll-mt-[52px]" style={{ background: c.bg, borderColor: c.border }} aria-label="About Garv Malik">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ About / P. 007</div>

        {/* WHO AM I */}
        <h2 className="flex flex-col mb-8 md:mb-12 pt-12 md:pt-0" aria-label="Who am I">
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: c.text, fontFamily: "'Bebas Neue', sans-serif" }}>WHO</span>
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: '#ff4d00', fontFamily: "'Bebas Neue', sans-serif" }}>AM I</span>
        </h2>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-14 md:gap-20 items-start">
          <ul className="flex flex-col gap-4" aria-label="Credentials">
            {['M.Sc. Human-Technology Interaction — Year 1', 'Tampere University, Finland', 'UX/UI Design · Research · Prototyping'].map(item => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d00] flex-shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-[0.22em]" style={{ color: c.textMuted }}>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            <p className="text-base md:text-lg font-mono leading-relaxed" style={{ color: c.text }}>I'm Garv, a student at Tampere University pursuing a Master's in Human-Technology Interaction.</p>
            <p className="font-mono text-sm leading-relaxed" style={{ color: c.textMuted }}>I focus on UX/UI design, blending my B.Tech background in AI and Machine Learning with human-centered design principles.</p>

            <blockquote className="border-l-2 border-[#ff4d00] pl-4">
              <p className="font-mono text-sm italic" style={{ color: c.text }}>Building, learning, and sharing the process.</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── RIGHT NOW ── */}
      <section className="now-section relative min-h-[55vh] flex flex-col justify-center px-6 md:px-16 py-24 border-t transition-colors duration-300" style={{ background: c.bg, borderColor: c.border }} aria-label="What Garv is doing right now">
        <div className="absolute top-16 left-6 md:left-10 text-[9px] uppercase font-mono italic text-[#ff4d00] tracking-[0.25em]" aria-hidden="true">/ Right Now / P. 008</div>
        <h2 className="now-item opacity-0 flex flex-col mb-10 md:mb-14" aria-label="Right Now">
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: c.text, fontFamily: "'Bebas Neue', sans-serif" }}>RIGHT</span>
          <span className="text-[22vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-[-0.02em]" style={{ color: '#ff4d00', fontFamily: "'Bebas Neue', sans-serif" }}>NOW</span>
        </h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 font-mono">
          {[
            { label: 'Listening', value: 'Pink Floyed\nGorillaz' },
            { label: 'Reading',   value: "1984\nHarry Potter and the Chamber of Secrets" },
            { label: 'Building',  value: 'Talos - AI Medical Screen' },
            { label: 'Wearing',   value: "D&G\nLight Blue Intense" },
          ].map(({ label, value }) => (
            <div key={label} className="now-item opacity-0">
              <dt className="text-[9px] text-[#ff4d00] uppercase tracking-[0.3em] mb-3">{label}</dt>
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
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#ff4d00] mb-6 font-bold">Let's make something that means something.</p>
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
          <p className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: c.textFaint }}>© 2026 Garv Malik — Built Raw</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t py-1" style={{ borderColor: c.border }} aria-hidden="true">
          <Marquee items={['Available for work', 'UX/UI Design', 'Interaction Design', 'Open to collaboration', 'Tampere, Finland']} speed={30} textColor={c.textFaint} />
        </div>
      </footer>
    </main>
  )
}