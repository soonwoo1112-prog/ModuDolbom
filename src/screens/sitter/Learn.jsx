import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Banner } from '../../components/ui.jsx';

const ARTICLES = [
  {
    id: 'a1', emoji: '🐕', title: '강아지 행동 이해', minutes: 4,
    body: [
      '강아지의 꼬리, 귀, 몸의 자세는 말보다 많은 걸 알려줘요. 꼬리를 살랑살랑 흔들며 몸을 낮추고 앞발을 들면 "같이 놀자"는 초대예요.',
      '하품을 자주 하거나 몸을 털면 스트레스 신호예요. 잠깐 쉬어가는 게 좋아요.',
      '낯선 강아지를 만났을 때는 코를 맞대게 두세요. 사람처럼 얼굴을 마주 보고 서 있는 건 강아지에게 부담이에요.',
      '리드가 팽팽해지면 잠깐 멈추고 기다려요. 강아지가 차분해진 뒤 다시 걸으면 리드는 다시 느슨해져요.',
    ],
    quiz: [
      { q: '강아지가 앞발을 들고 엉덩이를 흔들면 무슨 뜻일까요?', options: ['공격하려는 거예요', '같이 놀자는 초대예요', '졸린 거예요'], answer: 1 },
      { q: '산책 중 리드가 팽팽해지면?', options: ['힘껏 끌어당겨요', '잠깐 멈추고 기다려요', '달리기 시합을 해요'], answer: 1 },
    ],
  },
  {
    id: 'a2', emoji: '🚨', title: '위험 신호 알아보기', minutes: 5,
    body: [
      '입술을 들어올려 이빨을 보이고, 몸이 굳고 꼬리가 올라가 있으면 "가까이 오지 마세요"라는 경고예요. 이때는 조용히 거리를 벌려요.',
      '하품·핥기·눈을 피하는 건 스트레스 신호예요. 쉬는 자리나 그늘로 이동해요.',
      '길가의 닭뼈, 초콜릿, 포도, 양파는 강아지에게 독이에요. 떨어진 걸 주우려고 입을 벌리면 부드럽게 말려요.',
    ],
    quiz: [
      { q: '이빨을 보이며 몸이 굳은 강아지를 봤어요. 어떻게 할까요?', options: ['쓰다듬으며 안심시켜요', '조용히 거리를 벌려요', '큰 소리로 혼내요'], answer: 1 },
      { q: '강아지가 먹으면 안 되는 것은?', options: ['치즈', '포도', '삶은 닭고기'], answer: 1 },
    ],
  },
  {
    id: 'a3', emoji: '🩹', title: '산책 중 응급처치', minutes: 6,
    body: [
      '발바닥을 절뚝거릴 때: 즉시 산책을 멈추고 발바닥 사이를 확인해요. 유리조각이나 못이 박혀 있으면 빼지 말고 수건으로 감싸고 병원으로 가요.',
      '여름엔 아스팔트 온도를 손등으로 확인해요. 5초 이상 뜨겁다면 산책을 미뤄요. 강아지는 땀을 잘 못 흘려요.',
      '다른 강아지와 얽혔을 때는 절대 몸으로 말리지 말고, 각자의 리드를 반대 방향으로 당기며 큰 소리로 제지해요.',
      '응급 상황엔 보호자에게 먼저 연락해요. 채팅이 열려 있으면 바로 사진과 위치를 남겨요.',
    ],
    quiz: [
      { q: '발바닥에 못이 박힌 것 같아요. 어떻게 하나요?', options: ['직접 빼요', '빼지 말고 병원으로 가요', '그냥 걸어봐요'], answer: 1 },
      { q: '여름철 산책 전 확인할 것은?', options: ['아스팔트 온도', '강아지 목걸이 색', '날씨 예보의 습도'], answer: 0 },
    ],
  },
];

// 시터 '배우기' 탭 — 짧은 아티클 + 퀴즈, 모두 이수하면 교육 배지 (선택 사항)
export default function Learn() {
  const { db, completeArticle } = useApp();
  const [selected, setSelected] = useState(null);
  const done = db.learnDone;
  const allDone = ARTICLES.every((a) => done.includes(a.id));

  if (selected) {
    return <Lesson article={selected} onDone={() => { completeArticle(selected.id); setSelected(null); }} onClose={() => setSelected(null)} alreadyDone={done.includes(selected.id)} />;
  }

  return (
    <div>
      <TopBar title="배우기 (선택)" />
      <Banner tone="info" emoji="🌿">
        의무가 아니에요 — 이수하면 프로필에 <b>🎓 교육 배지</b>가 붙어요. 조금씩 읽고 풀어보세요.
      </Banner>
      {allDone && <Banner tone="warn" emoji="🎉"><b>축하해요! 교육 배지를 모두 획득했어요.</b></Banner>}

      {ARTICLES.map((a) => (
        <Card key={a.id} onClick={() => setSelected(a)} className="row between">
          <div className="row">
            <div className="avatar">{a.emoji}</div>
            <div>
              <div className="bold">{a.title}</div>
              <div className="muted small">약 {a.minutes}분 · 아티클 + 퀴즈</div>
            </div>
          </div>
          {done.includes(a.id) ? <Chip tone="green">✓ 이수</Chip> : <span className="muted">읽기 ›</span>}
        </Card>
      ))}
    </div>
  );
}

function Lesson({ article, onDone, onClose, alreadyDone }) {
  const [answers, setAnswers] = useState({});
  const [tried, setTried] = useState(false);
  const correctCount = article.quiz.filter((q, i) => answers[i] === q.answer).length;
  const passed = correctCount === article.quiz.length;

  return (
    <div>
      <TopBar title={article.title} onBack={onClose} />
      <Card>
        {article.body.map((p, i) => (
          <p key={i} style={{ fontSize: 14.5, lineHeight: 1.85, marginBottom: 10 }}>{p}</p>
        ))}
      </Card>

      <div className="section-title"><h3>확인 퀴즈</h3></div>
      {article.quiz.map((q, qi) => (
        <Card key={qi}>
          <div className="bold small" style={{ marginBottom: 10 }}>{qi + 1}. {q.q}</div>
          {q.options.map((opt, oi) => {
            const picked = answers[qi] === oi;
            const show = tried;
            return (
              <button
                key={oi}
                className={`quiz-opt ${show && picked ? (oi === q.answer ? 'correct' : 'wrong') : ''}`}
                onClick={() => setAnswers({ ...answers, [qi]: oi })}
              >
                <span>{String.fromCharCode(65 + oi)}</span>
                <span className="grow">{opt}</span>
                {picked && <span>●</span>}
              </button>
            );
          })}
        </Card>
      ))}

      {tried && !passed && (
        <Banner tone="danger" emoji="😅">아직 조금 남았어요! 틀린 문제를 다시 골라볼까요?</Banner>
      )}
      <div className="btn-row" style={{ marginTop: 12 }}>
        <Btn variant="ghost" onClick={onClose}>나중에 읽을게요</Btn>
        {alreadyDone || passed ? (
          <Btn onClick={onDone}>✓ 이수 완료</Btn>
        ) : (
          <Btn onClick={() => setTried(true)}>정답 확인</Btn>
        )}
      </div>
    </div>
  );
}
