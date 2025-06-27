'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show } from '@/components/ShowTable';

export default function VenueListPage() {
  const today = new Date();
  const map = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    (showsData as Show[]).forEach(show => {
      if (show.演出日期数据?.some(d => new Date(d) >= today)) {
        m[show.演出场所] = (m[show.演出场所] || 0) + 1;
      }
    });
    return m;
  }, []);

  const rows = Object.entries(map)
    .map(([name, count], idx) => ({ id: idx, 演出场所: name, 次数: count }))
    .sort((a, b) => b.次数 - a.次数);

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
      <div style={{ height: rows.length > 20 ? 600 : 'auto', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          {...(rows.length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
