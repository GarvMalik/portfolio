"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef  = useRef<HTMLDivElement>(null)
  const garvRef    = useRef<HTMLDivElement>(null)
  const malikRef   = useRef<HTMLDivElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check session AFTER mount — never during SSR
    try {
      const already = sessionStorage.getItem('gm-loaded')
      if (already) {
        onComplete()
        return
      }
    } catch {
      // sessionStorage unavailable (private mode edge case) — skip loader
      onComplete()
      return
    }

    // Show the loader now that we confirmed it's the first visit
    setShow(true)
  }, [onComplete])

  useEffect(() => {
    if (!show) return

    // Mark as loaded now so refresh always skips the loader
    try { sessionStorage.setItem('gm-loaded', '1') } catch {}

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      const t = setTimeout(onComplete, 300)
      return () => clearTimeout(t)
    }

    // Lock scroll only after confirming loader is visible
    document.body.style.overflow = 'hidden'

    gsap.set([garvRef.current, malikRef.current], { yPercent: 110 })
    gsap.set(labelRef.current, { opacity: 0 })
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete()
      },
    })

    tl
      .to(garvRef.current,  { yPercent: 0, duration: 0.75, ease: 'power4.out' }, 0.1)
      .to(malikRef.current, { yPercent: 0, duration: 0.75, ease: 'power4.out' }, 0.2)
      .to(labelRef.current, { opacity: 1, duration: 0.4,   ease: 'power2.out' }, 0.65)
      .to(barRef.current,   { scaleX: 1, duration: 0.85,   ease: 'power2.inOut' }, 0.7)
      .to({}, { duration: 0.2 })
      .to(overlayRef.current, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' })

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
      role="status"
      aria-label="Loading"
    >
      {/* Exit wipe overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: '#050505' }}
        aria-hidden="true"
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
          opacity: 0.05,
        }}
        aria-hidden="true"
      />

      {/* Name */}
      <div className="relative z-[1] flex flex-col items-center select-none">
        <div className="overflow-hidden leading-none">
          <div
            ref={garvRef}
            className="font-black uppercase tracking-tighter leading-[0.85]"
            style={{
              fontSize: 'clamp(80px, 20vw, 200px)',
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
            className="font-black uppercase tracking-tighter leading-[0.85]"
            style={{
              fontSize: 'clamp(80px, 20vw, 200px)',
              color: '#ff4d00',
              fontFamily: 'var(--font-bebas), sans-serif',
            }}
            aria-hidden="true"
          >
            MALIK
          </div>
        </div>

        <p
          ref={labelRef}
          className="mt-5 text-[9px] uppercase tracking-[0.35em]"
          style={{
            color: '#a09c8f',
            fontFamily: 'var(--font-jetbrains), monospace',
          }}
        >
          UX/UI Designer · Tampere, Finland
        </p>

        {/* Progress bar */}
        <div
          className="mt-5 h-[2px] overflow-hidden"
          style={{ width: 'clamp(200px, 40vw, 300px)', background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        >
          <div
            ref={barRef}
            className="h-full w-full"
            style={{ background: '#ff4d00' }}
          />
        </div>
      </div>

      <p
        className="absolute bottom-8 text-[8px] uppercase tracking-[0.3em] z-[1]"
        style={{ color: '#3a3836', fontFamily: 'var(--font-jetbrains), monospace' }}
        aria-hidden="true"
      >
        Portfolio 2026
      </p>
    </div>
  )
}
