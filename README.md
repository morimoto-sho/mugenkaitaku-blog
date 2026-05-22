# mugenkaitaku-blog

無限開拓（https://www.mugenkaitaku.com/ ）のオウンドメディア。Next.js 15 + microCMS + Vercel ホスティング。

## 構成

- **フレームワーク**：Next.js 15（App Router）
- **CMS**：microCMS（Hobbyプラン無料）
- **ホスティング**：Vercel（Hobbyプラン無料）
- **ドメイン**：blog.mugenkaitaku.com（mugenkaitaku.comのサブドメイン）
- **更新方式**：ISR（Incremental Static Regeneration、60秒キャッシュ）

## 環境変数（`.env.local` または Vercel管理画面で設定）

```
MICROCMS_SERVICE_DOMAIN=mugenkaitaku-blog
MICROCMS_API_KEY=（microCMSのdefault-key）
NEXT_PUBLIC_SITE_URL=https://blog.mugenkaitaku.com
```

## ローカル開発

```bash
npm install
cp .env.example .env.local
# .env.local に MICROCMS_API_KEY を入れる
npm run dev
# → http://localhost:3000
```

## デプロイ

GitHubにpushすると Vercel が自動でビルド・デプロイします。

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # 共通レイアウト（ヘッダー・フッター）
│   ├── page.tsx            # トップ（記事一覧）
│   ├── blog/[slug]/page.tsx # 記事詳細
│   ├── category/[category]/page.tsx # カテゴリ別一覧
│   ├── sitemap.ts          # sitemap.xml
│   ├── robots.ts           # robots.txt
│   └── globals.css         # Tailwind + 記事本文スタイル
└── lib/
    └── microcms.ts         # microCMSクライアント + 型定義
```
