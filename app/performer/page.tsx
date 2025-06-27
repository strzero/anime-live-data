'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show, Actor } from '@/components/ShowTable';

export default function PerformerPage() {
  const params = useSearchParams();
  const name = params.get('name');
  const gender = params.get('gender');
  const nat = params.get('nat');
  const id = params.get('id');

  const matched = useMemo(() => {
    if (!name || !gender || !nat || !id) return [];
    return (showsData as Show[]).filter(show =>
      show.演员名单?.some((a: Actor) =>
        a.姓名 === name &&
        a.性别 === gender &&
        a.国籍 === nat &&
        a.证件号 === id
      )
    );
  }, [name, gender, nat, id]);

  const rows = matched.map((s, idx) => ({
    id: idx,
    演出名称: s.演出名称,
    演出场所: s.演出场所,
    演出日期: s.演出日期,
  }));

  const columns: GridColDef[] = [
    { field: '演出名称', headerName: '演出名称', flex: 6 },
    { field: '演出场所', headerName: '演出场所', flex: 6 },
    { field: '演出日期', headerName: '演出日期', flex: 4 },
  ];

  return (
    <div>
      <h1>演出者出演信息</h1>
      {(!name || !gender || !nat || !id) ? (
        <p>请通过演出详细信息页面点击“查看历史参演”进入此页面。</p>
      ) : matched.length === 0 ? (
        <p>没有找到匹配的演出记录。</p>
      ) : (
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
          <p style={{ marginTop: 16, color: '#666' }}>
            演出者信息如果有重合，可能并非同一个人，请谨慎甄别。
          </p>
        </div>
      )}
    </div>
  );
}
