'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  url?: string;
  timestamp?: string;
  suggestions?: string[];
  data?: any;
}

interface DnsCheckResult {
  domain: string;
  records: {
    type: string;
    name: string;
    value: string;
    ttl?: number;
  }[];
  error?: string;
}

export default function DebugPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [dnsResult, setDnsResult] = useState<DnsCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDnsLoading, setIsDnsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDns = async () => {
    setIsDnsLoading(true);
    setDnsResult(null);

    try {
      const response = await fetch('/api/dns-check');
      const result = await response.json();
      setDnsResult(result);
    } catch (error) {
      setDnsResult({
        domain: 'nnzzm.com',
        records: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsDnsLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <h1>デバッグページ</h1>
      <p>独自ドメインの接続状況をテストできます。</p>
      
      <div className="debug-section">
        <h3>1. API接続テスト</h3>
        <button 
          onClick={testConnection} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'テスト中...' : '接続テストを実行'}
        </button>
      </div>

      <div className="debug-section">
        <h3>2. DNS設定確認</h3>
        <button 
          onClick={checkDns} 
          disabled={isDnsLoading}
          className="btn btn-primary"
        >
          {isDnsLoading ? '確認中...' : 'DNS設定を確認'}
        </button>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h3>API接続テスト結果</h3>
          <div className="result-details">
            <p><strong>ステータス:</strong> {testResult.success ? '成功' : '失敗'}</p>
            {testResult.message && <p><strong>メッセージ:</strong> {testResult.message}</p>}
            {testResult.error && <p><strong>エラー:</strong> {testResult.error}</p>}
            {testResult.url && <p><strong>URL:</strong> {testResult.url}</p>}
            {testResult.timestamp && <p><strong>タイムスタンプ:</strong> {testResult.timestamp}</p>}
          </div>

          {testResult.suggestions && testResult.suggestions.length > 0 && (
            <div className="suggestions">
              <h4>解決方法の提案:</h4>
              <ul>
                {testResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {testResult.data && (
            <div className="response-data">
              <h4>レスポンスデータ:</h4>
              <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {dnsResult && (
        <div className={`test-result ${dnsResult.error ? 'error' : 'success'}`}>
          <h3>DNS設定確認結果</h3>
          <div className="result-details">
            <p><strong>ドメイン:</strong> {dnsResult.domain}</p>
            {dnsResult.error && <p><strong>エラー:</strong> {dnsResult.error}</p>}
            <p><strong>レコード数:</strong> {dnsResult.records.length}</p>
          </div>

          {dnsResult.records.length > 0 && (
            <div className="dns-records">
              <h4>DNSレコード:</h4>
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>タイプ</th>
                      <th>名前</th>
                      <th>値</th>
                      <th>TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsResult.records.map((record, index) => (
                      <tr key={index}>
                        <td>{record.type}</td>
                        <td>{record.name}</td>
                        <td>{record.value}</td>
                        <td>{record.ttl || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="debug-info">
        <h3>Vercelドメイン設定のトラブルシューティング</h3>
        <div className="troubleshooting-steps">
          <h4>1. DNS設定の確認</h4>
          <p>Vercelで推奨されるDNSレコードが正しく設定されているか確認してください：</p>
          <ul>
            <li><strong>Aレコード:</strong> @ → 76.76.19.76</li>
            <li><strong>CNAMEレコード:</strong> www → cname.vercel-dns.com</li>
            <li><strong>AAAAレコード:</strong> @ → 2606:4700:10::ac43:2ae6</li>
          </ul>
          
          <h4>2. SSL証明書の確認</h4>
          <p>Vercelが自動的にSSL証明書を発行します。設定後、数分から数時間かかる場合があります。</p>
          
          <h4>3. ドメインの検証</h4>
          <p>Vercelダッシュボードで「Verify Domain」を実行してください。</p>
          
          <h4>4. キャッシュのクリア</h4>
          <p>DNSの変更は最大48時間かかる場合があります。ブラウザのキャッシュもクリアしてください。</p>
        </div>
      </div>
    </div>
  );
} 