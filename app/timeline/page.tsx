'use client';
import { getOfficialVenueName, stripVenueAddress } from '@/components/venueUtils';
import { useState, useMemo, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';
import ShowTable, { Show } from '@/components/ShowTable';
import showsData from '@/data/data.json';

export default function TimelinePage() {
  const [selectedNats, setSelectedNats] = useState<string[]>(['日本']); // 默认日本
  const [hideChanged, setHideChanged] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const NATION_LIST = ['中国','日本','俄罗斯','英国','美国','中国台湾'];

  const today = new Date();
  const days = useMemo(() => Array.from({ length: 60 }).map((_, i) => addDays(today, i)), []);

  const showsByDay = useMemo(() => {
    const map: Record<string, Show[]> = {};
    days.forEach(d => map[format(d, 'yyyy-MM-dd')] = []);
    (showsData as Show[]).forEach(show => {
      // 国籍筛选
      if (selectedNats.length > 0) {
        const actorNats = show.演员名单?.map(a =>
          NATION_LIST.includes(a.国籍) ? a.国籍 : '其他'
        ) || [];
        if (!actorNats.some(n => selectedNats.includes(n))) return;
      }
      if (hideChanged && show.许可事项类型 !== '新办') return;
      days.forEach(d => {
        const ds = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
        if (show.演出日期.includes(ds)) {
          map[format(d, 'yyyy-MM-dd')].push(show);
        }
      });
    });
    return map;
  }, [days, selectedNats, hideChanged]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <h1>时间线</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>国籍筛选：</strong>
        {['中国','日本','俄罗斯','英国','美国','中国台湾','其他'].map(nat => (
          <label key={nat} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={selectedNats.includes(nat)}
              onChange={() =>
                setSelectedNats(prev =>
                  prev.includes(nat) ? prev.filter(x => x !== nat) : [...prev, nat]
                )
              }
            />
            {nat}
          </label>
        ))}
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={hideChanged}
            onChange={e => setHideChanged(e.target.checked)}
          />
          隐藏变更
        </label>
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
            }))} isMobile={isMobile} />
          </div>
        ) : null;
      })}
    </div>
  );
}
