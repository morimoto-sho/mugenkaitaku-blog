import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getAllSlugs, stripHtml, excerpt } from '@/lib/microcms';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  const desc = excerpt(post.metaDescription || post.content, 140);
  return {
    title: post.title,
    description: desc,
    openGraph: {
      title: post.title,
      description: desc,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.eyecatch ? [{ url: post.eyecatch.url }] : undefined,
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const desc = excerpt(post.metaDescription || post.content, 140);

  return (
    <article className="max-w-content mx-auto px-6 py-12">
      <div className="flex items-center gap-3 text-xs text-muted mb-4">
        {post.category && (
          <span className="bg-navy text-white px-3 py-1 rounded-full">{post.category.name}</span>
        )}
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</time>
        {post.author && <span>{post.author}</span>}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-navy-dark leading-snug mb-6">{post.title}</h1>

      {post.eyecatch && (
        <img
          src={post.eyecatch.url}
          alt={post.title}
          className="w-full rounded-xl mb-8"
        />
      )}

      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-16">
        <a
          href="https://www.mugenkaitaku.com/contact"
          className="block text-center bg-navy text-white py-5 rounded-xl font-bold hover:bg-accent transition"
        >
          ▶ 無限開拓の無料相談を申し込む
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: desc,
            datePublished: post.publishedAt,
            dateModified: post.revisedAt,
            author: { '@type': 'Organization', name: post.author?.trim() || '無限開拓編集部' },
            publisher: { '@type': 'Organization', name: '無限開拓', logo: { '@type': 'ImageObject', url: 'https://www.mugenkaitaku.com/logo.png' } },
            image: post.eyecatch?.url,
          }),
        }}
      />
    </article>
  );
}
