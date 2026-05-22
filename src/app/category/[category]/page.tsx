import Link from 'next/link';
import { getPosts, excerpt } from '@/lib/microcms';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: `${decoded}カテゴリの記事一覧`,
    description: `${decoded}に関する記事一覧。無限開拓ブログ。`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  // category field is content reference: filter by category id; here we accept category slug as id
  const data = await getPosts({
    limit: 50,
    filters: `category[equals]${decoded}`,
  }).catch(() => ({ contents: [], totalCount: 0 }));

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-navy-dark mb-2">{decoded}</h1>
      <p className="text-sm text-muted mb-10">カテゴリ内の記事一覧（{data.totalCount}件）</p>

      {data.contents.length === 0 ? (
        <p className="text-muted">該当する記事がありません。</p>
      ) : (
        <ul className="space-y-6">
          {data.contents.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.id}`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition group">
                <time className="text-xs text-muted">{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</time>
                <h2 className="text-lg font-bold text-navy-dark group-hover:text-accent transition mt-1">{post.title}</h2>
                <p className="text-sm text-muted mt-2 line-clamp-2">{excerpt(post.metaDescription || post.content, 120)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
