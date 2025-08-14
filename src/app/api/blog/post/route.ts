export async function POST(req: Request) {
  try {
    const { title, content, image_url } = await req.json();
    
    // 文章の前処理
    let processedContent = content;
    
    // 改行文字を統一
    processedContent = processedContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 特殊文字のエスケープ（必要に応じて）
    processedContent = processedContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    
    // 文字数制限チェック（50000文字）
    if (processedContent.length > 50000) {
      throw new Error('文章が長すぎます。50000文字以下にしてください。');
    }
    
    console.log('元の文章の長さ:', content.length);
    console.log('処理後の文章の長さ:', processedContent.length);
    
    const params = new URLSearchParams();
    params.append('id', 'new'); // 新規投稿用のID
    params.append('title', title);
    params.append('content', processedContent); // 処理済みの内容を使用
    if (image_url) {
      params.append('image_url', image_url);
    } else {
      params.append('image_url', '');
    }

    console.log('送信するパラメータ:', params.toString());
    console.log('パラメータの長さ:', params.toString().length);
    console.log('外部APIにリクエスト送信中...');

    const response = await fetch('https://www.nnzzm.com/blog_php/api/post.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
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