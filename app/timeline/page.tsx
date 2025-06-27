'use client';
import { useState, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import ShowTable, { Show } from '@/components/ShowTable';
import showsData from '@/data/data.json';

export default function TimelinePage() {
  const [selectedNats, setSelectedNats] = useState<string[]>(['日本']); // 默认日本
  const NATION_LIST = ['中国','日本','俄罗斯','英国','美国','中国台湾'];

  const today = new Date();
  const days = useMemo(() => Array.from({ length: 30 }).map((_, i) => addDays(today, i)), []);

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
      days.forEach(d => {
        const ds = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
        if (show.演出日期.includes(ds)) {
          map[format(d, 'yyyy-MM-dd')].push(show);
        }
      });
    });
    return map;
  }, [days, selectedNats]);

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
      </div>
      {days.map(d => {
        const key = format(d, 'yyyy-MM-dd');
        const list = showsByDay[key];
        return list.length > 0 ? (
          <div key={key} style={{ marginBottom: 32 }}>
            <h2>
              {format(d, 'yyyy-MM-dd')} （{format(d, 'EEEE')}）
            </h2>
            <ShowTable shows={list} />
          </div>
        ) : null;
      })}
    </div>
  );
}
