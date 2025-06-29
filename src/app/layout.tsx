import type { Metadata } from "next";
import "./globals.css";
import Header from "./header";

export const metadata: Metadata = {
  title: "NNブログ",
  description: "Next.jsで作成したブログサイト",
};

export default function RootLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
