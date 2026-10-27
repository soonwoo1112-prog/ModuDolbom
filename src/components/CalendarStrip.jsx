import React from 'react';
import { isoOf } from '../utils.js';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// 이번 주(오늘부터 7일) 미니 캘린더 스트립 — 예약 있는 날에 강아지 얼굴
// marks: { 'YYYY-MM-DD': '🐩' }
export default function CalendarStrip({ marks = {}, onPick }) {
  const base = new Date(); base.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i);
    days.push({ iso: isoOf(d), dow: WEEK[d.getDay()], day: d.getDate(), emoji: marks[isoOf(d)] });
  }
  return (
    <div className="cal-strip">
      {days.map((d, i) => (
        <button
          key={d.iso}
          className={`cal-strip-cell ${i === 0 ? 'today' : ''} ${d.emoji ? 'marked' : ''}`}
          onClick={onPick ? () => onPick(d.iso) : undefined}
        >
          <span className="dow">{d.dow}</span>
          <span className="num">{d.day}</span>
          {d.emoji
            ? <span className="mark">{d.emoji}</span>
            : <span className="mark dim">·</span>}
        </button>
      ))}
    </div>
  );
}
