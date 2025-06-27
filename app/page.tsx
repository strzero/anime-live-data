// app/page.tsx
'use client';

import Link from 'next/link';
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlaceIcon from '@mui/icons-material/Place';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const items = [
  { title: '演出列表', href: '/shows', icon: <ListAltIcon fontSize="large" /> },
  { title: '时间线', href: '/timeline', icon: <TimelineIcon fontSize="large" /> },
  { title: '演出场所时间表', href: '/venue', icon: <PlaceIcon fontSize="large" /> },
  { title: '演出者历史查询', href: '/performer', icon: <PersonSearchIcon fontSize="large" /> },
];

export default function HomePage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 6 }}>
      <Typography variant="h3" gutterBottom>演出信息查询站</Typography>
      <Typography variant="subtitle1" gutterBottom>欢迎使用，选择下方功能快速开始</Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {items.map(item => (
          <Grid item key={item.href} xs={10} sm={6} md={3}>
            <Card elevation={3}>
              <CardActionArea component={Link} href={item.href}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  {item.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>{item.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
