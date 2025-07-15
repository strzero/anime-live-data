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
import { isMiscOrHidden } from '@/components/miscFilterUtils';

const items = [
  { title: '演出列表', href: '/shows', icon: <ListAltIcon fontSize="large" /> },
  { title: '时间线', href: '/timeline', icon: <TimelineIcon fontSize="large" /> },
  { title: '场馆排期表', href: '/venue', icon: <PlaceIcon fontSize="large" /> },
  // { title: '演出者历史查询', href: '/performer', icon: <PersonSearchIcon fontSize="large" /> },
];

function getLatestJapanShows() {
  const NATION_LIST = ['中国','日本','俄罗斯','英国','美国','中国台湾'];
  const filtered = (showsData as Show[])
    .filter(show => {
      const actorNats = show.出演者名单?.map(a =>
        NATION_LIST.includes(a.国籍) ? a.国籍 : '其他'
      ) || [];
      return actorNats.includes('日本') 
        && show.许可事项类型 === '新办' 
        && !isMiscOrHidden(show);
    })
    .sort((a, b) => b.审批时间.localeCompare(a.审批时间));

  const result: Show[] = [];
  let i = 0;
  while (i < filtered.length) {
    const currentDate = filtered[i].审批时间;
    const sameDayBatch = filtered.filter(show => show.审批时间 === currentDate);
    if (!result.some(show => show.审批时间 === currentDate)) {
      result.push(...sameDayBatch);
    }
    if (result.length >= 10) break;
    i += sameDayBatch.length;
  }
  return result;
}

export default function HomePage() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: { xs: 1.25, sm: 6 }, // 10px on mobile
        mb: { xs: 1.25, sm: 6 },
        px: { xs: 1.5, sm: 2 },  // 12px on mobile
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontSize: { xs: '1.8rem', sm: '3rem' },
          mb: { xs: 2, sm: 3 },
        }}
      >
        Anime Live DB
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(240px, 1fr))' },
          gap: { xs: 2, sm: 4 }, // less gap on mobile
          mt: { xs: 2, sm: 4 },
        }}
      >
        {items.map((item) => (
          <Card
            key={item.href}
            elevation={3}
          >
            <CardActionArea component={Link} href={item.href}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' }, // 小屏横向排列，大屏竖排
                  alignItems: 'center',
                  justifyContent: 'center', // 水平居中
                  py: { xs: 1.5, sm: 4 }, // 小屏padding减少
                  gap: { xs: 1, sm: 0 }, // 图标和文字间距
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  sx={{
                    mt: 0, // 小屏无顶部margin
                  }}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          mt: { xs: 3, sm: 6 },
          mb: { xs: 2, sm: 4 },
          px: { xs: 0, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
        >
          最新信息
        </Typography>
        <Box
          sx={{
            maxWidth: 910,
            mx: 'auto',
          }}
        >
          <ShowTable shows={getLatestJapanShows()} />
        </Box>
      </Box>
    </Box>
  );
}
