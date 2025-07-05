"use client";
import React, { useEffect, useState } from "react";

export default function CheckingUpdate({ lastInfo, color = '#fff' }: { lastInfo: { 检查时间: string; 新增数量: number } | null, color?: string }) {
  const [isChecking, setIsChecking] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const min = now.getMinutes();
      setIsChecking(min < 5);
      setMinutesLeft(min < 5 ? 0 : 60 - min);
    };
    update();
    const timer = setInterval(update, 1000 * 10);
    return () => clearInterval(timer);
  }, []);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', color, fontSize: 12, lineHeight: '20px', verticalAlign: 'middle' }}>
      {isChecking ? (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            style={{ marginRight: 4, display: 'inline-block', animation: 'spin 1s linear infinite' }}
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M7 1a6 6 0 0 1 6 6"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
          正在检查更新
        </>
      ) : (
        <>
          <span style={{ marginRight: 4, width: 14, display: 'inline-block' }} />
          下次检查：{minutesLeft}分钟后
        </>
      )}
      <span style={{ margin: '0 6px', opacity: 0.7 }}>|</span>
      {lastInfo && (
        <>
          上次更新：{lastInfo.检查时间}
          <span style={{ margin: '0 6px', opacity: 0.7 }}>|</span>
          新增数量：{lastInfo.新增数量}
        </>
      )}
    </span>
  );
}
