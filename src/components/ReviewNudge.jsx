import React, { useState } from 'react';
import { useApp } from '../store/AppContext.jsx';
import { Modal, Btn, Stars, Field } from './ui.jsx';
import { SERVICE } from '../utils.js';

// 리뷰 넛지 — 완료된 예약 중 리뷰가 없는 게 있으면 앱 진입 시 별점 모달
export default function ReviewNudge() {
  const { db, nudgeDismissed, setNudgeDismissed, addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  // 가장 최근에 끝난, 아직 리뷰가 없는 완료 예약을 골라요
  const target = db.bookings
    .filter(
      (b) =>
        b.guardianId === db.session.userId &&
        b.status === 'completed' &&
        !db.reviews.some((rv) => rv.bookingId === b.id) &&
        !nudgeDismissed[b.id]
    )
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))[0];
  if (!target || !db.session.onboarded || db.session.mode === 'sitter') return null;

  const dog = db.dogs.find((d) => d.id === target.dogId);
  const sitter = db.sitters.find((s) => s.id === target.sitterId);

  const submit = () => {
    addReview({ bookingId: target.id, authorId: db.session.userId, sitterId: target.sitterId, rating, content: content.trim() || '돌봄이 정말 세심했어요. 감사해요!' });
  };

  return (
    <Modal
      title={`${dog.name} ${SERVICE[target.service].label} 어떠셨어요? 🐾`}
      subtitle={`${sitter.name}님과의 돌봄이 무사히 끝났어요. 리뷰 한 줄이 이웃들에게 큰 도움이 돼요.`}
      onClose={() => setNudgeDismissed({ ...nudgeDismissed, [target.id]: true })}
    >
      <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
        <Stars value={rating} onChange={setRating} />
      </div>
      <Field>
        <textarea
          className="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`${sitter.name}님의 돌봄, 어땠나요? (선택)`}
        />
      </Field>
      <div className="btn-row">
        <Btn variant="ghost" onClick={() => setNudgeDismissed({ ...nudgeDismissed, [target.id]: true })}>나중에 할게요</Btn>
        <Btn onClick={submit}>리뷰 남기기</Btn>
      </div>
    </Modal>
  );
}
