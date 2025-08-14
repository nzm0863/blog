export async function POST(req: Request) {
  try {
    const { title, content, image_url } = await req.json();
    const params = new URLSearchParams();
    params.append('id', 'new'); // 新規投稿用のID
    params.append('title', title);
    params.append('content', content);
    if (image_url) {
      params.append('image_url', image_url);
    } else {
      params.append('image_url', '');
    }

    console.log('送信するパラメータ:', params.toString());
    console.log('外部APIにリクエスト送信中...');

    const response = await fetch('https://www.nnzzm.com/blog_php/api/post.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    
    console.log('レスポンスステータス:', response.status);
    console.log('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));
    
    // レスポンスのContent-Typeをチェック
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('text/html')) {
      // HTMLレスポンスの場合はエラーとして扱う
      const htmlText = await response.text();
      console.error('HTMLレスポンス:', htmlText);
      throw new Error('外部APIからHTMLレスポンスが返されました。APIサーバーに問題がある可能性があります。');
    }
    
    const data = await response.json();
    console.log('APIレスポンス:', data);
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('投稿APIエラー:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : '投稿APIエラー'
    }), { status: 500 });
  }
}