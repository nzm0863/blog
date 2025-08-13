import Link from "next/link";
import { marked } from "marked";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

// 静的生成は無効化（外部APIへの依存があるため）
// export async function generateStaticParams() {
//   try {
//     const res = await fetch('https://www.nnzzm.com/blog_php/api/posts.php', {
//       cache: "no-store",
//     });
//     const posts: Post[] = await res.json();
//     return posts.map((post) => ({
//       id: String(post.id),
//     }));
//   } catch (error) {
//     console.error('Error in generateStaticParams:', error);
//     return [];
//   }
// }

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
}

// markedのオプションを設定
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 画像のレンダリングをカスタマイズ
const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }: { href: string; title: string | null; text: string; }) => {
  let finalHref = href;
  // 相対パスを絶対パスに変換する安全装置
  if (href && !href.startsWith('http')) {
    finalHref = `https://www.nnzzm.com/uploads/${href}`;
  }
  return `<div class="image-container">
            <img src="${finalHref}" alt="${text || ''}" title="${title || ''}" />
          </div>`;
};

marked.use({ renderer });

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`https://www.nnzzm.com/blog_php/api/get_post.php?id=${id}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`HTTP error! status: ${res.status}`);
      throw new Error(`APIエラー: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data || !data.success || !data.post) {
      console.error("Invalid response format:", data);
      return null;
    }

    return data.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事は存在しないか、削除された可能性があります。',
    };
  }

  return {
    title: post.title,
    description: post.content?.substring(0, 160) || '記事の内容',
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post || !post.content) {
    notFound();
  }

  // HTML内の相対パス画像も絶対パスに変換する安全装置
  const contentWithAbsolutePaths = post.content.replace(
    /<img([^>]*?)src="([^"]+)"/g,
    (match, attributes, src) => {
      if (src && !src.startsWith('http')) {
        return `<img${attributes}src="https://www.nnzzm.com/uploads/${src}"`;
      }
      return match;
    }
  );

  const parsedContent = marked(contentWithAbsolutePaths);

  return (
    <div className="container main-content">
      <div className="back-link">
        <Link href="/blog" className="btn">
          <span>←</span>
          ブログ一覧に戻る
        </Link>
      </div>

      <article className="blog-post">
        <h1>{post.title}</h1>

        <time className="blog-post-meta">
          {new Date(post.created_at).toLocaleDateString("ja-JP", {
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
