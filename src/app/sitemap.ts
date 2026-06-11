import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://garvmalik.lol'
  const now  = new Date()

  return [
    {
      url:              base,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         1.0,
    },
    {
      url:              `${base}/projects/cityloop`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.8,
    },
    {
      url:              `${base}/projects/mytown`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.8,
    },
    {
      url:              `${base}/projects/playpal`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.8,
    },
    {
      url:              `${base}/projects/noise-experiment`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.7,
    },
    {
      url:              `${base}/projects/talos`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.8,
    },
  ]
}
