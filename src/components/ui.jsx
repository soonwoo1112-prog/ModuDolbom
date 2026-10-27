import React from 'react';

// 공용 UI 프리미티브 — 모두돌봄 문구·디자인 토큰 기준

export const Btn = ({ children, onClick, variant = 'primary', disabled, full, small, big, className = '', style }) => (
  <button
    className={`btn btn-${variant} ${full ? 'full' : ''} ${small ? 'sm' : ''} ${big ? 'big' : ''} ${className}`}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {children}
  </button>
);

export const Card = ({ children, onClick, className = '', style }) => (
  <div className={`card ${onClick ? 'click' : ''} ${className}`} onClick={onClick} style={style}>
    {children}
  </div>
);

export const Chip = ({ children, tone = '', selected, onClick, className = '' }) => (
  <span
    className={`chip ${tone} ${selected ? 'selected' : ''} ${onClick ? 'selectable' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </span>
);

export const Pill = ({ tone, children }) => <span className={`pill ${tone}`}>{children}</span>;

export const SectionTitle = ({ children, action }) => (
  <div className="section-title">
    <h3>{children}</h3>
    {action}
  </div>
);

export const TopBar = ({ title, onBack, right }) => (
  <div className="topbar">
    {onBack && <button className="back-btn" onClick={onBack}>‹</button>}
    <h2>{title}</h2>
    {right}
  </div>
);

export const Avatar = ({ emoji, tone = 'green', size = '' }) => (
  <div className={`avatar ${size}`}>{emoji}</div>
);

export const Stars = ({ value = 0, onChange, small }) => (
  <div className={`stars ${small ? 'small' : ''}`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`star ${i <= Math.round(value) ? 'on' : ''}`}
        onClick={onChange ? () => onChange(i) : undefined}
      >
        {onChange ? '★' : '★'}
      </span>
    ))}
  </div>
);

export const Field = ({ label, children, hint, style }) => (
  <div className="field" style={style}>
    {label && <label>{label}</label>}
    {children}
    {hint && <div className="hint">{hint}</div>}
  </div>
);

export const Banner = ({ tone = 'info', emoji, children }) => (
  <div className={`banner ${tone}`}>
    <span>{emoji}</span>
    <div>{children}</div>
  </div>
);

export const Empty = ({ emoji, text }) => (
  <div className="empty">
    <div className="e">{emoji}</div>
    <div>{text}</div>
  </div>
);

export const Modal = ({ title, children, onClose, subtitle }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      {title && <h3>{title}</h3>}
      {subtitle && <p className="muted" style={{ marginTop: 0 }}>{subtitle}</p>}
      {children}
    </div>
  </div>
);

export const VerifyBadge = ({ ok, label }) => (
  <span className={`badge-verify ${ok ? '' : 'pending'}`}>
    {ok ? '✓' : '○'} {label}
  </span>
);
