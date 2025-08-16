import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";
import { Providers } from "./providers";

const notoSansJP = Noto_Sans_JP({ 
  weight: ["300", "400", "500"],
  variable: "--font-noto-sans"
});

const notoSerifJP = Noto_Serif_JP({ 
  weight: ["300", "400"],
  variable: "--font-noto-serif"
});

export const metadata: Metadata = {
  title: "NNブログ",
  description: "技術的な内容や個人的な考えを共有するブログ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
