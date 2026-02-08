import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "智汇丝韵",
  description: "基于AI的非遗文化深度旅游平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* 核心容器：限制最大宽度并居中，模拟移动端体验 */}
        <div className="relative min-h-screen max-w-2xl mx-auto bg-white shadow-xl pb-20 overflow-x-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}