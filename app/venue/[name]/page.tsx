'use client';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show } from '@/components/ShowTable';

export default function VenueTimelinePage() {
  const { name } = useParams() as { name: string };
  const venueName = decodeURIComponent(name);
  const today = new Date();

  const rows = useMemo(() => {
    return (showsData as Show[])
      .filter(s => s.演出场所 === venueName)
      .flatMap((s, idx) =>
        s.演出日期数据?.filter(d => new Date(d) >= today).map(d => ({
          id: `${idx}-${d}`,
          演出日期: d,
          演出名称: s.演出名称,
          演出场所: venueName,
        })) || []
      );
  }, [venueName]);

  const columns: GridColDef[] = [
    { field: '演出日期', headerName: '演出日期', flex: 4 },
    { field: '演出名称', headerName: '演出名称', flex: 8 },
    {
      field: '演出场所',
      headerName: '演出场所',
      flex: 6,
      renderCell: params => (
        <a href={`/venue/${encodeURIComponent(venueName)}`}>{venueName}</a>
      ),
    },
  ];

  return (
    <div>
      <h1>{venueName} 时间表</h1>
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
