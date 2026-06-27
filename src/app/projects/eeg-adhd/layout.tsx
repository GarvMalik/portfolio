import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EEG-based ADHD Classification — B.Tech Thesis',
  description:
    'B.Tech final thesis by Garv Malik. EEG brain signal analysis using CNN and gradient boosting (LightGBM, XGBoost) for automated ADHD classification. 98.53% accuracy on 121-child dataset. BML Munjal University, 2024.',
  alternates: { canonical: 'https://garvmalik.lol/projects/eeg-adhd' },
  openGraph: {
    title: 'EEG-based ADHD Classification — Garv Malik',
    description:
      'B.Tech thesis — machine learning pipeline for ADHD detection from EEG brain signals. CNN achieved 98.53% accuracy. BML Munjal University 2024.',
    url: 'https://garvmalik.lol/projects/eeg-adhd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EEG-based ADHD Classification — Garv Malik',
  },
}

export default function EEGLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
