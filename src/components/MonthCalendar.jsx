import React, { useState } from 'react';
import { isoOf, todayISO, addDaysISO } from '../utils.js';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// 월간 캘린더 — 예약 있는 날 하이라이트, 같은 강아지의 연속 일정은 막대처럼 이어지고
// 강아지 사진(이모지)은 시작 칸에 표시. 예약 있는 날짜를 누르면 그날 목록 콜백.
// marks: { 'YYYY-MM-DD': '🐩' }
export default function MonthCalendar({ marks = {}, onPick }) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });

  const first = new Date(ym.y, ym.m, 1);
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(ym.y, ym.m, d));
  while (cells.length % 7) cells.push(null);

  const today = todayISO();
  const shift = (n) => setYm(({ y, m }) => {
    const d = new Date(y, m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <div className="cal-month">
      <div className="cal-head">
        <button className="cal-nav" onClick={() => shift(-1)}>‹</button>
        <span className="cal-title">{ym.y}년 {ym.m + 1}월</span>
        <button className="cal-nav" onClick={() => shift(1)}>›</button>
      </div>
      <div className="cal-grid">
        {WEEK.map((w) => <div key={w} className={`cal-dow ${w === '일' ? 'sun' : ''}`}>{w}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`x${i}`} className="cal-cell blank" />;
          const iso = isoOf(d);
          const emoji = marks[iso];
          const hasBar = !!emoji;
          // 막대의 시작/끝: 이전·다음 날짜의 강아지가 같은지로 판단 (주 경계도 자연히 끊김)
          const barStart = hasBar && marks[addDaysISO(iso, -1)] !== emoji;
          const barEnd = hasBar && marks[addDaysISO(iso, 1)] !== emoji;
          return (
            <button
              key={iso}
              className={[
                'cal-cell',
                hasBar ? 'bar' : '',
                barStart ? 'bar-start' : '',
                barEnd ? 'bar-end' : '',
                iso === today ? 'today' : '',
                d.getDay() === 0 ? 'sun' : '',
              ].join(' ')}
              onClick={hasBar && onPick ? () => onPick(iso) : undefined}
              disabled={!hasBar}
            >
              <span className="num">{d.getDate()}</span>
              {barStart && <span className="cal-emoji">{emoji}</span>}
            </button>
          );
        })}
      </div>
      <div className="muted small" style={{ marginTop: 8, textAlign: 'center' }}>
        예약 있는 날을 누르면 그날 돌봄 목록이 나와요
      </div>
    </div>
  );
}
