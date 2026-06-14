import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_TOKEN;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.mugenkaitaku.com'),
  title: { default: '無限開拓ブログ｜法人営業・営業DXの実務知識', template: '%s｜無限開拓ブログ' },
  description: '無限開拓が運営する法人営業・営業DX・決裁者アプローチの実務メディア。経営者と営業責任者のための、すぐ使える施策と思考法を週1本で発信します。',
  openGraph: {
    type: 'website', locale: 'ja_JP', siteName: '無限開拓ブログ',
    images: ['/og-default.png'],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  // Google Search Console所有権確認用メタタグ
  ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics 4 */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans">
        <header className="bg-white border-b border-line">
          <div className="max-w-content mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/" className="text-navy font-bold text-lg tracking-wide">無限開拓 BLOG</a>
            <nav className="flex items-center gap-6 text-sm text-muted">
              <a href="https://www.mugenkaitaku.com" className="hover:text-navy">無限開拓トップ</a>
              <a href="https://www.mugenkaitaku.com/contact" className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-accent transition">無料相談</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-navy-dark text-white mt-24">
          <div className="max-w-content mx-auto px-6 py-12 text-sm">
            <div className="flex flex-wrap gap-6 mb-6">
              <a href="https://www.mugenkaitaku.com" className="hover:text-accent">トップ</a>
              <a href="https://www.mugenkaitaku.com/contact" className="hover:text-accent">お問い合わせ</a>
              <a href="/" className="hover:text-accent">ブログ一覧</a>
            </div>
            <p className="text-muted">© 無限開拓｜営業DX・人脈戦略・オンライン秘書サービス</p>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
