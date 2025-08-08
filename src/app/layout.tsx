import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
