// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '演出信息查询站',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
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
        <footer style={{ textAlign: 'center', padding: 16, borderTop: '1px solid #eee' }}>
          由 Star0 开发
        </footer>
      </body>
    </html>
  );
}
