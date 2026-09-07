import type { MetadataRoute } from 'next'

const BASE_URL = 'https://garvmalik.lol'

/**
 * Every project page lives in this one list. Adding a project here is the
 * only step needed for it to appear in the sitemap — the previous version
 * was a hand-maintained sitemap.xml, which is how the EEG ADHD thesis
 * ended up live but unlisted for search engines.
 */
const PROJECT_PAGES: { slug: string; priority: number }[] = [
  { slug: 'cityloop',         priority: 0.8 },
  { slug: 'mytown',           priority: 0.8 },
  { slug: 'playpal',          priority: 0.8 },
  { slug: 'noise-experiment', priority: 0.7 },
  { slug: 'talos',            priority: 0.8 },
  { slug: 'eeg-adhd',         priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Regenerated at build time, so lastModified tracks each deploy instead
  // of the hardcoded date the old static file was frozen at.
  const lastModified = new Date()

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...PROJECT_PAGES.map(({ slug, priority }) => ({
      url: `${BASE_URL}/projects/${slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority,
    })),
  ]
}
