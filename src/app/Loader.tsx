"use client"

import { useEffect, useRef, useState } from 'react'

// Matrix characters — mix of katakana, latin, numbers
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  // ── Step 1: session check after mount ──────────────────────────────────
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

  // ── Step 2: run canvas animation once show=true ─────────────────────────
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

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const FONT_SIZE  = 14
    const COLS       = Math.floor(W / FONT_SIZE)

    // Each column tracks: y position, speed, chars
    const drops: number[] = Array(COLS).fill(0).map(() => Math.random() * -80)
    const speeds: number[] = Array(COLS).fill(0).map(() => 0.4 + Math.random() * 0.8)

    // ── Load face image, process brightness map ─────────────────────────
    let facePixels: Uint8ClampedArray | null = null
    let faceW = 0
    let faceH = 0
    const faceImg = new Image()
    faceImg.crossOrigin = 'anonymous'
    faceImg.src = '/garv_face.jpg'

    faceImg.onload = () => {
      const off    = document.createElement('canvas')
      off.width    = Math.floor(W / FONT_SIZE)
      off.height   = Math.floor(H / FONT_SIZE)
      const offCtx = off.getContext('2d')!
      offCtx.drawImage(faceImg, 0, 0, off.width, off.height)
      const data   = offCtx.getImageData(0, 0, off.width, off.height)
      facePixels   = data.data
      faceW        = off.width
      faceH        = off.height
    }

    // ── Phase tracking ──────────────────────────────────────────────────
    // Phase 0: pure rain (0 – 2.8s)
    // Phase 1: face emerges from rain (2.8 – 4.8s)
    // Phase 2: face holds, rain slows (4.8 – 6.2s)
    // Phase 3: fade out (6.2 – 7.0s)
    const START      = performance.now()
    const P1_START   = 2800
    const P2_START   = 4800
    const P3_START   = 6200
    const P3_END     = 7000

    let animId: number
    let done = false

    const getChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

    const draw = () => {
      const now     = performance.now()
      const elapsed = now - START
      const phase   = elapsed < P1_START ? 0
                    : elapsed < P2_START ? 1
                    : elapsed < P3_START ? 2
                    : 3

      // Fade-to-black trail
      ctx.fillStyle = 'rgba(5,5,5,0.12)'
      ctx.fillRect(0, 0, W, H)

      ctx.font = `bold ${FONT_SIZE}px monospace`

      const faceProgress = phase === 1
        ? (elapsed - P1_START) / (P2_START - P1_START)  // 0→1 during phase 1
        : phase >= 2 ? 1 : 0

      for (let col = 0; col < COLS; col++) {
        const x  = col * FONT_SIZE
        const y  = drops[col] * FONT_SIZE
        const ch = getChar()

        // ── Sample face brightness at this column/row ──────────────────
        let faceBrightness = 0
        if (facePixels && faceProgress > 0) {
          // Map canvas column to face image column
          const fx = Math.floor((col / COLS) * faceW)
          const fy = Math.floor(((drops[col] % (H / FONT_SIZE)) / (H / FONT_SIZE)) * faceH)
          const idx = (fy * faceW + fx) * 4
          if (idx >= 0 && idx < facePixels.length) {
            const r = facePixels[idx]
            const g = facePixels[idx + 1]
            const b = facePixels[idx + 2]
            faceBrightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
          }
        }

        // ── Color: blend between pure rain green and face-mapped orange/cream ──
        if (faceProgress > 0 && faceBrightness > 0.25) {
          // Face highlight: use orange for bright areas, dark for shadows
          const t = faceProgress * faceBrightness
          if (faceBrightness > 0.7) {
            // Very bright areas — cream/white
            const v = Math.floor(180 + faceBrightness * 75)
            ctx.fillStyle = `rgba(${v},${Math.floor(v*0.97)},${Math.floor(v*0.87)},${Math.min(1, t * 1.4)})`
          } else if (faceBrightness > 0.45) {
            // Mid tones — orange
            ctx.fillStyle = `rgba(255,${Math.floor(77 + faceBrightness * 60)},0,${Math.min(1, t * 1.2)})`
          } else {
            // Shadows — dim green
            ctx.fillStyle = `rgba(0,${Math.floor(80 + faceBrightness * 120)},0,${Math.min(0.7, t)})`
          }
        } else {
          // Pure matrix rain — head of column is bright, trail fades
          const isHead = drops[col] > 0 && Math.abs(y - (drops[col] - 1) * FONT_SIZE) < FONT_SIZE * 1.5
          if (isHead) {
            ctx.fillStyle = 'rgba(220,255,220,0.95)' // bright white-green head
          } else {
            const fadeDepth = Math.min(1, (drops[col] * FONT_SIZE) / H)
            const green = Math.floor(120 + fadeDepth * 80)
            ctx.fillStyle = `rgba(0,${green},40,0.85)`
          }
        }

        ctx.fillText(ch, x, Math.max(FONT_SIZE, y))

        // Advance drop
        drops[col] += speeds[col]
        if (drops[col] * FONT_SIZE > H && Math.random() > 0.975) {
          drops[col] = -Math.random() * 20
        }
      }

      // ── Phase 3: fade entire canvas to black ──────────────────────────
      if (phase === 3) {
        const fadeProgress = (elapsed - P3_START) / (P3_END - P3_START)
        ctx.fillStyle = `rgba(5,5,5,${Math.min(1, fadeProgress * 1.2)})`
        ctx.fillRect(0, 0, W, H)

        if (!done && fadeProgress >= 1) {
          done = true
          cancelAnimationFrame(animId)
          document.body.style.overflow = ''
          onComplete()
          return
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      document.body.style.overflow = ''
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[99999]"
      style={{ background: '#050505' }}
      role="status"
      aria-label="Loading portfolio"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Corner labels */}
      <p
        className="absolute top-6 left-8 z-10 select-none"
        style={{
          fontSize: '8px',
          color: '#1a3a1a',
          fontFamily: 'monospace',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
        aria-hidden="true"
      >
        / Garv Malik / Vol. 1
      </p>
      <p
        className="absolute bottom-6 right-8 z-10 select-none"
        style={{
          fontSize: '8px',
          color: '#1a3a1a',
          fontFamily: 'monospace',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
        aria-hidden="true"
      >
        Portfolio 2026
      </p>
    </div>
  )
}
