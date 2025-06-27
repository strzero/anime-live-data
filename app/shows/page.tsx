'use client';
import { useState, useMemo } from 'react';
import ShowTable, { Show } from '@/components/ShowTable';
import showsData from '@/data/data.json';

export default function ShowsPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedNats, setSelectedNats] = useState<string[]>(['日本']); // 默认日本
  const [selectedDate, setSelectedDate] = useState('');

  const NATION_LIST = ['中国','日本','俄罗斯','英国','美国','中国台湾'];

  const filteredShows = useMemo<Show[]>(() => {
    return (showsData as Show[]).filter(show => {
      if (searchText && !show.演出名称.includes(searchText)) return false;
      if (selectedNats.length > 0) {
        const actorNats = show.演员名单?.map(a =>
          NATION_LIST.includes(a.国籍) ? a.国籍 : '其他'
        ) || [];
        if (!actorNats.some(n => selectedNats.includes(n))) return false;
      }
      if (selectedDate && !show.演出日期数据?.includes(selectedDate)) return false;
      return true;
    });
  }, [searchText, selectedNats, selectedDate]);

  return (
    <div>
      <h1>演出列表</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <input
          placeholder="搜索演出名称..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        {['中国','日本','俄罗斯','英国','美国','中国台湾','其他'].map(nat => (
          <label key={nat} style={{ whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={selectedNats.includes(nat)}
              onChange={() => {
                setSelectedNats(prev =>
                  prev.includes(nat) ? prev.filter(x => x !== nat) : [...prev, nat]
                );
              }}
            />
            {nat}
          </label>
        ))}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      <ShowTable shows={filteredShows} />
    </div>
  );
}
