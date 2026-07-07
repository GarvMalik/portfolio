'use client'
/**
 * LoaderController — orchestrates the cinematic loading experience.
 *
 * Responsibilities:
 *   · decide which cut plays: full cinematic (first visit of session),
 *     quick 300 ms fade (return visit), or nothing (reduced motion)
 *   · lock scrolling while the cinematic runs, release at reveal
 *   · mount EnergyLine + EnergyBurst inside the overlay and hand them
 *     to AnimationTimeline
 *   · broadcast `cine:reveal` so the page plays HomepageReveal in sync
 *
 * The overlay renders opaque in SSR HTML, so there is never a flash of
 * unstyled homepage before the sequence starts.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import EnergyLine from './EnergyLine'
import EnergyBurst from './EnergyBurst'
import { buildCinematicTimeline, buildQuickFade } from './AnimationTimeline'
import { REVEAL_EVENT } from './HomepageReveal'

const SESSION_KEY = 'portfolioLoaderSeen'

declare global {
  // set once the reveal signal has fired, for late-mounting listeners
  interface Window { __cineRevealed?: boolean }
}

function broadcastReveal(fast: boolean) {
  window.__cineRevealed = true
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT, { detail: { fast } }))
}

export default function LoaderController() {
  const rootRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)
  const [returnVisit, setReturnVisit] = useState(false)

  // Before paint: decide the cut. Reduced motion skips everything.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      broadcastReveal(true)
      setGone(true)
      return
    }
    // ?cinematic forces a full replay (the loader is once-per-session
    // by design, which makes it easy to think it "stopped working")
    const force = new URLSearchParams(window.location.search).has('cinematic')
    if (force) sessionStorage.removeItem(SESSION_KEY)
    if (!force && sessionStorage.getItem(SESSION_KEY)) setReturnVisit(true)
  }, [])

  useEffect(() => {
    if (gone || !rootRef.current) return
    const root = rootRef.current

    // Phase 1 contract: no scrolling, no interaction underneath
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const release = () => { document.body.style.overflow = prevOverflow }

    const common = {
      root,
      onReveal: () => {
        release()
        sessionStorage.setItem(SESSION_KEY, '1')
        broadcastReveal(returnVisit)
      },
      onComplete: () => setGone(true),
    }

    const tl = returnVisit
      ? buildQuickFade(common)
      : buildCinematicTimeline({ ...common, veil: veilRef.current! })

    // If the tab is hidden (rAF frozen) skip straight to the finished
    // state — never leave a visitor stuck behind the veil.
    const onVis = () => {
      if (document.visibilityState !== 'hidden') return
      tl.kill()
      common.onReveal()
      common.onComplete()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      release()
      tl.kill()
    }
  }, [gone, returnVisit])

  if (gone) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Near-black veil — Phase 1's "absolute visual silence" */}
      <div ref={veilRef} className="absolute inset-0" style={{ background: 'var(--cine-bg)' }} />
      {!returnVisit && (
        <>
          <EnergyBurst />
          <EnergyLine />
        </>
      )}
    </div>
  )
}
