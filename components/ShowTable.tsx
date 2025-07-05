'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ShowDetailDialog from './ShowDetailDialog';
import { getOfficialVenueName, stripVenueAddress } from './venueUtils';
import { isMiscOrHidden } from '@/components/miscFilterUtils';

export interface Actor {
  姓名: string; 性别: string; 国籍: string; 证件号: string;
}

export interface Show {
  演出名称: string;
  演出日期: string;
  演出日期数据?: string[];
  演出场所: string;
  举办单位: string;
  许可事项: string;
  许可事项类型: string;
  演员人数: string;
  场次: string;
  演出内容: string;
  审批时间: string;
  出演者名单?: Actor[];
  详情页URL: string;
}

export default function ShowTable({ shows, isMobile = false, hideChanged }: { shows: Show[], isMobile?: boolean, hideChanged?: boolean }) {
  const [openShow, setOpenShow] = useState<Show | null>(null);
  const rowCount = shows.length;

  // 找出最新审批时间字符串（假设格式统一，字符串比较即可）
  const latestApprovalTime = shows.reduce((latest, show) => {
    return show.审批时间 > latest ? show.审批时间 : latest;
  }, '');

  const filteredShows = useMemo(() => {
    return shows.filter(show => {
      if (hideChanged && isMiscOrHidden(show)) return false;
      return true;
    });
  }, [shows, hideChanged]);

  const columns: GridColDef[] = [
    {
      field: '演出名称',
      headerName: '演出名称',
      flex: 6,
      minWidth: 150,
      renderCell: params => {
        const isNew = (params.row as Show).审批时间 === latestApprovalTime;
        return (
          <span
            style={{ cursor: 'pointer', color: '#1976d2' }}
            onClick={() => setOpenShow(params.row as Show)}
          >
            {params.value}
            {isNew && (
              <span
                style={{
                  marginLeft: 6,
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '0.85em',
                  border: '1px solid red',
                  borderRadius: 3,
                  padding: '0 4px',
                  userSelect: 'none',
                }}
              >
                new
              </span>
            )}
          </span>
        );
      },
    },
    ...(!isMobile ? [
      { field: '演出日期', headerName: '演出日期', flex: 4, minWidth: 120 },
      {
        field: '演出场所',
        headerName: '演出场所',
        flex: 6,
        minWidth: 150,
        renderCell: (params: any) => {
          const official = getOfficialVenueName(params.value) || null;
          let display = official || stripVenueAddress(params.value);
          const isOfficial = Boolean(official);
          return (
            <Link href={`/venue/${encodeURIComponent(official || params.value)}`}
              style={{
                color: isOfficial ? '#1976d2' : 'inherit',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {display}
            </Link>
          );
        },
      },
    ] : []),
  ];

  return (
    <>
      <div style={{ height: rowCount > 20 ? 600 : 'auto', width: '100%' }}>
        <DataGrid
          rows={filteredShows.map((s, i) => ({ id: i, ...s }))}
          columns={columns}
          {...(rowCount > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
          disableRowSelectionOnClick
        />
      </div>
      {openShow && <ShowDetailDialog show={openShow} onClose={() => setOpenShow(null)} />}
    </>
  );
}
