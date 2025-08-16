import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">NNブログ</h3>
            <p className="footer-description">
              深く、静かに、言葉と想いを紡ぐ場所
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">ナビゲーション</h4>
            <nav className="footer-nav">
              <Link href="/" className="footer-link">
                トップ
              </Link>
              <Link href="/blog" className="footer-link">
                ブログ
              </Link>
            </nav>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">お問い合わせ</h4>
            <p className="footer-text">
              ご質問やご意見がございましたら、
              <br />
              お気軽にお声がけください。
              <br />
              nzm91264@gmail.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2025 Nakamura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
