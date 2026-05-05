"use client"
/**
 * Loader.tsx
 * Full-screen intro loader that plays once per session.
 * - Matches portfolio brand exactly (dark bg, orange accent, Bebas Neue / JetBrains Mono)
 * - Uses sessionStorage so it only plays on first visit per tab, not on every navigation
 * - GSAP timeline: name sweeps in → progress bar fills → exit wipe up
 * - Respects prefers-reduced-motion: skips animation, fades out instantly
 * - Locks body scroll while visible, restores on exit
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef    = useRef<HTMLDivElement>(null)
  const garvRef      = useRef<HTMLDivElement>(null)
  const malikRef     = useRef<HTMLDivElement>(null)
  const barRef       = useRef<HTMLDivElement>(null)
  const labelRef     = useRef<HTMLParagraphElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)

  // Whether to even show the loader this session
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show loader once per browser session
    const already = sessionStorage.getItem('gm-loaded')
    if (already) {
      onComplete()
      return
    }
    sessionStorage.setItem('gm-loaded', '1')
    setVisible(true)

    // Lock scroll while loader is visible
    document.body.style.overflow = 'hidden'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      // Skip all animation — just wait a beat then exit
      const t = setTimeout(() => {
        document.body.style.overflow = ''
        onComplete()
      }, 400)
      return () => clearTimeout(t)
    }

    // ── GSAP timeline ────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete()
      },
    })

    // Set initial states
    gsap.set([garvRef.current, malikRef.current], { yPercent: 110 })
    gsap.set(labelRef.current, { opacity: 0 })
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(overlayRef.current, { yPercent: 0 })

    tl
      // 1 — Name sweeps in from below
      .to(garvRef.current, {
        yPercent: 0, duration: 0.8, ease: 'power4.out',
      }, 0.1)
      .to(malikRef.current, {
        yPercent: 0, duration: 0.8, ease: 'power4.out',
      }, 0.18)

      // 2 — Label fades in
      .to(labelRef.current, {
        opacity: 1, duration: 0.4, ease: 'power2.out',
      }, 0.6)

      // 3 — Progress bar fills
      .to(barRef.current, {
        scaleX: 1, duration: 0.9, ease: 'power2.inOut',
      }, 0.7)

      // 4 — Brief pause at full
      .to({}, { duration: 0.15 })

      // 5 — Overlay wipes up, revealing the site beneath
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power3.inOut',
      })

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [onComplete])

  // If already loaded this session, render nothing
  if (!visible) return null

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
      aria-label="Loading portfolio"
      aria-live="polite"
      role="status"
    >
      {/* Wipe overlay — slides up on exit */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{ background: '#050505' }}
        aria-hidden="true"
      />

      {/* Grain texture — matches site */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          opacity: 0.055,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[1] flex flex-col items-center select-none">

        {/* GARV + MALIK — overflow hidden clips the sweep-in */}
        <div className="overflow-hidden leading-none">
          <div
            ref={garvRef}
            className="text-[22vw] md:text-[18vw] font-black uppercase tracking-tighter leading-[0.85]"
            style={{
              color: '#e6e2d3',
              fontFamily: 'var(--font-bebas), sans-serif',
            }}
            aria-hidden="true"
          >
            GARV
          </div>
        </div>
        <div className="overflow-hidden leading-none">
          <div
            ref={malikRef}
            className="text-[22vw] md:text-[18vw] font-black uppercase tracking-tighter leading-[0.85]"
            style={{
              color: '#ff4d00',
              fontFamily: 'var(--font-bebas), sans-serif',
            }}
            aria-hidden="true"
          >
            MALIK
          </div>
        </div>

        {/* Label */}
        <p
          ref={labelRef}
          className="mt-6 text-[9px] uppercase tracking-[0.35em]"
          style={{
            color: '#a09c8f',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          UX/UI Designer · Tampere, Finland
        </p>

        {/* Progress bar */}
        <div
          className="mt-6 w-[min(280px,60vw)] h-[2px] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        >
          <div
            ref={barRef}
            className="h-full w-full"
            style={{ background: '#ff4d00' }}
          />
        </div>

      </div>

      {/* Bottom label */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center z-[1]"
        aria-hidden="true"
      >
        <p
          className="text-[8px] uppercase tracking-[0.3em]"
          style={{
            color: '#4a4746',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          Portfolio 2026
        </p>
      </div>
    </div>
  )
}
