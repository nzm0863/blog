"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="site-title">
          NNブログ
        </Link>
        <nav className="site-nav">
          <Link href="/" className="nav-link">
            トップ
          </Link>
          <Link href="/blog" className="nav-link">
            ブログ
          </Link>
        </nav>
      </div>
    </header>
  );
}
