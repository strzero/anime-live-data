'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import showsData from '@/data/data.json';
import { Show } from '@/components/ShowTable';
import ShowDetailDialog from '@/components/ShowDetailDialog';
import { getOfficialVenueName, getVenueMatchKeywords, stripVenueAddress } from '@/components/venueUtils';
import { isMiscOrHidden } from '@/components/miscFilterUtils';
import { fuzzyMatch } from '@/components/fuzzyMatch';

export default function VenueTimelinePage() {
  const { name } = useParams() as { name: string };
  const venueName = decodeURIComponent(name);
  const officialVenue = getOfficialVenueName(venueName) || venueName;
  const keywords = getVenueMatchKeywords(officialVenue);
  const today = new Date();
  const [search, setSearch] = useState('');
  const [hideChanged, setHideChanged] = useState(true);
  const [detailShow, setDetailShow] = useState<any>(null);

  // 过滤所有包含匹配词的演出，分为未来和历史
  const { futureRows, pastRows } = useMemo(() => {
    const now = new Date();
    const all = (showsData as Show[])
      .filter(s => keywords.some(k => s.演出场所?.includes(k)))
      .filter(s =>
        (!search || fuzzyMatch(s.演出名称, search) || fuzzyMatch(s.举办单位 || '', search)) &&
        (!hideChanged || s.许可事项类型 === '新办') &&
        (!hideChanged || !isMiscOrHidden(s))
      )
      .flatMap((s, idx) =>
        (s.演出日期数据 || [s.演出日期]).map(d => {
          const dateObj = new Date(d);
          return {
            id: `${idx}-${d}`,
            演出日期: d,
            演出名称: s.演出名称,
            许可事项类型: s.许可事项类型,
            show: s,
            dateObj
          };
        })
      );
    const futureRows = all.filter(r => r.dateObj >= now);
    const pastRows = all.filter(r => r.dateObj < now);
    return { futureRows, pastRows };
  }, [keywords, search, hideChanged]);

  const columns: GridColDef[] = [
    { field: '演出日期', headerName: '演出日期', flex: 3 },
    {
      field: '演出名称',
      headerName: '演出名称',
      flex: 7,
      renderCell: (params: any) => (
        <span
          style={{ cursor: 'pointer', color: '#1976d2' }}
          onClick={() => setDetailShow(params.row.show)}
        >
          {params.value}
        </span>
      )
    }
  ];

  // 日历占用日期功能预留
  // const occupiedDates = [...futureRows, ...pastRows].map(r => r.演出日期);

  return (
    <div>
      <h1>{officialVenue} 时间表</h1>
      <div className="filter-bar" style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-row search-row" style={{ flex: 1, minWidth: 200 }}>
          <input
            placeholder="搜索演出名称..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
          />
        </div>
        <div className="filter-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={hideChanged}
              onChange={e => setHideChanged(e.target.checked)}
              style={{ accentColor: '#1976d2' }}
            />
            隐藏变更与杂项
          </label>
        </div>
      </div>
      <h2>未来演出</h2>
      <div style={{ height: futureRows.length > 20 ? 600 : 'auto', width: '100%', marginBottom: 32 }}>
        <DataGrid
          rows={futureRows}
          columns={columns}
          disableRowSelectionOnClick
          {...(futureRows.length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
        />
      </div>
      <h2>历史演出</h2>
      <div style={{ height: pastRows.length > 20 ? 600 : 'auto', width: '100%' }}>
        <DataGrid
          rows={pastRows}
          columns={columns}
          disableRowSelectionOnClick
          {...(pastRows.length > 20
            ? {
                initialState: { pagination: { paginationModel: { pageSize: 20, page: 0 } } },
                pageSizeOptions: [20, 50, 100],
              }
            : { autoHeight: true, hideFooter: true })}
        />
      </div>
      {detailShow && (
        <ShowDetailDialog show={detailShow} onClose={() => setDetailShow(null)} />
      )}
    </div>
  );
}
