import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }

    // ファイル形式チェック
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return NextResponse.json(
        { error: 'JPEG、PNG、GIF形式の画像のみアップロードできます' },
        { status: 400 }
      );
    }

    // PHPのアップロードAPIにリクエストを転送
    const phpFormData = new FormData();
    phpFormData.append('image', file);

    const response = await fetch('https://www.nnzzm.com/blog_php/api/upload.php', {
      method: 'POST',
      body: phpFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'アップロードに失敗しました' },
        { status: response.status }
      );
    }
    
    // PHPからの応答をそのまま返す
    return NextResponse.json(data);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
} 