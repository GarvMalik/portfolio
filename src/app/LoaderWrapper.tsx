"use client"
/**
 * LoaderWrapper.tsx
 * Client-side boundary that mounts the Loader and removes it cleanly
 * once the animation completes. Kept as a thin wrapper so layout.tsx
 * can remain a server component.
 */

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import ensures Loader only loads on client, never during SSR
const Loader = dynamic(() => import('./Loader'), { ssr: false })

export default function LoaderWrapper() {
  const [done, setDone] = useState(false)

  if (done) return null

  return <Loader onComplete={() => setDone(true)} />
}
