'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import { getOfficialVenueName } from './venueUtils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';

interface Actor {
  姓名: string;
  性别: string;
  国籍: string;
  证件号: string;
}

interface Show {
  受理编号: string;
  批文号: string;
  许可证号: string;
  演出名称: string;
  演出场所: string;
  举办单位: string;
  许可事项: string;
  许可事项类型: string;
  演出日期: string;
  出演者人数: string;
  场次: string;
  演出内容: string;
  审批时间: string;
  出演者名单?: Actor[];
  详情页URL: string;
}

export default function ShowDetailDialog({
  show,
  onClose,
}: {
  show: Show;
  onClose: () => void;
}) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [actorOpen, setActorOpen] = useState(false);
  // 获取真场馆
  const officialVenue = getOfficialVenueName(show.演出场所);
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <DialogTitle sx={{ position: 'relative', pr: isMobile ? 6 : undefined }}>
        {show.演出名称}
        {true && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        {/* 演出信息板块 */}
        <Card elevation={2} variant="outlined" sx={{ marginBottom: 2, background: '#fff', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>演出信息</Typography>
            {officialVenue ? (
              <Typography>
                <strong>场馆：</strong>
                <Link href={`/venue/${encodeURIComponent(officialVenue)}`} style={{ color: '#1976d2' }}>
                  {officialVenue}
                </Link>
              </Typography>
            ) : null}
            <Typography><strong>演出日期：</strong>{show.演出日期}</Typography>
            <Typography><strong>举办单位：</strong>{show.举办单位}</Typography>
            <Typography><strong>演员人数：</strong>{show.出演者人数}</Typography>
            <Typography><strong>场次：</strong>{show.场次}</Typography>
          </CardContent>
        </Card>
        {/* 审批信息板块 */}
        <Card elevation={2} variant="outlined" sx={{ marginBottom: 2, background: '#fff', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>审批信息</Typography>
            <Typography><strong>受理编号：</strong>{show.受理编号}</Typography>
            <Typography><strong>批文号：</strong>{show.批文号}</Typography>
            <Typography><strong>许可证号：</strong>{show.许可证号}</Typography>
            <Typography>
              <strong>演出场所：</strong>
              {officialVenue ? (
                <span>{show.演出场所}</span>
              ) : (
                <Link href={`/venue/${encodeURIComponent(show.演出场所)}`} style={{ color: '#1976d2' }}>
                  {show.演出场所}
                </Link>
              )}
            </Typography>
            <Typography><strong>许可事项：</strong>{show.许可事项}</Typography>
            <Typography><strong>许可事项类型：</strong>{show.许可事项类型}</Typography>
            <Typography><strong>演出内容：</strong>{show.演出内容}</Typography>
            <Typography><strong>审批时间：</strong>{show.审批时间}</Typography>
            <Typography>
              <Link href={show.详情页URL} target="_blank" style={{ color: '#1976d2' }}>
                查看审批页
              </Link>
            </Typography>
          </CardContent>
        </Card>
        {/* 出演者名单板块，默认折叠 */}
        <Card elevation={2} variant="outlined" sx={{ marginBottom: 2, background: '#fff', boxShadow: 2 }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActorOpen(v => !v)}>
              <Typography variant="h6">出演者名单</Typography>
              {actorOpen ? <ExpandLessIcon sx={{ ml: 1 }} /> : <ExpandMoreIcon sx={{ ml: 1 }} />}
            </div>
            {actorOpen && show.出演者名单?.map((actor, idx) => (
              <Card key={`${actor.证件号}-${idx}`} style={{ marginBottom: 8 }}>
                <CardContent>
                  <Typography>姓名：{actor.姓名}</Typography>
                  <Typography>性别：{actor.性别}</Typography>
                  <Typography>国籍：{actor.国籍}</Typography>
                  <Typography>证件号：{actor.证件号}</Typography>
                  <Link
                    href={`/performer?name=${encodeURIComponent(actor.姓名)}&gender=${actor.性别}&nat=${encodeURIComponent(actor.国籍)}&id=${encodeURIComponent(actor.证件号)}`}
                    style={{ color: '#1976d2', marginTop: 4, display: 'inline-block' }}
                  >
                    查看历史参演
                  </Link>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
