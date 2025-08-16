import { gzipSync } from 'zlib';

export async function POST(req: Request) {
  try {
    const { title, content, image_url } = await req.json();
    
    // 記事の内容を圧縮・エンコード（前処理なし）
    const compressedContent = gzipSync(content).toString('base64');
    
    console.log('元の文章の長さ:', content.length);
    console.log('圧縮後のデータサイズ:', compressedContent.length);
    
    console.log('送信するJSONデータ:', {
      id: 'new',
      title,
      content: compressedContent,
      image_url: image_url || '',
      encoding: 'gzip-base64'
    });
    console.log('JSONデータの長さ:', JSON.stringify({
      id: 'new',
      title,
      content: compressedContent,
      image_url: image_url || '',
      encoding: 'gzip-base64'
    }).length);
    console.log('外部APIにリクエスト送信中...');

    const response = await fetch('https://www.nnzzm.com/blog_php/api/post.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'new',
        title,
        content: compressedContent,
        image_url: image_url || '',
        encoding: 'gzip-base64'
      }),
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