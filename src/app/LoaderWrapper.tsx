'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function LoaderWrapper() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  // Skip on return visits within the same browser session (no re-flash on navigation)
  useLayoutEffect(() => {
    if (sessionStorage.getItem('portfolioLoaderSeen')) setGone(true)
  }, [])

  useEffect(() => {
    if (gone) return

    // Respect reduced-motion — no artificial delay
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }

    const obj = { val: 0 }
    const counterEl = overlayRef.current?.querySelector<HTMLElement>('.l-num')
    const barEl     = overlayRef.current?.querySelector<HTMLElement>('.l-bar')

    const tl = gsap.timeline()

    // Count 0 → 100% over 1.2s, then fade the overlay out
    tl.to(obj, {
      val: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate() {
        if (counterEl) counterEl.textContent = Math.round(obj.val) + '%'
        if (barEl)     barEl.style.width     = obj.val + '%'
      },
    }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in',
      onComplete() {
        sessionStorage.setItem('portfolioLoaderSeen', '1')
        setGone(true)
      },
    }, '+=0.05')

    return () => { tl.kill() }
  }, [gone])

  if (gone) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-center px-8 md:px-16"
      style={{ background: '#050505' }}
      aria-hidden="true"
    >
      {/* Percentage counter */}
      <span
        className="l-num text-[10px] font-mono font-bold tracking-[0.3em] tabular-nums mb-3"
        style={{ color: '#ff4d00' }}
      >
        0%
      </span>

      {/* Progress bar track + fill */}
      <div
        className="relative h-px w-40 md:w-64"
        style={{ background: 'rgba(255,77,0,0.15)' }}
      >
        <div
          className="l-bar absolute top-0 left-0 h-full"
          style={{ width: '0%', background: '#ff4d00' }}
        />
      </div>
    </div>
  )
}
