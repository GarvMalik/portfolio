import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CityLoop — Mood-Based City Discovery',
  description:
    'UX/UI design case study by Garv Malik. CityLoop surfaces local places and events in Tampere based on mood, weather, and time of day. Research-led design with Figma.',
  alternates: { canonical: 'https://garvmalik.lol/projects/cityloop' },
  openGraph: {
    title: 'CityLoop — Garv Malik',
    description:
      'Mood and weather-based city discovery app for Tampere. UX case study by Garv Malik.',
    url: 'https://garvmalik.lol/projects/cityloop',
    images: [{ url: '/og/cityloop.png', width: 1200, height: 630, alt: 'CityLoop project by Garv Malik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CityLoop — Garv Malik',
    images: ['/og/cityloop.png'],
  },
}

export default function CityLoopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
