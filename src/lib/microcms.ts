import { createClient } from 'microcms-js-sdk';

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  eyecatch?: { url: string; width: number; height: number };
  // metaDescription is stored as 'リッチエディタ' so comes back as HTML string;
  // strip tags before using as <meta description>.
  metaDescription?: string;
  mainKeyword?: string;
  category?: Category;
  // content is 'リッチエディタ' returning HTML
  content: string;
  // author stored as テキストエリア
  author?: string;
  publishedAt: string;
  updatedAt: string;
  revisedAt: string;
};

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export async function getPosts(queries?: { limit?: number; offset?: number; filters?: string; orders?: string }) {
  return client.getList<BlogPost>({ endpoint: 'blogs', queries });
}

export async function getPost(slug: string) {
  return client.getListDetail<BlogPost>({ endpoint: 'blogs', contentId: slug });
}

export async function getAllSlugs() {
  const data = await client.getList<BlogPost>({ endpoint: 'blogs', queries: { fields: 'id', limit: 100 } });
  return data.contents.map((c) => c.id);
}

export async function getCategories() {
  return client.getList<Category>({ endpoint: 'categories', queries: { limit: 100 } });
}

// Helper: strip HTML tags to use rich-editor field as plain text (for <meta>, summaries, etc.)
export function stripHtml(html: string | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function excerpt(html: string | undefined, maxLength = 140): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
