// app/page.tsx
'use client';

import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlaceIcon from '@mui/icons-material/Place';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import showsData from '@/data/data.json';
import ShowTable, { Show } from '@/components/ShowTable';

const items = [
  { title: '演出列表', href: '/shows', icon: <ListAltIcon fontSize="large" /> },
  { title: '时间线', href: '/timeline', icon: <TimelineIcon fontSize="large" /> },
  { title: '演出场所时间表', href: '/venue', icon: <PlaceIcon fontSize="large" /> },
  // { title: '演出者历史查询', href: '/performer', icon: <PersonSearchIcon fontSize="large" /> },
];

function getLatestJapanShows() {
  const NATION_LIST = ['中国','日本','俄罗斯','英国','美国','中国台湾'];
  return (showsData as Show[])
    .filter(show => {
      const actorNats = show.演员名单?.map(a =>
        NATION_LIST.includes(a.国籍) ? a.国籍 : '其他'
      ) || [];
      return actorNats.includes('日本') && show.许可事项类型 === '新办';
    })
    .sort((a, b) => b.审批时间.localeCompare(a.审批时间))
    .slice(0, 10);
}

export default function HomePage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 6, px: 2 }}>
      <Typography variant="h3" gutterBottom>
        Anime Live DB
      </Typography>
      {/* CSS Grid 布局 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 4,
          mt: 4,
        }}
      >
        {items.map((item) => (
          <Card key={item.href} elevation={3}>
            <CardActionArea component={Link} href={item.href}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                {item.icon}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {item.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>最新信息</Typography>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <ShowTable shows={getLatestJapanShows()} />
        </div>
      </Box>
    </Box>
  );
}
