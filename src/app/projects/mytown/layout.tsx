import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyTown — Student Relocation Service',
  description:
    'Product design case study by Garv Malik. MyTown helps international students navigate relocation to Finland — housing, services, and student community in one place.',
  alternates: { canonical: 'https://garvmalik.lol/projects/mytown' },
  openGraph: {
    title: 'MyTown — Garv Malik',
    description:
      'Student relocation service concept for international students in Finland. Product design case study by Garv Malik.',
    url: 'https://garvmalik.lol/projects/mytown',
    images: [{ url: '/og/mytown.png', width: 1200, height: 630, alt: 'MyTown project by Garv Malik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyTown — Garv Malik',
    images: ['/og/mytown.png'],
  },
}

export default function MyTownLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
