'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('ユーザー名またはパスワードが正しくありません。');
      } else {
        router.push('/blog/new');
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="auth-container">
        <h1>管理者ログイン</h1>
        <p>ブログ投稿には管理者ログインが必要です。</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              ユーザー名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>

        <div className="auth-info">
          <p>ブログ一覧に戻る場合は <Link href="/blog">こちら</Link></p>
        </div>
      </div>
    </div>
  );
}
