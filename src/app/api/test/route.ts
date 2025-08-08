import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 独自ドメインのAPIエンドポイントをテスト
    const testUrl = 'https://www.nnzzm.com/blog_php/api/posts.php';
    
    console.log('Testing connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // タイムアウトを設定
      signal: AbortSignal.timeout(10000), // 10秒
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        url: testUrl,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: '独自ドメインへの接続が成功しました',
      data: data,
      url: testUrl,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: 'https://www.nnzzm.com/blog_php/api/posts.php',
      timestamp: new Date().toISOString(),
      suggestions: [
        'DNS設定を確認してください',
        'SSL証明書が有効か確認してください',
        'APIサーバーが稼働しているか確認してください',
        'ファイアウォールの設定を確認してください',
      ],
    }, { status: 500 });
  }
} 