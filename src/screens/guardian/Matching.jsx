import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Pill, Banner, Stars, Empty } from '../../components/ui.jsx';
import { SERVICE, fmtDate, fmtClock, won, remainingTime } from '../../utils.js';

// 매칭 상태 화면 — 전담 시터 우선 물어보기 → 이웃 동시 요청 → 확정
export default function Matching({ params }) {
  const { db, push, advanceRequest } = useApp();
  const req = db.requests.find((r) => r.id === params.requestId);
  if (!req) return <Empty text="요청을 찾을 수 없어요" />;
  const dog = db.dogs.find((d) => d.id === req.dogId);
  const favorite = db.favorites.find((f) => f.dogId === req.dogId);
  const favSitter = favorite ? db.sitters.find((s) => s.id === favorite.sitterId) : null;
  const confirmedSitter = req.confirmedSitterId ? db.sitters.find((s) => s.id === req.confirmedSitterId) : null;
  const booking = req.confirmedSitterId
    ? db.bookings.find((b) => b.requestId === req.id)
    : null;
  const neighborCount = req.requestedSitterIds.length;
  const remain = remainingTime(req.dedicatedDeadline);

  const stepIndex = req.status === 'confirmed' ? 3 : req.status === 'asking_neighbors' ? 2 : favorite && req.status === 'awaiting_dedicated' ? 1 : 2;

  return (
    <div>
      <TopBar title="매칭 상태" />
      <Card>
        <div className="row" style={{ marginBottom: 4 }}>
          <div className="dog-face sm">{dog.emoji}</div>
          <div className="grow">
            <div className="bold">{SERVICE[req.service].label} · {dog.name}</div>
            <div className="muted">{fmtDate(req.date)} {fmtClock(req.startTime)} · {req.duration}분</div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="steps">
          {favorite && (
            <div className={`step ${stepIndex >= 1 ? 'done' : ''} ${stepIndex === 1 && req.status === 'awaiting_dedicated' ? 'now' : ''}`}>
              <div className="rail"><div className="dot">1</div><div className="line" /></div>
              <div className="body">
                <b>전담 시터에게 먼저 물어봐요</b>
                <p>{favSitter ? `${favSitter.name}님께 먼저 요청을 보냈어요.` : ''}</p>
              </div>
            </div>
          )}
          <div className={`step ${stepIndex >= 2 ? 'done' : ''} ${req.status === 'asking_neighbors' ? 'now' : ''}`}>
            <div className="rail"><div className="dot">{favorite ? 2 : 1}</div><div className="line" /></div>
            <div className="body">
              <b>동네 이웃 시터에게 함께 물어봐요</b>
              <p>먼저 수락한 분과 연결돼요.</p>
            </div>
          </div>
          <div className={`step ${req.status === 'confirmed' ? 'now done' : ''}`}>
            <div className="rail"><div className="dot">{favorite ? 3 : 2}</div></div>
            <div className="body">
              <b>연결 완료!</b>
              <p>예약이 확정되고 채팅이 열려요.</p>
            </div>
          </div>
        </div>
      </Card>

      {req.status === 'awaiting_dedicated' && favSitter && (
        <Banner tone="warn" emoji="⏳">
          <b>{favSitter.name}님에게 먼저 물어보고 있어요.</b><br />
          {remain
            ? `${remain} 안에 답이 없으면 동네 이웃 시터들에게 함께 물어볼게요.`
            : '곧 이웃 시터들에게 함께 물어볼게요.'}
        </Banner>
      )}

      {req.status === 'asking_neighbors' && (
        <>
          <Banner tone="info" emoji="📣">
            <b>동네 이웃 시터 {neighborCount}명에게 동시에 물어보고 있어요</b><br />
            먼저 수락한 분과 연결돼요.
          </Banner>
          <Card>
            <div className="bold mb0" style={{ marginBottom: 10 }}>요청을 보낸 시터님들</div>
            {req.requestedSitterIds.map((sid) => {
              const s = db.sitters.find((x) => x.id === sid);
              if (!s) return null;
              return (
                <div key={sid} className="row between" style={{ padding: '7px 0' }}>
                  <div className="row">
                    <div className="avatar sm">{s.emoji}</div>
                    <div>
                      <div className="small bold">{s.name}님</div>
                      <div className="muted small">{s.neighborhood}</div>
                    </div>
                  </div>
                  <Pill tone="ask">답변 기다리는 중</Pill>
                </div>
              );
            })}
          </Card>
        </>
      )}

      {req.status === 'confirmed' && confirmedSitter && (
        <>
          <Banner tone="info" emoji="🎉"><b>{confirmedSitter.name}님이 수락했어요!</b> 예약이 확정됐어요.</Banner>
          <Card>
            <div className="row">
              <div className="avatar">{confirmedSitter.emoji}</div>
              <div className="grow">
                <div className="bold">{confirmedSitter.name}님 <Stars value={confirmedSitter.rating} small /></div>
                <div className="muted">📍 {confirmedSitter.neighborhood} · 리뷰 {confirmedSitter.reviewCount}개</div>
              </div>
            </div>
            {booking && (
              <>
                <div className="divider" />
                <div className="small" style={{ lineHeight: 1.9 }}>
                  📅 {fmtDate(booking.date)} · {fmtClock(booking.startTime)}부터 {booking.duration}분<br />
                  💰 {won(booking.amount)} <span className="muted">(플랫폼을 통해 안전하게 결제돼요)</span><br />
                  🤝 이 시터님과 {booking.meetingNumber}번째 만남이에요
                </div>
              </>
            )}
          </Card>
          <div className="btn-row">
            {booking && <Btn onClick={() => push('chat', { bookingId: booking.id })}>💬 채팅 열기</Btn>}
            {booking && <Btn variant="soft" onClick={() => push('bookingDetail', { bookingId: booking.id })}>예약 상세 보기</Btn>}
          </div>
        </>
      )}

      {req.status !== 'confirmed' && (
        <>
          <Banner tone="info" emoji="🔒">확정되기 전까지는 시터님과 대화하지 않아요. 서로 부담 없이 매칭돼요.</Banner>
          <Btn full variant="ghost" onClick={() => advanceRequest(req.id)}>
            ⏩ (데모) 다음 단계 미리보기
          </Btn>
        </>
      )}
    </div>
  );
}
