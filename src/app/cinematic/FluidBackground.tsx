'use client'
/**
 * FluidBackground — the homepage's permanently-living background.
 *
 * Four independent layers (see globals.css for the BackgroundAnimator
 * keyframes — all compositor-only transform/opacity, zero JS per frame):
 *   1. .fluid-1     large radial field, 36 s drift
 *   2. .fluid-2     soft mesh gradient, 47 s counter-drift
 *   3. .fluid-3     lighting bloom, 13 s opacity breathing
 *   4. .fluid-noise static noise tile that removes gradient banding
 *
 * Durations are mutually prime-ish so the composite never visibly loops.
 * prefers-reduced-motion freezes the drift via the global CSS rule —
 * the gradients remain as a static wash.
 */
export default function FluidBackground({ theme, slow = false }: { theme: 'dark' | 'light'; slow?: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${theme === 'light' ? 'fluid-light' : ''} ${slow ? 'fluid-slow' : ''}`}
      aria-hidden="true"
    >
      <div className="fluid-layer fluid-1" />
      <div className="fluid-layer fluid-2" />
      <div className="fluid-layer fluid-3" />
      <div className="fluid-layer fluid-noise" />
    </div>
  )
}
