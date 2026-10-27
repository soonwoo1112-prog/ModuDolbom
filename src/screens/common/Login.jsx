import React from 'react';
import { useApp } from '../../store/AppContext.jsx';

// 첫 화면: 소셜 로그인 목업 — 누르면 온보딩(동네 선택 → 역할 선택)으로 넘어가요
export default function Login() {
  const { login } = useApp();
  return (
    <div className="app-shell login-shell">
      <div className="login-hero">
        <div className="login-art">
          <span className="la-1">🐕</span>
          <span className="la-2">🌿</span>
          <span className="la-3">🐾</span>
          <span className="la-4">🐩</span>
        </div>
        <div className="login-logo">🐾</div>
        <h1 className="login-name">모두돌봄</h1>
        <p className="login-tag">동네가 함께 돌봐요</p>
        <p className="login-sub">가까운 이웃이 같은 강아지를 반복해서 돌봐주는<br />동네 돌봄 앱</p>
      </div>

      <div className="login-actions">
        <button className="social-btn kakao" onClick={login}>
          <span className="s-ico">💬</span> 카카오로 시작하기
        </button>
        <button className="social-btn naver" onClick={login}>
          <span className="s-ico n">N</span> 네이버로 시작하기
        </button>
        <button className="social-btn apple" onClick={login}>
          <span className="s-ico"></span> Apple로 시작하기
        </button>
        <button className="email-link" onClick={login}>이메일로 시작하기</button>
      </div>

      <p className="login-foot">지금은 목업 화면이에요 — 어떤 버튼을 눌러도 온보딩으로 넘어가요 🌱</p>
    </div>
  );
}
