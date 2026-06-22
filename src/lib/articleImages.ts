// 記事ID → 画像セットのマッピング
// microCMSのリッチエディタが外部img削除する仕様の回避策として、
// Next.js側で記事IDから画像を補完する。

export type ArticleImageSet = {
  hero: string; // /images/ 配下のファイル名（拡張子含む）
  sections: string[]; // 本文中のH2セクション後に挿入する画像
};

export const articleImages: Record<string, ArticleImageSet> = {
  // W1: 法人営業を効率化する7つの方法
  'hpv610iy5': {
    hero: '01_hero.png',
    sections: ['02_problems.png', '03_seven_steps.png'],
  },
  // W2: テレアポ vs フォーム営業
  'aiguz56s6j': {
    hero: 'w2_01_hero.png',
    sections: ['w2_02_problems.png', 'w2_03_comparison.png'],
  },
  // W3: 決裁者に届く営業メッセージ
  '9skqsuzifo': {
    hero: 'w3_01_hero.png',
    sections: ['w3_02_problems.png', 'w3_03_principles.png'],
  },
  // W4: BtoB営業リストの作り方完全版
  'w75tpfa6x0-a': {
    hero: 'w4_01_hero.png',
    sections: ['w4_02_problems.png', 'w4_03_solution.png'],
  },
};

/**
 * 記事HTMLにセクション画像をH2の直後に注入する。
 * - 2番目のH2の直後に sections[0]
 * - 3番目のH2の直後に sections[1]
 * を挿入する。
 */
export function injectSectionImages(html: string, sections: string[]): string {
  if (!sections.length) return html;
  // H2の位置を全て探す（開始タグまで）
  const h2Regex = /<h2[^>]*>.*?<\/h2>/gi;
  const matches: { index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(html)) !== null) {
    matches.push({ index: m.index, length: m[0].length });
  }
  // 後ろから挿入していくと index がズレない
  const inserts: { at: number; img: string }[] = [];
  // 2番目のH2の直後 → sections[0]、3番目のH2の直後 → sections[1] ...
  for (let i = 0; i < sections.length; i++) {
    const h2Idx = i + 1; // 2nd H2 = index 1
    if (matches[h2Idx]) {
      const at = matches[h2Idx].index + matches[h2Idx].length;
      inserts.push({
        at,
        img: `<p><img src="/images/${sections[i]}" alt="記事内画像" /></p>`,
      });
    }
  }
  // 後ろから挿入
  inserts.sort((a, b) => b.at - a.at);
  let result = html;
  for (const ins of inserts) {
    result = result.slice(0, ins.at) + ins.img + result.slice(ins.at);
  }
  return result;
}

export function getHeroImage(articleId: string): string | null {
  const set = articleImages[articleId];
  return set ? `/images/${set.hero}` : null;
}

export function getSectionImages(articleId: string): string[] {
  const set = articleImages[articleId];
  return set ? set.sections : [];
}
