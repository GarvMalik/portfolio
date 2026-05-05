"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import — Loader never runs during SSR, only on client
const Loader = dynamic(() => import('./Loader'), { ssr: false })

export default function LoaderWrapper() {
  const [done, setDone] = useState(false)
  if (done) return null
  return <Loader onComplete={() => setDone(true)} />
}
