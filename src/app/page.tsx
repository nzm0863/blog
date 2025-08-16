import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1 className="site-title">NNブログ</h1>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1 className="animate-fade-in-up">
              静謐なる知の殿堂
            </h1>
            <p className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              深く、静かに、言葉と想いを紡ぐ場所
            </p>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <Link href="/blog" className="btn">
                ブログ一覧へ
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
