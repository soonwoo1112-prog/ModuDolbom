import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Pill, Empty } from '../../components/ui.jsx';
import { SERVICE, REQ_STATUS, fmtDate, fmtClock } from '../../utils.js';

// 보호자 '요청' 탭 — 보낸 돌봄 요청 목록
export default function Requests() {
  const { db, push } = useApp();
  const my = db.requests.filter((r) => r.guardianId === db.session.userId);

  return (
    <div>
      <TopBar
        title="돌봄 요청"
        right={<Btn small onClick={() => push('requestFlow')}>+ 새 요청</Btn>}
      />
      {my.length === 0 && <Empty emoji="📭" text="보낸 요청이 아직 없어요. 홈에서 산책을 부탁해보세요!" />}
      {my.map((r) => {
        const dog = db.dogs.find((d) => d.id === r.dogId);
        const st = REQ_STATUS[r.status];
        return (
          <Card key={r.id} onClick={() => push('matching', { requestId: r.id })}>
            <div className="row between">
              <div className="row">
                <div className="dog-face sm">{dog.emoji}</div>
                <div>
                  <div className="bold">{SERVICE[r.service].emoji} {SERVICE[r.service].label} · {dog.name}</div>
                  <div className="muted">{fmtDate(r.date)} {fmtClock(r.startTime)} · {r.duration}분</div>
                </div>
              </div>
              <Pill tone={st.pill}>{st.label}</Pill>
            </div>
            <div className="small muted" style={{ marginTop: 8 }}>
              매칭 상태 보기 ›
            </div>
          </Card>
        );
      })}
    </div>
  );
}
