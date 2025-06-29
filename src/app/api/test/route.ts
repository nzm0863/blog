import { NextResponse } from 'next/server';

export async function GET() {
  console.log('テストAPIが呼ばれました！');
  return NextResponse.json({ message: 'テスト成功！', timestamp: new Date().toISOString() });
} 