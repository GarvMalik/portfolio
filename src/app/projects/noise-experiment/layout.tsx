import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Noise & Reaction Time — HTI.350 Research',
  description:
    'Experimental research case study by Garv Malik. Does environmental noise affect reaction time? Controlled experiment across 3 noise conditions using E-Prime, ANOVA, and SPSS. Tampere University.',
  alternates: { canonical: 'https://garvmalik.lol/projects/noise-experiment' },
  openGraph: {
    title: 'Noise & Reaction Time — Garv Malik',
    description:
      'HTI.350 experimental research — effect of noise on reaction time. ANOVA study at Tampere University by Garv Malik.',
    url: 'https://garvmalik.lol/projects/noise-experiment',
    images: [{ url: '/og/noise.png', width: 1200, height: 630, alt: 'Noise experiment research by Garv Malik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noise & Reaction Time — Garv Malik',
    images: ['/og/noise.png'],
  },
}

export default function NoiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
