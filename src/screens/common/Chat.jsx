import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { TopBar, Empty } from '../../components/ui.jsx';
import { SERVICE, fmtDate } from '../../utils.js';

// 1:1 채팅 — 예약 확정 후에만 열려요
export default function Chat({ params }) {
  const { db, ensureChat, sendMessage, push } = useApp();
  const [text, setText] = useState('');
  const booking = db.bookings.find((b) => b.id === params.bookingId);
  const chat = db.chats.find((c) => c.bookingId === params.bookingId);

  useEffect(() => {
    if (params.bookingId) ensureChat(params.bookingId);
  }, [params.bookingId]);

  if (!booking) return <Empty emoji="🔍" text="예약을 찾을 수 없어요" />;

  const dog = db.dogs.find((d) => d.id === booking.dogId);
  const isGuardian = booking.guardianId === db.session.userId;
  const other = db.sitters.find((s) => s.id === booking.sitterId);
  const otherName = isGuardian
    ? `${other?.name}님 (시터)`
    : `${db.users.find((u) => u.id === booking.guardianId)?.name}님 (보호자)`;

  const submit = () => {
    if (!text.trim()) return;
    sendMessage(chat?.id, text.trim());
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 180px)' }}>
      <TopBar title={`💬 ${otherName}`} />
      <div className="muted small" style={{ marginBottom: 10, padding: '0 2px' }}>
        {dog.name} {SERVICE[booking.service].label} · {fmtDate(booking.date)} — 예약이 확정되어 채팅이 열렸어요
      </div>
      <div className="chat-list">
        {(chat?.messages || []).map((m, i) => {
          const mine = isGuardian ? m.from === 'guardian' : m.from === 'sitter';
          return (
            <div key={i} className={`bubble ${mine ? 'me' : 'them'}`}>{m.text}</div>
          );
        })}
        {(chat?.messages || []).length === 0 && (
          <Empty emoji="👋" text="먼저 인사를 건네보세요! 만나는 장소나 강아지 상태를 이야기해요" />
        )}
      </div>
      <div className="chat-input">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="메시지를 입력하세요"
        />
        <button className="btn btn-primary" onClick={submit}>보내기</button>
      </div>
    </div>
  );
}
