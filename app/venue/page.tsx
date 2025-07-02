'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show } from '@/components/ShowTable';
import { getAllOfficialVenues, getVenueMatchKeywords } from '@/components/venueUtils';
import { useMemo } from 'react';
import Link from 'next/link';

export default function VenueListPage() {
  const today = new Date();
  const allVenues = getAllOfficialVenues();
  const map = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    (showsData as Show[]).forEach(show => {
      if (show.演出日期数据?.some(d => new Date(d) >= today)) {
        m[show.演出场所] = (m[show.演出场所] || 0) + 1;
      }
    });
    return m;
  }, []);

  // 预定义部分
  const predefinedRows = allVenues.map((item, idx) => {
    // 统计所有匹配词相关的场馆演出数
    const count = Object.entries(map)
      .filter(([name]) => getVenueMatchKeywords(item.official).some(k => name.includes(k)))
      .reduce((sum, [, c]) => sum + c, 0);
    return {
      id: idx,
      演出场所: item.official,
      次数: count,
    };
  }).filter(r => r.次数 > 0);

  // 其他部分
  const predefinedNames = new Set(allVenues.map(v => v.official));
  const otherRows = Object.entries(map)
    .filter(([name]) => !allVenues.some(v => getVenueMatchKeywords(v.official).some(k => name.includes(k))))
    .map(([name, count], idx) => ({ id: idx, 演出场所: name, 次数: count }));

  const columns: GridColDef[] = [
    {
      field: '演出场所',
      headerName: '演出场所',
      flex: 8,
      renderCell: params => (
        <Link href={`/venue/${encodeURIComponent(params.value as string)}`}>
          {params.value as string}
        </Link>
      ),
    },
    { field: '次数', headerName: '未来演出次数', flex: 4 },
  ];

  return (
    <div>
      <h1>演出场所时间表</h1>
      <h2>预定义</h2>
      <div style={{ height: predefinedRows.length > 20 ? 400 : 'auto', width: '100%', marginBottom: 32 }}>
        <DataGrid
          rows={predefinedRows}
          columns={columns}
          disableRowSelectionOnClick
          {...(predefinedRows.length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
        />
      </div>
      <h2>其他</h2>
      <div style={{ height: otherRows.length > 20 ? 400 : 'auto', width: '100%' }}>
        <DataGrid
          rows={otherRows}
          columns={columns}
          disableRowSelectionOnClick
          {...(otherRows.length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
        />
      </div>
    </div>
  );
}
