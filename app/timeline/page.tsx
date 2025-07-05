'use client';
import { getOfficialVenueName, stripVenueAddress } from '@/components/venueUtils';
import { useState, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';
import ShowTable, { Show } from '@/components/ShowTable';
import showsData from '@/data/data.json';
import { isMiscOrHidden } from '@/components/miscFilterUtils';

export default function TimelinePage() {
  const [selectedNats, setSelectedNats] = useState<string[]>(['日本']); // 默认日本
  const [hideChanged, setHideChanged] = useState(true);
  // 新的国籍分组
  const NATION_LIST = ['中国', '日本', '俄罗斯', '英美', '其他'];
  function mapNation(nat: string) {
    if (nat === '中国') return '中国';
    if (nat === '日本') return '日本';
    if (nat === '俄罗斯') return '俄罗斯';
    if (nat === '英国' || nat === '美国') return '英美';
    return '其他';
  }

  const today = new Date();
  const days = useMemo(() => Array.from({ length: 60 }).map((_, i) => addDays(today, i)), []);

  const showsByDay = useMemo(() => {
    const map: Record<string, Show[]> = {};
    days.forEach(d => map[format(d, 'yyyy-MM-dd')] = []);
    (showsData as Show[]).forEach(show => {
      // 国籍筛选
      if (selectedNats.length > 0) {
        const actorNats = show.出演者名单?.map(a => mapNation(a.国籍)) || [];
        if (!actorNats.some(n => selectedNats.includes(n))) return;
      }
      if (hideChanged && show.许可事项类型 !== '新办') return;
      if (hideChanged && isMiscOrHidden(show)) return;
      // 优先使用演出日期数据字段
      if (Array.isArray(show.演出日期数据) && show.演出日期数据.length > 0) {
        show.演出日期数据.forEach((dateStr: string) => {
          if (map[dateStr]) {
            map[dateStr].push(show);
          }
        });
      } else {
        days.forEach(d => {
          const ds = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
          if (show.演出日期.includes(ds)) {
            map[format(d, 'yyyy-MM-dd')].push(show);
          }
        });
      }
    });
    return map;
  }, [selectedNats, hideChanged, days]);

  return (
    <div>
      <h1>时间线</h1>
      <div className="filter-bar" style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-row nation-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 200 }}>
          {NATION_LIST.map(nat => (
            <label key={nat} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="checkbox"
                checked={selectedNats.includes(nat)}
                onChange={() => {
                  setSelectedNats(prev =>
                    prev.includes(nat) ? prev.filter(x => x !== nat) : [...prev, nat]
                  );
                }}
                style={{ accentColor: '#1976d2' }}
              />
              {nat}
            </label>
          ))}
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
      {days.map(d => {
        const key = format(d, 'yyyy-MM-dd');
        const list = showsByDay[key];
        return list.length > 0 ? (
          <div key={key} style={{ marginBottom: 32 }}>
            <h2>
              {format(d, 'yyyy-MM-dd')} （{format(d, 'EEEE', { locale: zhCN })}）
            </h2>
            <ShowTable shows={list.map(show => ({
              ...show,
              演出场所: getOfficialVenueName(show.演出场所) || stripVenueAddress(show.演出场所)
            }))} hideChanged={hideChanged} />
          </div>
        ) : null;
      })}
    </div>
  );
}
