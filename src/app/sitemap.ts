import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/microcms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mugenkaitaku.com';
  const posts = await getPosts({ limit: 100 }).catch(() => ({ contents: [] as any[] }));
  const postUrls = posts.contents.map((p) => ({
    url: `${base}/blog/${p.id}`,
    lastModified: new Date(p.revisedAt || p.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...postUrls,
  ];
}
