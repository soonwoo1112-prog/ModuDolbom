import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, TopBar, Banner, Chip } from '../../components/ui.jsx';

// 시터 멤버십 — 거래 수수료가 아니라 월 구독료 구조 안내
export default function Membership() {
  const { db } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);

  return (
    <div>
      <TopBar title="멤버십" />
      <Card>
        <div className="bold" style={{ fontSize: 17, marginBottom: 6 }}>모두돌봄은 수수료를 받지 않아요 🌿</div>
        <div className="small">
          보호자가 내는 금액과 시터님이 받는 금액 사이에 거래 수수료를 끼워두지 않아요.
          대신 시터님은 <b>월 구독료</b>로 모두돌봄을 함께 운영해요.
        </div>
        <div className="divider" />
        <div className="row between">
          <span className="small">내 플랜</span>
          <Chip tone="peach">{me?.plan ?? '미가입'}</Chip>
        </div>
        <div className="row between" style={{ marginTop: 8 }}>
          <span className="small">월 구독료</span>
          <span className="amount">금액 추후 확정</span>
        </div>
      </Card>

      <Card>
        <div className="bold" style={{ marginBottom: 10 }}>구독료는 이렇게 정해져요</div>
        <div className="small" style={{ lineHeight: 2 }}>
          ⭐ 평점이 높으면 구독료가 <b>할인</b>돼요 — 돌봄의 질이 그대로 혜택으로 돌아와요.<br />
          🔐 가입 시 <b>보증금</b>이 있어요 — 안전한 돌봄을 위한 예치금이고, 탈퇴 시 돌려드려요.<br />
          🧾 결제 시 <b>3.3% 원천징수</b>는 플랫폼이 자동으로 처리해요 — 따로 신경 쓰지 않으셔도 돼요.
        </div>
      </Card>

      <Card>
        <div className="bold" style={{ marginBottom: 10 }}>보호자 신뢰를 높이는 선택 (의무 아님!)</div>
        <div className="small" style={{ lineHeight: 2 }}>
          📍 <b>산책 GPS 공유</b> — 보호자님이 실시간으로 산책 경로를 확인해요.<br />
          📹 <b>액션캠 사용</b> — 돌봄 장면을 짧게 남겨 드려요.<br />
          <span className="muted">둘 다 선택이에요. 켜두면 예약 확정률이 올라가요 📈</span>
        </div>
      </Card>

      <Banner tone="info" emoji="🌱">지금은 안내만 제공돼요 — 구독 결제는 곧 열려요.</Banner>
    </div>
  );
}
