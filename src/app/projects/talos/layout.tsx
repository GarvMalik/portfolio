import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talos Care — Conversational AI Pre-Screening',
  description:
    'UX engineering case study by Garv Malik. Talos Care is a multimodal conversational AI agent for sensitive health pre-screening, built with Groq API, Web Speech API, and zero-backend privacy architecture. HTI.560, Tampere University.',
  alternates: { canonical: 'https://garvmalik.lol/projects/talos' },
  openGraph: {
    title: 'Talos Care — Garv Malik',
    description:
      'Conversational AI for sensitive health pre-screening. UX engineering case study by Garv Malik — Groq API, voice design, zero-backend privacy.',
    url: 'https://garvmalik.lol/projects/talos',
    images: [{ url: '/og/talos.png', width: 1200, height: 630, alt: 'Talos Care project by Garv Malik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talos Care — Garv Malik',
    images: ['/og/talos.png'],
  },
}

export default function TalosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
