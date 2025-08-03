import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/app/providers";
import FaviconLoader from "@/components/FaviconLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "PT. Bumi Rekayasa Persada",
    template: "%s | PT. Bumi Rekayasa Persada",
  },
  description: "Marketplace for PT. Bumi Rekayasa Persada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <Providers>
          <FaviconLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
