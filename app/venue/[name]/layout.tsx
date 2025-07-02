import { ReactNode } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: { name: string } },
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const venueName = decodeURIComponent(params.name || '');
  return {
    title: `${venueName} - 场馆排期 - Anime Live DB`,
    description: `查看${venueName}的历史和未来演出许可数据。`,
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
