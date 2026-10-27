import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Empty, TopBar } from '../../components/ui.jsx';
import { fmtDate } from '../../utils.js';

// 채팅 탭 — 예약이 확정된 상대와의 대화 목록
// 확정 전 요청 상대와는 채팅이 열리지 않아요
export default function ChatList() {
  const { db, push } = useApp();
  const me = db.users.find((u) => u.id === db.session.userId);
  const mySitter = db.sitters.find((s) => s.userId === db.session.userId);
  const isSitterMode = db.session.mode === 'sitter';

  const chats = db.chats
    .filter((c) => (isSitterMode ? c.sitterId === mySitter?.id : c.guardianId === me.id))
    .map((c) => {
      const booking = db.bookings.find((b) => b.id === c.bookingId);
      const dog = booking ? db.dogs.find((d) => d.id === booking.dogId) : null;
      const other = isSitterMode
        ? { emoji: db.users.find((u) => u.id === c.guardianId)?.photo || '🙂', name: db.users.find((u) => u.id === c.guardianId)?.name }
        : { emoji: db.sitters.find((s) => s.id === c.sitterId)?.emoji || '🙂', name: db.sitters.find((s) => s.id === c.sitterId)?.name };
      const last = c.messages[c.messages.length - 1];
      return { ...c, dog, other, last };
    })
    .filter((c) => c.dog);

  return (
    <div>
      <TopBar title="채팅" />
      <div className="muted small" style={{ marginBottom: 10 }}>
        예약이 확정된 시터님·보호자님과만 대화가 열려요 💬
      </div>
      {chats.length === 0 && <Empty emoji="👋" text="아직 채팅이 없어요 — 예약이 확정되면 자동으로 열려요" />}
      {chats.map((c) => (
        <div key={c.id} className="card click" onClick={() => push('chat', { bookingId: c.bookingId })}>
          <div className="row">
            <div className="avatar">{c.other.emoji}</div>
            <div className="grow">
              <div className="row between">
                <span className="bold">{c.other.name}님 <span className="muted">· {c.dog.name} {c.dog.emoji}</span></span>
                <span className="muted small">{c.last ? fmtDate(c.last.time) : ''}</span>
              </div>
              <div className="muted" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {c.last ? c.last.text : '먼저 인사를 건네보세요!'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
