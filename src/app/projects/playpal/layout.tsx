import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PlayPal — Sports Community Platform',
  description:
    'Design system and interaction design case study by Garv Malik. PlayPal helps people find sports partners and book venues, with a cohesive design system built in Figma.',
  alternates: { canonical: 'https://garvmalik.lol/projects/playpal' },
  openGraph: {
    title: 'PlayPal — Garv Malik',
    description:
      'Sports community platform — find partners, book venues. Design system case study by Garv Malik.',
    url: 'https://garvmalik.lol/projects/playpal',
    images: [{ url: '/og/playpal.png', width: 1200, height: 630, alt: 'PlayPal project by Garv Malik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayPal — Garv Malik',
    images: ['/og/playpal.png'],
  },
}

export default function PlayPalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
