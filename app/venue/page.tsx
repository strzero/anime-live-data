'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show } from '@/components/ShowTable';
import { getAllOfficialVenues, getVenueMatchKeywords } from '@/components/venueUtils';
import { isMiscOrHidden } from '@/components/miscFilterUtils';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { fuzzyMatch } from '@/components/fuzzyMatch';

export default function VenueListPage() {
  const [search, setSearch] = useState('');
  const [hideChanged, setHideChanged] = useState(false);
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

  // 热门场馆部分
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

  // 搜索过滤
  const filterRows = (rows: { 演出场所: string; 次数: number; id: number }[]) => {
    return (search.trim()
      ? rows.filter(r => fuzzyMatch(r.演出场所, search.trim()))
      : rows
    ).filter(r => {
      if (!hideChanged) return true;
      // 查找该场馆的任一演出
      const show = (showsData as Show[]).find(s => s.演出场所 === r.演出场所);
      return show ? !isMiscOrHidden(show) : true;
    });
  };

  const columns: GridColDef[] = [
    {
      field: '演出场所',
      headerName: '演出场所',
      flex: 8,
      renderCell: params => (
        <Link href={`/venue/${encodeURIComponent(params.value as string)}`}
          style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'none' }}>
          {params.value as string}
        </Link>
      ),
    },
    { field: '次数', headerName: '未来演出次数', flex: 4 },
  ];

  return (
    <div>
      <h1>场馆排期表</h1>
      <div className="filter-bar" style={{ display: 'flex', gap: 16, margin: '16px 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-row search-row" style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            placeholder="搜索场馆名称..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
          />
        </div>
      </div>
      <h2>热门场馆</h2>
      <div style={{ height: filterRows(predefinedRows).length > 20 ? 400 : 'auto', width: '100%', marginBottom: 32 }}>
        <DataGrid
          rows={filterRows(predefinedRows)}
          columns={columns}
          disableRowSelectionOnClick
          {...(filterRows(predefinedRows).length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
        />
      </div>
      <h2>其他场馆</h2>
      <div style={{ height: filterRows(otherRows).length > 20 ? 400 : 'auto', width: '100%' }}>
        <DataGrid
          rows={filterRows(otherRows)}
          columns={columns}
          disableRowSelectionOnClick
          {...(filterRows(otherRows).length > 20
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
