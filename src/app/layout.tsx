import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "@/lib/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "momoyuki",
  description: "ももかとゆきちゃんのために作ったアプリ",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <Toaster position="bottom-center" />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
