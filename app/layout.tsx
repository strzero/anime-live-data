// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import infoHistory from '@/data/info.json';
import Script from 'next/script';
import React from 'react';
import CheckingUpdate from "@/components/CheckingUpdate";

export const metadata = {
  title: 'Anime Live DB',
  description: '日本及亚洲地区演出许可数据可视化，支持演出、场馆、时间线等多维度查询。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lastInfo = infoHistory.length > 0 ? infoHistory[infoHistory.length - 1] : null;
  const lastCheck = lastInfo ? lastInfo["检查时间"] : '';
  const newCount = lastInfo ? lastInfo["新增数量"] : 0;
  // 这里假设 infoHistory 至少有两条数据时，前一条为上次更新
  const lastUpdate = infoHistory.length > 1 ? infoHistory[infoHistory.length - 2]["检查时间"] : '';

  return (
    <html lang="zh-CN">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-G00KW6FXCT" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G00KW6FXCT');
          `}
        </Script>
      </head>
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <style>
          {`
            @media (max-width: 600px) {
              .header-row {
                flex-direction: column !important;
                align-items: flex-start !important;
              }
              .site-title {
                margin-bottom: 12px !important;
                margin-right: 0 !important;
              }
              .checking-bar-mobile {
                display: flex !important;
              }
            }
            @media (max-width: 950px) {
              .checking-bar {
                display: none !important;
              }

            }
            @media (min-width: 950px) {
              .checking-bar-mobile {
                display: none !important;
              }
            }
          `}
        </style>
        <header
          style={{
            padding: 16,
            background: '#1976d2',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div className="header-row" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className="site-title" style={{ fontWeight: 'bold', fontSize: 20, marginRight: 32 }}>
              Anime Live DB
            </div>
            <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#fff' }}>首页</Link>
              <Link href="/shows" style={{ color: '#fff' }}>演出列表</Link>
              <Link href="/timeline" style={{ color: '#fff' }}>时间线</Link>
              <Link href="/venue" style={{ color: '#fff' }}>场馆排期</Link>
              {/* <Link href="/performer" style={{ color: '#fff' }}>演出者出演信息</Link> */}
            </nav>
          </div>
          <span className="checking-bar"><CheckingUpdate lastInfo={lastInfo} /></span>
        </header>
        <main style={{ padding: 24 }}>{children}</main>
        <footer style={{ textAlign: 'center', padding: 16, borderTop: '1px solid #eee', position: 'relative', color: '#222' }}>
          <span className="checking-bar-mobile" style={{ justifyContent: 'center', display: 'flex', color: '#222', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 15, color: '#888', display: 'block' }}>
              下次检查：{lastCheck || '-'}
            </span>
            <span style={{ fontSize: 15, color: '#888', display: 'block' }}>
              上次更新：{lastUpdate || '-'}
            </span>
            <span style={{ fontSize: 15, color: '#888', display: 'block' }}>
              今日新增：{newCount}
            </span>
          </span>
          <span style={{ fontSize: 15, color: '#888', display: 'block' }}>
            Developed by Star0
            <br />
            欢迎Star:
            <a href="https://github.com/strzero/anime-live-data" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', marginLeft: 4 }}>
              Github
            </a>
          </span>
          <span style={{ fontSize: 15, color: '#888', display: 'block' }}>
            当前构建版本：{process.env.NEXT_PUBLIC_BUILD_TIME ? process.env.NEXT_PUBLIC_BUILD_TIME : 'Dev'}
          </span>
        </footer>
      </body>
    </html>
  );
}
