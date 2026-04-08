import type { Metadata } from "next";

import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import ToastProvider from "../components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ của website tuyển dụng IT",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ToastProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
