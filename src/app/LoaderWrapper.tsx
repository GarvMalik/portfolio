'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function LoaderWrapper() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const unitRef = useRef<HTMLDivElement>(null)
  const numRef  = useRef<HTMLSpanElement>(null)
  const barRef  = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  // Skip immediately on return visits (before paint — no flash)
  useLayoutEffect(() => {
    if (sessionStorage.getItem('portfolioLoaderSeen')) setGone(true)
  }, [])

  useEffect(() => {
    if (gone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }

    const obj = { pct: 0 }

    const tl = gsap.timeline()

    // Phase 1 — counter + comet travel left → right over 3 s
    tl.to(obj, {
      pct: 100,
      duration: 3,
      ease: 'none',
      onUpdate() {
        if (numRef.current)  numRef.current.textContent = Math.round(obj.pct) + '%'
        if (unitRef.current) unitRef.current.style.left  = obj.pct + '%'
        // Bar shrinks from 8px → 0 as progress goes 75% → 100%
        if (barRef.current) {
          const h = obj.pct < 75 ? 8 : Math.max(0, 8 * (1 - (obj.pct - 75) / 25))
          barRef.current.style.height = h + 'px'
          barRef.current.style.top    = (-h / 2) + 'px'
        }
      },
    })

    // Phase 2 — bar/indicator vanishes at 100%
    .to(unitRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    }, '+=0')

    // Phase 3 — brief hold, then fade the black overlay away
    .to(wrapRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete() {
        sessionStorage.setItem('portfolioLoaderSeen', '1')
        setGone(true)
      },
    }, '+=0.15')

    return () => { tl.kill() }
  }, [gone])

  if (gone) return null

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[99999] overflow-hidden"
      style={{ background: '#050505' }}
      aria-hidden="true"
    >
      {/*
        Zero-width anchor that sweeps from left:0% → left:100%.
        All children are absolutely positioned and extend LEFTWARD,
        so the comet bar trails behind the indicator as it moves right.
      */}
      <div
        ref={unitRef}
        style={{
          position: 'absolute',
          left: '0%',
          top: '50%',
          width: 0,
          height: 0,
          overflow: 'visible',
        }}
      >
        {/* Filled square — sits at the leading tip */}
        <div style={{
          position: 'absolute',
          top: -30,
          left: 0,
          width: 7,
          height: 7,
          background: '#ff4d00',
        }} />

        {/* Percentage text — to the right of the square */}
        <span
          ref={numRef}
          style={{
            position: 'absolute',
            top: -33,
            left: 13,
            color: '#ffffff',
            fontSize: '11px',
            fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
            fontWeight: 500,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          0%
        </span>

        {/* Dashed vertical connector — from under the square down to the bar */}
        <div style={{
          position: 'absolute',
          top: -20,
          left: 3,
          width: '1px',
          height: '18px',
          borderLeft: '1px dashed rgba(255, 255, 255, 0.25)',
        }} />

        {/* Comet bar — 240 px wide, trails LEFT behind the anchor */}
        <div ref={barRef} style={{
          position: 'absolute',
          top: '-4px',
          left: '-240px',  /* bar starts 240 px to the left of anchor */
          right: '3px',    /* right tip sits 3 px right of anchor */
          height: '8px',
          background: 'linear-gradient(to right, transparent 0%, rgba(255,77,0,0.10) 15%, rgba(255,77,0,0.50) 55%, rgba(255,100,40,0.92) 80%, #ffffff 100%)',
          boxShadow: '0 0 6px rgba(255,77,0,0.45), 0 0 18px rgba(255,77,0,0.18)',
        }} />
      </div>
    </div>
  )
}
