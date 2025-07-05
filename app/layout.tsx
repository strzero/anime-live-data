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
              .checking-bar {
                display: none !important;
              }
              .checking-bar-mobile {
                display: flex !important;
              }
            }
            @media (min-width: 601px) {
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
          <span className="checking-bar-mobile" style={{ justifyContent: 'center', display: 'flex', marginBottom: 8, color: '#222' }}>
            <CheckingUpdate lastInfo={lastInfo} color="#222" />
          </span>
          Developed by Star0
          <br />
          欢迎Star！<a href="https://github.com/strzero/anime-live-data" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
            Github
          </a>
        </footer>
      </body>
    </html>
  );
}
