import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const domain = 'nnzzm.com';
    
    // DNSレコードを確認（実際のDNSルックアップは外部サービスを使用）
    const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const dnsData = await dnsResponse.json();
    
    const records = [];
    
    if (dnsData.Answer) {
      dnsData.Answer.forEach((answer: any) => {
        const parts = answer.data.split(' ');
        records.push({
          type: 'A',
          name: domain,
          value: parts[parts.length - 1],
          ttl: answer.TTL
        });
      });
    }
    
    // CNAMEレコードも確認
    const cnameResponse = await fetch(`https://dns.google/resolve?name=www.${domain}&type=CNAME`);
    const cnameData = await cnameResponse.json();
    
    if (cnameData.Answer) {
      cnameData.Answer.forEach((answer: any) => {
        records.push({
          type: 'CNAME',
          name: `www.${domain}`,
          value: answer.data,
          ttl: answer.TTL
        });
      });
    }
    
    // Vercelの推奨設定と比較
    const vercelRecommended = {
      aRecord: '76.76.19.76',
      cnameRecord: 'cname.vercel-dns.com',
      aaaaRecord: '2606:4700:10::ac43:2ae6'
    };
    
    const issues = [];
    
    // Aレコードの確認
    const aRecord = records.find(r => r.type === 'A' && r.name === domain);
    if (!aRecord || aRecord.value !== vercelRecommended.aRecord) {
      issues.push(`Aレコードが正しく設定されていません。期待値: ${vercelRecommended.aRecord}`);
    }
    
    // CNAMEレコードの確認
    const cnameRecord = records.find(r => r.type === 'CNAME' && r.name === `www.${domain}`);
    if (!cnameRecord || !cnameRecord.value.includes('vercel-dns.com')) {
      issues.push(`CNAMEレコードが正しく設定されていません。期待値: ${vercelRecommended.cnameRecord}`);
    }
    
    return NextResponse.json({
      domain: domain,
      records: records,
      vercelRecommended: vercelRecommended,
      issues: issues,
      isConfiguredCorrectly: issues.length === 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('DNS check failed:', error);
    
    return NextResponse.json({
      domain: 'nnzzm.com',
      records: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 