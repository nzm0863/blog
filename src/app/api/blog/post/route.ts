export async function POST(req: Request) {
  try {
    const { title, content, image_url } = await req.json();
    const params = new URLSearchParams();
    params.append('title', title);
    params.append('content', content);
    if (image_url) {
      params.append('image_url', image_url);
    } else {
      params.append('image_url', '');
    }

    const response = await fetch('https://www.nnzzm.com/blog_php/api/post.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : '投稿APIエラー'
    }), { status: 500 });
  }
}