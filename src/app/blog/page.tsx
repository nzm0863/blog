import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
}

export default async function BlogPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const res = await fetch("https://www.nnzzm.com/blog_php/api/posts.php", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid response format");
    posts = data;
  } catch (err) {
    error = err instanceof Error ? err.message : "記事一覧の取得に失敗しました";
  }

  if (error) {
    return (
      <div className="container main-content">
        <h2>エラーが発生しました</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container main-content">
      <h1>ブログ一覧</h1>
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="blog-card">
            <h2>{post.title}</h2>
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