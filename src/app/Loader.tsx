"use client"

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const LINE_COUNT = 18 // number of sweep lines

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const linesRef     = useRef<(HTMLDivElement | null)[]>([])
  const labelRef     = useRef<HTMLDivElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const [show, setShow]   = useState(false)

  // ── Step 1: check session after mount ────────────────────────────────────
  useEffect(() => {
    try {
      if (sessionStorage.getItem('gm-loaded')) {
        onComplete()
        return
      }
    } catch {
      onComplete()
      return
    }
    setShow(true)
  }, [onComplete])

  // ── Step 2: run animation only after show=true ────────────────────────────
  useEffect(() => {
    if (!show) return

    try { sessionStorage.setItem('gm-loaded', '1') } catch {}
    document.body.style.overflow = 'hidden'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(() => {
        document.body.style.overflow = ''
        onComplete()
      }, 400)
      return () => clearTimeout(t)
    }

    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[]

    // Set all lines starting off-screen left
    gsap.set(lines, { x: '-100%', opacity: 1 })
    gsap.set(labelRef.current, { opacity: 0, y: 8 })
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete()
      },
    })

    // ── Phase 1 (0–1.2s): lines sweep in from left, staggered ──────────────
    // Each line sweeps from x:-100% to x:0 at slightly different speeds
    // creating a wave / matrix feel
    lines.forEach((line, i) => {
      const delay  = i * 0.055           // stagger each line
      const dur    = 0.55 + Math.random() * 0.3  // vary speed slightly
      tl.to(line, {
        x: '0%',
        duration: dur,
        ease: 'power2.inOut',
      }, delay)
    })

    // ── Phase 2 (1.2–2.0s): label + progress bar appear ───────────────────
    tl.to(labelRef.current, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
    }, 1.1)
    tl.to(progressRef.current, {
      scaleX: 1, duration: 0.9, ease: 'power2.inOut',
    }, 1.1)

    // ── Phase 3 (2.2–3.0s): lines sweep out to the right ──────────────────
    lines.forEach((line, i) => {
      const delay = 2.2 + i * 0.045
      const dur   = 0.5 + Math.random() * 0.25
      tl.to(line, {
        x: '100%',
        duration: dur,
        ease: 'power2.inOut',
      }, delay)
    })

    // ── Phase 4 (3.0s): page wipes in from bottom ─────────────────────────
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.65,
      ease: 'power3.inOut',
    }, 3.0)

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [show, onComplete])

  if (!show) return null

  // Generate line heights — varied to look organic
  const lineHeights = Array.from({ length: LINE_COUNT }, (_, i) => {
    const base = 100 / LINE_COUNT
    return base
  })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden"
      style={{ background: '#050505' }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* ── Grain ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
          opacity: 0.04,
        }}
        aria-hidden="true"
      />

      {/* ── Sweep lines ── */}
      <div className="absolute inset-0 z-[1] flex flex-col" aria-hidden="true">
        {Array.from({ length: LINE_COUNT }).map((_, i) => {
          // Alternate between orange, cream, and dark grey for visual depth
          const colors = [
            'rgba(255,77,0,0.55)',
            'rgba(230,226,211,0.12)',
            'rgba(255,77,0,0.25)',
            'rgba(230,226,211,0.07)',
            'rgba(255,77,0,0.40)',
            'rgba(100,100,100,0.15)',
          ]
          const color = colors[i % colors.length]
          return (
            <div
              key={i}
              ref={el => { linesRef.current[i] = el }}
              className="w-full flex-1"
              style={{
                background: color,
                // Slight height variation per line for organic feel
                flexGrow: i % 3 === 0 ? 1.4 : i % 5 === 0 ? 0.6 : 1,
              }}
            />
          )
        })}
      </div>

      {/* ── Center label + bar ── */}
      <div
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center pointer-events-none"
      >
        <div ref={labelRef} className="flex flex-col items-center gap-4">
          {/* Name — small, refined, not huge */}
          <div className="flex flex-col items-center leading-none select-none">
            <span
              className="tracking-[0.15em] uppercase"
              style={{
                fontSize: 'clamp(11px, 1.4vw, 14px)',
                color: '#a09c8f',
                fontFamily: 'var(--font-jetbrains), monospace',
                letterSpacing: '0.35em',
              }}
            >
              GARV MALIK
            </span>
            <span
              className="tracking-[0.4em] uppercase mt-1"
              style={{
                fontSize: 'clamp(9px, 1vw, 11px)',
                color: '#ff4d00',
                fontFamily: 'var(--font-jetbrains), monospace',
                letterSpacing: '0.45em',
              }}
            >
              UX/UI DESIGNER · TAMPERE
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-[1.5px] overflow-hidden"
            style={{
              width: 'clamp(160px, 25vw, 240px)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <div
              ref={progressRef}
              className="h-full w-full"
              style={{ background: '#ff4d00' }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom corner label ── */}
      <p
        className="absolute bottom-6 right-8 z-[2]"
        style={{
          fontSize: '8px',
          color: '#2a2a2a',
          fontFamily: 'var(--font-jetbrains), monospace',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
        aria-hidden="true"
      >
        Portfolio 2026
      </p>

      {/* ── Top left corner label ── */}
      <p
        className="absolute top-6 left-8 z-[2]"
        style={{
          fontSize: '8px',
          color: '#2a2a2a',
          fontFamily: 'var(--font-jetbrains), monospace',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
        aria-hidden="true"
      >
        / Garv Malik / Vol. 1
      </p>
    </div>
  )
}
