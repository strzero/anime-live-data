// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import infoHistory from '@/data/info.json';
import Script from 'next/script';

export const metadata = {
  title: 'Anime Live DB',
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
        <header
          style={{
            padding: 16,
            background: '#1976d2',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap' // 如果想在小屏下换行导航
          }}
        >
          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#fff' }}>首页</Link>
            <Link href="/shows" style={{ color: '#fff' }}>演出列表</Link>
            <Link href="/timeline" style={{ color: '#fff' }}>时间线</Link>
            <Link href="/venue" style={{ color: '#fff' }}>场馆排期</Link>
            {/* <Link href="/performer" style={{ color: '#fff' }}>演出者出演信息</Link> */}
          </nav>
          {lastInfo && (
            <div className="last-update" style={{ fontSize: 12 }}>
              上次更新时间：{lastInfo.检查时间} | 新增数量：{lastInfo.新增数量}
            </div>
          )}
        </header>
        <main style={{ padding: 24 }}>{children}</main>
        <footer style={{ textAlign: 'center', padding: 16, borderTop: '1px solid #eee' }}>
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
