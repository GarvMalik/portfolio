'use client'
/**
 * HomepageReveal — Phase 5: the interface is born out of light.
 *
 * Sequenced, never simultaneous:
 *   navbar    fade + y(-20→0), 500 ms
 *   title     whole heading (no per-letter), opacity + y(30→0) + blur(8→0), 700 ms
 *   desc      opacity + y(20→0), 500 ms
 *   CTAs      scale(0.96→1) + fade, 400 ms
 *   deco      floating labels/marquee/scroll hint, last and subtle
 *
 * Elements are marked with .cine-nav / .cine-title / .cine-desc /
 * .cine-cta / .cine-deco. The loader dispatches `cine:reveal`
 * (detail.fast for return visits) — page.tsx calls this on receipt.
 *
 * All tweens are fromTo: nothing is class-hidden, so reduced-motion
 * users and no-JS crawlers always see a complete page.
 */
import gsap from 'gsap'
import { CINE_EASE } from './AnimationTimeline'

export const REVEAL_EVENT = 'cine:reveal'

export function playHomepageReveal(scope: HTMLElement, { fast = false } = {}) {
  const q = gsap.utils.selector(scope)
  const k = fast ? 0.45 : 1          // return visits play a compressed cut
  const tl = gsap.timeline({ defaults: { ease: CINE_EASE } })

  tl.fromTo(q('.cine-nav'),
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.5 * k, clearProps: 'transform' }, 0)

  tl.fromTo(q('.cine-title'),
    { opacity: 0, y: 30, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 * k, clearProps: 'filter,transform' },
    0.15 * k)

  tl.fromTo(q('.cine-desc'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 * k, clearProps: 'transform' },
    0.30 * k)

  tl.fromTo(q('.cine-cta'),
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.4 * k, clearProps: 'transform' },
    0.45 * k)

  tl.fromTo(q('.cine-deco'),
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.55 * k, stagger: 0.08 * k, clearProps: 'transform' },
    0.60 * k)

  return tl
}
