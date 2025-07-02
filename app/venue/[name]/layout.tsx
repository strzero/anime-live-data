import { ReactNode } from 'react';

export const metadata = {
  title: '场馆详情 - Anime Live DB',
  description: '查看指定场馆的历史和未来演出许可数据。',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
