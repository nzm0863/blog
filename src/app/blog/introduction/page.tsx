import Link from "next/link";
import { marked } from "marked";

// 固定ページのデータ
const introductionPage = {
  id: "introduction",
  title: "はじめに",
  content: `

このブログへようこそ！

## このブログについて

このブログでは、勉強を始めて一年も経たない超初心者が自分の勉強のために技術的な内容や個人的な考えを書き記していきます。
詳しい人からすれば、あまりにも初歩的な内容かもしれませんが、中には参考になる内容もそのうち出てくるかもしれません。もしそのようなものがあればぜひ各々の勉強に生かしてください。

### 主な内容

- **技術記事**: プログラミングやWeb開発、linux、AI、データベースなどについて
- **学習記録**: 新しい技術の学習過程
- **個人的な考え**: 技術や開発に関する考察

### 更新頻度

不定期です。機能に関しては随時更新していきます。

## お問い合わせ

何かご質問やご意見がございましたら、お気軽にお問い合わせください。
メールアドレス: nzm91264@gmail.com

---

*このブログは Next.js と Vercel で構築されています。*
  `,
  created_at: "2025-08-08",
  image_url: null,
  isFixed: true,
};

// markedのオプションを設定
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function IntroductionPage() {
  const parsedContent = marked(introductionPage.content);

  return (
    <div className="container main-content">
      <div className="back-link">
        <Link href="/blog" className="btn">
          <span>←</span>
          ブログ一覧に戻る
        </Link>
      </div>

      <article className="blog-post">
        <h1>
          {introductionPage.title}
          <span className="fixed-badge">固定ページ</span>
        </h1>

        <time className="blog-post-meta">
          {new Date(introductionPage.created_at).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </time>

        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
      </article>
    </div>
  );
}
