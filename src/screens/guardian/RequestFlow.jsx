import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Btn, Card, TopBar, Chip, Field, Banner } from '../../components/ui.jsx';
import { SERVICE, D, fmtDate, fmtClock, won } from '../../utils.js';

// 요청하기 플로우: 서비스 → 강아지 → 일시 → 주의사항 → 보내기
export default function RequestFlow() {
  const { db, createRequest, push, goTab, showToast } = useApp();
  const myDogs = db.dogs.filter((d) => d.guardianId === db.session.userId);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [dogId, setDogId] = useState(null);
  const [date, setDate] = useState(D(1));
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(30);
  const [cautions, setCautions] = useState('');
  const [route, setRoute] = useState('');

  const dog = db.dogs.find((d) => d.id === dogId);
  const fav = dogId ? db.favorites.find((f) => f.dogId === dogId) : null;
  const favSitter = fav ? db.sitters.find((s) => s.id === fav.sitterId) : null;
  const rate = favSitter ? favSitter.ratePer30 : 13000;
  const amount = rate * (duration / 30);

  const times = [];
  for (let h = 8; h <= 20; h++) { times.push(`${String(h).padStart(2, '0')}:00`); if (h !== 20) times.push(`${String(h).padStart(2, '0')}:30`); }

  const next = () => {
    if (step === 2 && dog) { setCautions(dog.cautions || ''); setRoute(dog.route || ''); }
    setStep(step + 1);
  };

  const submit = () => {
    const id = createRequest({ guardianId: db.session.userId, dogId, service, date, startTime, duration, cautions, route });
    showToast('요청을 보냈어요! 시터님들에게 알림이 갔어요 💬');
    goTab('requests');
    push('matching', { requestId: id });
  };

  const stepTitles = ['', '어떤 돌봄이 필요하세요?', '누구를 돌봐드릴까요?', '언제 만날까요?', '미리 알려주기', '이렇게 요청할게요'];

  return (
    <div>
      <TopBar title={`요청하기 (${step}/5)`} />
      <div className="progress-track" style={{ marginBottom: 18 }}>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className={`seg ${i <= step ? 'on' : ''}`} />)}
      </div>

      {step === 1 && (
        <>
          <h3 className="mt0">{stepTitles[1]}</h3>
          <div style={{ marginTop: 12 }}>
            {[['walk', '이웃 시터님이 강아지와 산책해요', '목줄 체크, 물 챙기기, 안전 산책'], ['visit', '시터님이 댁으로 방문해 돌봐요', '밥·물 급여, 배변 정리, 실내 놀이']].map(([key, desc, sub]) => (
              <Card key={key} className="row between" onClick={() => setService(key)} style={{ borderColor: service === key ? '#3F7D58' : undefined, background: service === key ? '#EAF2EC' : undefined }}>
                <div className="row">
                  <div className="avatar">{SERVICE[key].emoji}</div>
                  <div>
                    <div className="bold">{SERVICE[key].full}</div>
                    <div className="muted">{desc}</div>
                    <div className="muted small">{sub}</div>
                  </div>
                </div>
                {service === key && <span style={{ color: '#3F7D58', fontWeight: 700 }}>✓</span>}
              </Card>
            ))}
            <Card className="row between" style={{ opacity: 0.55 }}>
              <div className="row">
                <div className="avatar">🌞</div>
                <div>
                  <div className="bold" style={{ color: '#7A7065' }}>시터 집 돌봄 (데이케어)</div>
                  <div className="muted small">준비 중이에요</div>
                </div>
              </div>
              <Chip tone="off">준비 중이에요</Chip>
            </Card>
            <Card className="row between" style={{ opacity: 0.55 }}>
              <div className="row">
                <div className="avatar">🎒</div>
                <div>
                  <div className="bold" style={{ color: '#7A7065' }}>시터 집 위탁 (보딩)</div>
                  <div className="muted small">준비 중이에요</div>
                </div>
              </div>
              <Chip tone="off">준비 중이에요</Chip>
            </Card>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="mt0">{stepTitles[2]}</h3>
          <div style={{ marginTop: 12 }}>
            {myDogs.map((d) => (
              <Card key={d.id} className="row between" onClick={() => setDogId(d.id)} style={{ borderColor: dogId === d.id ? '#3F7D58' : undefined, background: dogId === d.id ? '#EAF2EC' : undefined }}>
                <div className="row">
                  <div className="dog-face">{d.emoji}</div>
                  <div>
                    <div className="bold">{d.name} · {d.breed}</div>
                    <div className="muted">{d.weight}kg · {d.age}살 · {d.tags.join(' · ')}</div>
                  </div>
                </div>
                {dogId === d.id && <span style={{ color: '#3F7D58', fontWeight: 700 }}>✓</span>}
              </Card>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="mt0">{stepTitles[3]}</h3>
          <div style={{ marginTop: 12 }}>
            <Field label="날짜">
              <input className="input" type="date" value={date} min={D(0)} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="시작 시간">
              <select className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {times.map((t) => <option key={t} value={t}>{fmtClock(t)}</option>)}
              </select>
            </Field>
            <Field label="돌봄 길이">
              <div className="chips">
                {[30, 60, 90].map((m) => (
                  <Chip key={m} selectable selected={duration === m} onClick={() => setDuration(m)}>{m}분</Chip>
                ))}
              </div>
            </Field>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h3 className="mt0">{stepTitles[4]}</h3>
          <p className="muted" style={{ marginTop: 0 }}>{dog?.name}의 기본 정보를 가져왔어요. 필요하면 고쳐주세요.</p>
          <Field label="주의사항">
            <textarea className="textarea" value={cautions} onChange={(e) => setCautions(e.target.value)} />
          </Field>
          {service === 'walk' && (
            <Field label="선호 산책 경로">
              <textarea className="textarea" value={route} onChange={(e) => setRoute(e.target.value)} placeholder="예) 망원한강공원 물가 둘레길" />
            </Field>
          )}
        </>
      )}

      {step === 5 && (
        <>
          <h3 className="mt0">{stepTitles[5]}</h3>
          <Card style={{ marginTop: 12 }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="dog-face sm">{dog?.emoji}</div>
              <div className="bold">{SERVICE[service].label} · {dog?.name}</div>
            </div>
            <div className="small" style={{ lineHeight: 1.9 }}>
              📅 {fmtDate(date)} · {fmtClock(startTime)}부터 {duration}분<br />
              {cautions && <>⚠️ 주의사항: {cautions}<br /></>}
              {route && <>🛣️ 선호 경로: {route}</>}
            </div>
            <div className="divider" />
            <div className="row between">
              <span className="muted">예상 금액</span>
              <span className="amount">{won(amount)}</span>
            </div>
            <div className="muted small" style={{ marginTop: 4 }}>
              {favSitter ? `${favSitter.name}님 요금 기준 (30분 ${won(favSitter.ratePer30)})` : '동네 평균 요금 기준'}
            </div>
          </Card>
          <Banner tone="info" emoji="🔒">결제는 플랫폼을 통해 안전하게 이뤄져요. 지금은 금액 표시만 제공돼요.</Banner>
          <Banner tone="info" emoji="🤝">전담 시터가 있으면 {favSitter ? `${favSitter.name}님께 먼저 물어본 뒤, 2시간 안에 답이 없으면 이웃 시터들에게 함께 물어봐요.` : '먼저 물어보고, 답이 없으면 이웃 시터들에게 함께 물어봐요.'}</Banner>
        </>
      )}

      {db.session.regionLocked && (
        <Banner tone="warn" emoji="🌱">
          지금은 <b>마포구 망원동·성산동</b>에서만 예약할 수 있어요. 우리 동네 오픈 알림을 기다려주세요!
        </Banner>
      )}
      <div className="btn-row" style={{ marginTop: 16 }}>
        {step > 1 && <Btn variant="ghost" onClick={() => setStep(step - 1)}>이전</Btn>}
        {step < 5 && (
          <Btn disabled={(step === 1 && !service) || (step === 2 && !dogId)} onClick={next}>다음</Btn>
        )}
        {step === 5 && <Btn disabled={db.session.regionLocked} onClick={submit}>요청 보내기 💌</Btn>}
      </div>
    </div>
  );
}
