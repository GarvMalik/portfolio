'use client'
/**
 * AnimationTimeline — the master GSAP sequence for the cinematic.
 *
 * One timeline, five phases, every stage flowing into the next:
 *
 *   0.00–0.30  Phase 1  Silence — near-black veil, nothing else
 *   0.30–0.70  Phase 2  Energy — 80px line charges at center
 *   0.70–1.20  Phase 3  Burst — liquid light ribbons + white flash
 *   1.20–1.80  Phase 4  Formation — veil lifts, energy melts into the
 *                        living FluidBackground already animating below
 *   1.80–      Phase 5  Reveal — `onReveal` fires; HomepageReveal takes
 *                        over and staggers the interface in
 *
 * Everything animates transform/opacity only. The requested easing
 * cubic-bezier(0.22,1,0.36,1) ≈ GSAP "power4.out" (0.23,1,0.32,1);
 * accelerations use power2/power3.in so energy gathers naturally.
 */
import gsap from 'gsap'

export const CINE_EASE = 'power4.out'

export type CinematicHandles = {
  root: HTMLDivElement       // full-screen overlay wrapper
  veil: HTMLDivElement       // opaque background layer inside overlay
  onReveal: () => void       // fired at 1.8 s — homepage starts appearing
  onComplete: () => void     // fired when overlay can unmount
}

export function buildCinematicTimeline({ root, veil, onReveal, onComplete }: CinematicHandles) {
  const q = gsap.utils.selector(root)
  const glow = q('[data-cine="glow"]')
  const line = q('[data-cine="line"]')
  const core = q('[data-cine="core"]')
  const ribbons = q('[data-cine="ribbon"]')
  const flash = q('[data-cine="flash"]')

  const tl = gsap.timeline({ defaults: { ease: CINE_EASE } })

  /* ── Phase 1 · Silence (0–0.3s) — veil already opaque, hold ── */
  tl.set(root, { autoAlpha: 1 }, 0)

  /* ── Phase 2 · Energy gathers (0.3–0.7s) ── */
  tl.to(line, { opacity: 1, duration: 0.18, ease: 'power1.inOut' }, 0.30)
    .to(line, { scaleX: 1, duration: 0.42, ease: 'power2.inOut' }, 0.30)
    .to(core, { opacity: 1, duration: 0.38, ease: 'power2.in' }, 0.34)
    .to(glow, { opacity: 0.5, scale: 1, duration: 0.45, ease: 'power2.inOut' }, 0.32)

  /* ── Phase 3 · Burst (0.7–1.2s) ── */
  // the line overloads: final stretch + vanish as the flash ignites
  tl.to(line, { scaleX: 2.4, opacity: 0, duration: 0.16, ease: 'power2.in' }, 0.70)
    .to(glow, { scale: 1.7, opacity: 0.75, duration: 0.2, ease: 'power2.in' }, 0.70)

  // white-hot flash — peak of the whole sequence
  tl.to(flash, { opacity: 0.9, scale: 1, duration: 0.28, ease: 'power3.out' }, 0.78)

  // liquid ribbons flow outward, staggered, each drifting a few degrees
  // as it expands so the motion reads organic rather than geometric
  ribbons.forEach((el, i) => {
    const t0 = 0.74 + i * 0.05
    const drift = (i % 2 === 0 ? 1 : -1) * (6 + i * 2)
    tl.to(el, {
      opacity: 0.4 + (i % 3) * 0.15,
      duration: 0.3,
      ease: 'power2.out',
    }, t0)
    tl.to(el, {
      scale: 2.6 + (i % 3) * 0.7,
      rotate: `+=${drift}`,
      duration: 1.15,
      ease: 'power3.out',
    }, t0)
  })

  /* ── Phase 4 · Liquid formation (1.2–1.8s) — energy melts into the page ── */
  tl.to(flash, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 1.18)
    .to(glow, { opacity: 0, scale: 2.2, duration: 0.5, ease: 'power2.inOut' }, 1.20)
    .to(ribbons, {
      opacity: 0,
      duration: 0.58,
      ease: 'power2.inOut',
      stagger: 0.04,
    }, 1.24)
    // the dark veil dissolves — FluidBackground (already alive underneath)
    // shows through, so the burst colors "become" the homepage background
    .to(veil, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.20)

  /* ── Phase 5 · Handoff ── */
  tl.call(onReveal, [], 1.80)
  tl.to(root, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, 1.95)
  tl.call(onComplete, [], 2.25)

  return tl
}

/** Return-visit path: no cinematic, just a fast 300 ms veil fade. */
export function buildQuickFade({ root, onReveal, onComplete }: Omit<CinematicHandles, 'veil'>) {
  const tl = gsap.timeline()
  tl.call(onReveal, [], 0.02)
  tl.to(root, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 0.02)
  tl.call(onComplete, [], 0.35)
  return tl
}
