import { ReactNode } from 'react';

export const dynamic = 'force-static';

export function generateMetadata({ params }: { params: { name: string } }) {
  const venueName = decodeURIComponent(params.name || '');
  return {
    title: `${venueName} - 场馆详情 - Anime Live DB`,
    description: `查看${venueName}的历史和未来演出许可数据。`,
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
