import Link from 'next/link';
import { getPosts, excerpt } from '@/lib/microcms';
import { getHeroImage } from '@/lib/articleImages';

export const revalidate = 60;

export default async function Home() {
  const data = await getPosts({ limit: 20 }).catch(() => ({ contents: [], totalCount: 0 }));
  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-navy-dark leading-snug mb-3">
          法人営業を、構造で勝つ。
        </h1>
        <p className="text-muted">
          無限開拓が運営する、経営者と営業責任者のための実務メディア。営業DX・決裁者アプローチ・フォーム営業の知見を、毎週1本ずつお届けします。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy mb-6 border-l-4 border-accent pl-3">最新記事</h2>
        {data.contents.length === 0 ? (
          <p className="text-muted">記事を準備中です。</p>
        ) : (
          <ul className="space-y-8">
            {data.contents.map((post) => {
              const heroSrc = post.eyecatch?.url || getHeroImage(post.id);
              return (
                <li key={post.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <Link href={`/blog/${post.id}`} className="block group">
                    {heroSrc && (
                      <img src={heroSrc} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted mb-2">
                      {post.category && (
                        <span className="bg-navy text-white px-3 py-1 rounded-full">{post.category.name}</span>
                      )}
                      <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</time>
                    </div>
                    <h3 className="text-lg font-bold text-navy-dark group-hover:text-accent transition">{post.title}</h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{excerpt(post.metaDescription || post.content, 120)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
