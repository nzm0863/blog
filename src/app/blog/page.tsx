import Link from "next/link";

interface Post {
  id: number | string;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  isFixed?: boolean;
}

// 固定ページのデータ
const fixedPages: Post[] = [
  {
    id: 'introduction',
    title: 'はじめに',
    content: 'このブログについて説明します。。',
    created_at: '2025-08-08',
    image_url: null,
    isFixed: true
  }
];

export default async function BlogPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    // デバッグページと同じ方法でAPIにアクセス
    const res = await fetch("https://www.nnzzm.com/blog_php/api/posts.php", {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      throw new Error(`APIエラー: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Invalid response format:", data);
      throw new Error("APIレスポンスの形式が無効です");
    }
    posts = data;
  } catch (err) {
    console.error("Fetch error:", err);
    error = err instanceof Error ? err.message : "記事一覧の取得に失敗しました";
  }

  if (error) {
    return (
      <div className="container main-content">
        <h2>エラーが発生しました</h2>
        <p className="error-message">{error}</p>
        <div className="error-details">
          <p>考えられる原因:</p>
          <ul>
            <li>独自ドメインの設定が正しくない</li>
            <li>APIサーバーが応答していない</li>
            <li>ネットワーク接続の問題</li>
          </ul>
          <p>解決方法:</p>
          <ul>
            <li>ドメインのDNS設定を確認してください</li>
            <li>SSL証明書が有効か確認してください</li>
            <li>APIサーバーが稼働しているか確認してください</li>
            <li><a href="/debug" className="btn">デバッグページで接続テスト</a></li>
          </ul>
        </div>
      </div>
    );
  }

  // 固定ページと通常の投稿を結合
  const allPosts = [...fixedPages, ...posts];

  return (
    <div className="container main-content">
      <h1>ブログ一覧</h1>
      <div className="blog-list">
        {allPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.id}`} 
            className={`blog-card ${post.isFixed ? 'fixed-page' : ''}`}
          >
            <h2>
              {post.title}
              {post.isFixed && <span className="fixed-badge">固定</span>}
            </h2>
            <div className="blog-card-meta">
              {new Date(post.created_at).toLocaleDateString("ja-JP")}
              {post.image_url && <span className="image-indicator">📷</span>}
            </div>
            <p>
              {post.content.replace(/<img[^>]*>/g, "").substring(0, 100) + "..."}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}