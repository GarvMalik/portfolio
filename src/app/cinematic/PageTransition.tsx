'use client'
/**
 * PageTransition — cinematic "View Project" route transition.
 *
 * A curtain of illuminated glass stripes in the destination project's
 * brand color rises over the page, darkens into a near-black
 * environment, and dissolves to reveal the new page already mounted
 * underneath. Navigation happens at 0.72s, safely behind full cover.
 *
 *   0.15–0.35  overlay peeks from the bottom (~10%)
 *   0.35–0.70  curtain rises to full cover (no overshoot)
 *   0.72       router.push — the swap the user never sees
 *   0.70–1.20  stripes dim, radial dark veil takes the center
 *   1.20–1.50  stripes dissolve; faint edge glow remains
 *   1.55–1.95  veil lifts (it matches the destination bg — seamless);
 *              the project page's own entrance plays underneath
 *   2.30–2.65  edge glow dissolves; scroll unlocks; overlay unmounts
 *
 * Architecture: PageTransitionProvider (context + controller),
 * TransitionOverlay, AnimatedStripeLayer. Buttons call
 * startPageTransition(route, accent) — everything else is automatic.
 * GSAP drives the timeline (site-wide motion runtime); stripes drift
 * via pure CSS transforms. Reduced motion skips straight to push().
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

declare global {
  interface Window {
    /** true while a cinematic route transition is running — project
     *  pages delay their entrance so they reveal behind the veil */
    __ptActive?: boolean
  }
}

type TransitionJob = { route: string; accent: string; theme: 'dark' | 'light' }
type TransitionCtx = { startPageTransition: (route: string, accent?: string) => void }

const Ctx = createContext<TransitionCtx>({ startPageTransition: () => {} })
export const usePageTransition = () => useContext(Ctx)

/* ── AnimatedStripeLayer — ~40 illuminated glass panels ─────────────────── */
function AnimatedStripeLayer({ accent, base }: { accent: string; base: string }) {
  // Client-only (mounts after click) so Math.random is hydration-safe
  const stripes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    grow: 0.4 + Math.random() * 2.6,
    mix: [0, 6, 14, 24, 38, 55, 75][(Math.random() * 7) | 0],
    opacity: 0.35 + Math.random() * 0.6,
    dur: 6 + Math.random() * 6,
    dir: i % 2 === 0 ? 1 : -1,
    delay: -(Math.random() * 12),
    hot: Math.random() > 0.85,
  })), [])
  return (
    <div className="absolute inset-0 flex" aria-hidden="true">
      {stripes.map((s, i) => (
        <div
          key={i}
          className="h-full"
          style={{
            flexGrow: s.grow,
            flexBasis: 0,
            opacity: s.opacity,
            background: s.hot
              ? `linear-gradient(180deg,
                  color-mix(in srgb, ${accent} 80%, #ffffff) 0%,
                  ${accent} 45%,
                  color-mix(in srgb, ${accent} 35%, ${base}) 100%)`
              : `linear-gradient(180deg,
                  color-mix(in srgb, ${accent} ${s.mix}%, ${base}) 0%,
                  color-mix(in srgb, ${accent} ${Math.max(0, s.mix - 12)}%, ${base}) 100%)`,
            animation: `pt-drift ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
            ['--pt-dir' as string]: s.dir,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ── TransitionOverlay — the full-screen curtain ────────────────────────── */
function TransitionOverlay({ job, rootRef }: { job: TransitionJob; rootRef: React.RefObject<HTMLDivElement | null> }) {
  const dark = job.theme === 'dark'
  const bg = dark ? '#050505' : '#f5f2ec'
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[20000] overflow-hidden"
      style={{ transform: 'translateY(100%)' }}
      aria-hidden="true"
    >
      {/* opaque base — matches destination bg so the veil lift is seamless */}
      <div className="pt-fill absolute inset-0" style={{ background: bg }} />
      <div className="pt-stripes absolute inset-0">
        <AnimatedStripeLayer accent={job.accent} base={dark ? '#000000' : '#e8e4da'} />
      </div>
      {/* radial dark veil — center goes near-solid first, edges keep glowing */}
      <div
        className="pt-dark absolute inset-0"
        style={{
          opacity: 0,
          background: dark
            ? 'radial-gradient(120% 100% at 50% 50%, #030303 42%, rgba(3,3,3,0.55) 100%)'
            : 'radial-gradient(120% 100% at 50% 50%, #f5f2ec 42%, rgba(245,242,236,0.55) 100%)',
        }}
      />
      {/* faint brand edge lighting — the last thing to dissolve */}
      <div
        className="pt-edge absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          filter: 'blur(2px)',
          background: `linear-gradient(90deg,
            color-mix(in srgb, ${job.accent} 28%, transparent) 0%, transparent 14%,
            transparent 86%, color-mix(in srgb, ${job.accent} 28%, transparent) 100%)`,
        }}
      />
    </div>
  )
}

/* ── PageTransitionProvider — context + TransitionController ────────────── */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [job, setJob] = useState<TransitionJob | null>(null)
  const busyRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const startPageTransition = useCallback((route: string, accent = '#ff4d00') => {
    if (busyRef.current) return                      // one transition at a time
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(route)
      return
    }
    busyRef.current = true
    window.__ptActive = true
    try { router.prefetch(route) } catch { /* prefetch is best-effort */ }
    const theme = (localStorage.getItem('gm-theme') as 'dark' | 'light') || 'dark'
    setJob({ route, accent, theme })
  }, [router])

  // TransitionController — drives the whole sequence once the overlay mounts
  useEffect(() => {
    if (!job || !rootRef.current) return
    const root = rootRef.current
    const q = gsap.utils.selector(root)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const finish = () => {
      document.body.style.overflow = prevOverflow
      window.__ptActive = false
      busyRef.current = false
      setJob(null)
    }

    let done = false
    const tl = gsap.timeline({ onComplete: () => { done = true } })

    // rAF stops in hidden tabs, freezing GSAP mid-curtain with scroll
    // locked. If the tab hides — or 8s pass without completing — jump
    // straight to the destination and clean up.
    const fastForward = () => {
      if (done) return
      done = true
      tl.kill()
      router.push(job.route)
      finish()
    }
    const onVis = () => { if (document.visibilityState === 'hidden') fastForward() }
    document.addEventListener('visibilitychange', onVis)
    const hardStop = setTimeout(fastForward, 8000)

    tl.to(root, { yPercent: 90, duration: 0.2, ease: 'power2.out' }, 0.15)
      .to(root, { yPercent: 0, duration: 0.35, ease: 'power3.inOut' }, 0.35)
      .call(() => router.push(job.route), [], 0.72)
      .to(q('.pt-dark'), { opacity: 1, duration: 0.5, ease: 'power2.inOut' }, 0.70)
      .to(q('.pt-stripes'), { opacity: 0.45, duration: 0.5, ease: 'power2.inOut' }, 0.70)
      .to(q('.pt-edge'), { opacity: 0.6, duration: 0.4, ease: 'power2.inOut' }, 1.10)
      .to(q('.pt-stripes'), { opacity: 0, duration: 0.32, ease: 'power2.inOut' }, 1.20)
      .to([q('.pt-fill'), q('.pt-dark')], { opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 1.55)
      .to(q('.pt-edge'), { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.30)
      .call(finish, [], 2.65)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      clearTimeout(hardStop)
      tl.kill()
      finish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job])

  return (
    <Ctx.Provider value={{ startPageTransition }}>
      {children}
      {job && <TransitionOverlay job={job} rootRef={rootRef} />}
    </Ctx.Provider>
  )
}
