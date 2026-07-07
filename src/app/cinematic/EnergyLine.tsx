'use client'
/**
 * EnergyLine — Phase 2 of the cinematic (300–700 ms).
 *
 * An 80 px accent-colored line at dead center that charges up:
 * a soft radial glow behind it swells while a bright core layer
 * rises to full intensity. All animation is driven externally by
 * AnimationTimeline through the refs — this module is purely visual.
 *
 * Glow is a radial-gradient div (scaled via transform), NOT box-shadow
 * or CSS blur, so every frame stays on the compositor.
 */
import { forwardRef } from 'react'

export type EnergyLineRefs = {
  glow: HTMLDivElement | null
  line: HTMLDivElement | null
  core: HTMLDivElement | null
}

const EnergyLine = forwardRef<HTMLDivElement, object>(function EnergyLine(_, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      {/* Radial charge glow behind the line */}
      <div
        data-cine="glow"
        className="absolute"
        style={{
          width: '46vmax',
          height: '46vmax',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--cine-primary) 26%, transparent) 0%, color-mix(in srgb, var(--cine-primary) 8%, transparent) 32%, transparent 62%)',
          opacity: 0,
          transform: 'scale(0.55)',
          willChange: 'transform, opacity',
        }}
      />
      {/* The line itself — 80px, accent color, soft edges */}
      <div
        data-cine="line"
        className="absolute"
        style={{
          width: 80,
          height: 2,
          borderRadius: 2,
          background:
            'linear-gradient(to right, transparent 0%, var(--cine-primary) 18%, var(--cine-primary) 82%, transparent 100%)',
          opacity: 0,
          transform: 'scaleX(0.18)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Bright core — rises to white-hot as energy builds */}
        <div
          data-cine="core"
          className="absolute inset-0"
          style={{
            borderRadius: 2,
            background:
              'linear-gradient(to right, transparent 8%, #fff8f2 46%, #ffffff 50%, #fff8f2 54%, transparent 92%)',
            opacity: 0,
            willChange: 'opacity',
          }}
        />
      </div>
    </div>
  )
})

export default EnergyLine
