'use client'
/**
 * EnergyBurst — Phase 3 of the cinematic (700–1200 ms).
 *
 * The line releases its energy as liquid light: seven elongated
 * gradient ribbons flow outward from center at organic angles, plus a
 * full-viewport flash that peaks white-hot and dissolves into the
 * brand wash. No particles, no geometry — soft elliptical gradients
 * stretched and rotated so the expansion reads as fluid sheets.
 *
 * Purely presentational; AnimationTimeline drives every ribbon via
 * the [data-cine="ribbon"] and [data-cine="flash"] hooks.
 */

/* angle°, aspect (w:h), color var, peak opacity — hand-tuned for organic spread */
const RIBBONS: { angle: number; w: number; h: number; color: string; peak: number }[] = [
  { angle: 0,    w: 130, h: 34, color: 'var(--cine-primary)',   peak: 0.85 },
  { angle: 24,   w: 110, h: 26, color: 'var(--cine-accent)',    peak: 0.55 },
  { angle: -31,  w: 118, h: 30, color: 'var(--cine-primary)',   peak: 0.6  },
  { angle: 63,   w: 95,  h: 40, color: 'var(--cine-secondary)', peak: 0.5  },
  { angle: -70,  w: 90,  h: 36, color: 'var(--cine-secondary)', peak: 0.45 },
  { angle: 105,  w: 100, h: 30, color: 'var(--cine-blue)',      peak: 0.35 },
  { angle: -118, w: 108, h: 28, color: 'var(--cine-accent)',    peak: 0.5  },
]

export { RIBBONS }

export default function EnergyBurst() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      {RIBBONS.map((r, i) => (
        <div
          key={i}
          data-cine="ribbon"
          className="absolute"
          style={{
            width: `${r.w}vmin`,
            height: `${r.h}vmin`,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, color-mix(in srgb, ${r.color} 55%, transparent) 0%, color-mix(in srgb, ${r.color} 18%, transparent) 42%, transparent 70%)`,
            opacity: 0,
            transform: `rotate(${r.angle}deg) scale(0.08)`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      {/* White-hot center flash — the brightest instant of the sequence */}
      <div
        data-cine="flash"
        className="absolute"
        style={{
          width: '120vmax',
          height: '120vmax',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, #fff6ee 0%, color-mix(in srgb, var(--cine-primary) 65%, transparent) 22%, color-mix(in srgb, var(--cine-primary) 20%, transparent) 48%, transparent 70%)',
          opacity: 0,
          transform: 'scale(0.2)',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
