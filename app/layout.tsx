// app/layout.tsx
'use client';

import './globals.css';
import Link from 'next/link';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

export const metadata = {
  title: '演出信息查询站',
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <header style={{ padding: 16, background: '#1976d2', color: '#fff' }}>
            <nav style={{ display: 'flex', gap: 24 }}>
              <Link href="/" style={{ color: '#fff' }}>首页</Link>
              <Link href="/shows" style={{ color: '#fff' }}>演出列表</Link>
              <Link href="/timeline" style={{ color: '#fff' }}>时间线</Link>
              <Link href="/venue" style={{ color: '#fff' }}>演出场所时间表</Link>
              <Link href="/performer" style={{ color: '#fff' }}>演出者出演信息</Link>
            </nav>
          </header>
          <main style={{ padding: 24 }}>{children}</main>
          <footer style={{ textAlign: 'center', padding: 16, borderTop: '1px solid #444' }}>
            由 Star0 开发
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
