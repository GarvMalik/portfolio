"use client"

import { useEffect, useRef, useState } from 'react'

// Characters for the rain
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%*'

// Brand palette
const COL_DIM    = 'rgba(180,70,0,0.55)'   // dim orange — trail
const COL_MID    = 'rgba(255,100,20,0.80)' // mid orange
const COL_BRIGHT = 'rgba(255,77,0,1)'      // full orange — head of drop
const COL_HEAD   = 'rgba(255,220,190,1)'   // cream-white — very tip

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gm-loaded')) { onComplete(); return }
    } catch { onComplete(); return }
    setShow(true)
  }, [onComplete])

  useEffect(() => {
    if (!show) return
    try { sessionStorage.setItem('gm-loaded', '1') } catch {}
    document.body.style.overflow = 'hidden'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(() => { document.body.style.overflow = ''; onComplete() }, 400)
      return () => clearTimeout(t)
    }

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const W      = window.innerWidth
    const H      = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const FS   = 14                        // font size / column width
    const COLS = Math.floor(W / FS)
    const ROWS = Math.floor(H / FS)

    // Each column: current y position (in rows), speed
    const drops  = Array.from({ length: COLS }, () => -(Math.random() * ROWS * 0.8))
    const speeds = Array.from({ length: COLS }, () => 0.35 + Math.random() * 0.55)

    // ── Pre-process face image into a brightness grid ───────────────────
    // Grid is COLS × ROWS — same resolution as the character grid
    let brightnessGrid: Float32Array | null = null

    const faceImg = new window.Image()
    faceImg.crossOrigin = 'anonymous'
    faceImg.src = '/garv_face.jpg'
    faceImg.onload = () => {
      const off    = document.createElement('canvas')
      off.width    = COLS
      off.height   = ROWS
      const offCtx = off.getContext('2d')!
      // Draw face centred — preserve aspect ratio, fill height
      const aspect = faceImg.naturalWidth / faceImg.naturalHeight
      const drawW  = ROWS * aspect
      const drawX  = (COLS - drawW) / 2
      offCtx.drawImage(faceImg, drawX, 0, drawW, ROWS)
      const px = offCtx.getImageData(0, 0, COLS, ROWS).data
      brightnessGrid = new Float32Array(COLS * ROWS)
      for (let i = 0; i < COLS * ROWS; i++) {
        const r = px[i * 4]
        const g = px[i * 4 + 1]
        const b = px[i * 4 + 2]
        brightnessGrid[i] = (r * 0.299 + g * 0.587 + b * 0.114) / 255
      }
    }

    // ── Timeline ────────────────────────────────────────────────────────
    const START      = performance.now()
    const T_RAIN     = 2600   // pure rain
    const T_EMERGE   = 4600   // face emerges (2 sec transition)
    const T_HOLD     = 6200   // face fully visible, hold
    const T_FADE     = 7000   // fade to black

    let animId: number
    let finished = false

    const rnd = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const CHAR_ARR = CHARS.split('')

    const draw = () => {
      const now     = performance.now()
      const elapsed = now - START

      // Fade trail — alpha controls how long the tail persists
      ctx.fillStyle = 'rgba(5,5,5,0.18)'
      ctx.fillRect(0, 0, W, H)

      ctx.font = `bold ${FS}px monospace`

      // Face reveal progress 0→1 during emerge phase
      const faceT = elapsed < T_RAIN    ? 0
                  : elapsed < T_EMERGE  ? (elapsed - T_RAIN) / (T_EMERGE - T_RAIN)
                  : 1

      for (let col = 0; col < COLS; col++) {
        const row = Math.floor(drops[col])
        const y   = drops[col] * FS
        const ch  = rnd(CHAR_ARR)

        // ── Sample brightness from face grid at this cell ──────────────
        let brightness = 0
        if (brightnessGrid && faceT > 0 && row >= 0 && row < ROWS) {
          brightness = brightnessGrid[row * COLS + col] * faceT
        }

        // ── Colour decision ────────────────────────────────────────────
        const isHead = row >= 0 && Math.floor(drops[col]) === row

        if (brightness > 0.08) {
          // Face area — map brightness to orange/cream spectrum
          if (brightness > 0.75) {
            // Very bright — cream white (highlight)
            const v = Math.min(255, Math.floor(200 + brightness * 55))
            ctx.fillStyle = `rgba(${v},${Math.floor(v * 0.93)},${Math.floor(v * 0.82)},${Math.min(1, brightness * 1.4)})`
          } else if (brightness > 0.45) {
            // Mid — full orange
            ctx.fillStyle = `rgba(255,${Math.floor(60 + brightness * 100)},10,${Math.min(1, brightness * 1.3)})`
          } else {
            // Shadow — dim orange
            ctx.fillStyle = `rgba(180,${Math.floor(30 + brightness * 80)},0,${brightness * 1.2})`
          }
        } else {
          // Pure rain column — brand orange palette
          if (isHead && row >= 0) {
            ctx.fillStyle = COL_HEAD    // cream tip
          } else if (row >= 0 && drops[col] - row < 0.3) {
            ctx.fillStyle = COL_BRIGHT  // just under tip
          } else {
            // Trail fades based on distance from head
            const dist = drops[col] - row
            if (dist < 3) {
              ctx.fillStyle = COL_MID
            } else {
              ctx.fillStyle = COL_DIM
            }
          }
        }

        if (y > 0 && y < H + FS) {
          ctx.fillText(ch, col * FS, Math.min(H - 2, y))
        }

        // Advance drop
        drops[col] += speeds[col]
        // Randomly reset drop to top
        if (drops[col] * FS > H + FS * 5 && Math.random() > 0.97) {
          drops[col] = -(Math.random() * ROWS * 0.5)
        }
      }

      // ── Fade out phase ───────────────────────────────────────────────
      if (elapsed > T_HOLD) {
        const fp = Math.min(1, (elapsed - T_HOLD) / (T_FADE - T_HOLD))
        ctx.fillStyle = `rgba(5,5,5,${fp * 0.95})`
        ctx.fillRect(0, 0, W, H)

        if (!finished && fp >= 1) {
          finished = true
          cancelAnimationFrame(animId)
          document.body.style.overflow = ''
          onComplete()
          return
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); document.body.style.overflow = '' }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[99999]"
      style={{ background: '#050505' }}
      role="status"
      aria-label="Loading"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <p className="absolute top-5 left-7 z-10 select-none pointer-events-none"
        style={{ fontSize: '8px', color: 'rgba(255,77,0,0.25)', fontFamily: 'monospace', letterSpacing: '0.3em', textTransform: 'uppercase' }}
        aria-hidden="true">/ Garv Malik / Vol. 1</p>

      <p className="absolute bottom-5 right-7 z-10 select-none pointer-events-none"
        style={{ fontSize: '8px', color: 'rgba(255,77,0,0.25)', fontFamily: 'monospace', letterSpacing: '0.3em', textTransform: 'uppercase' }}
        aria-hidden="true">Portfolio 2026</p>
    </div>
  )
}
