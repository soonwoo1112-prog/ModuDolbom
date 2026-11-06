import React from 'react';
import { BadgeCheck, Bell, Calendar, Camera, ChartColumn, ChevronLeft, ChevronRight, CircleHelp, Clock, CreditCard, EllipsisVertical, Footprints, Heart, House, ImagePlus, Info, MapPin, Menu, MessageCircle, PawPrint, Pencil, Search, Send, Settings2, Star, User, Users, Wallet, X } from 'lucide-react';

const Icons = { BadgeCheck, Bell, Calendar, Camera, ChartColumn, ChevronLeft, ChevronRight, CircleHelp, Clock, CreditCard, EllipsisVertical, Footprints, Heart, House, ImagePlus, Info, MapPin, Menu, MessageCircle, PawPrint, Pencil, Search, Send, Settings2, Star, User, Users, Wallet, X };
import { useApp, TABS } from './store.jsx';

// Lucide icon (ISC), 24px by default, stroke 1.75 per the brand book.
export function Icon({ name, size = 24, label, style, fill }) {
  const C = Icons[name];
  if (!C) return null;
  return <C size={size} strokeWidth={1.75} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} style={style} fill={fill || 'none'} />;
}

export function TopNav({ title, root, right, onBack }) {
  const { pop } = useApp();
  if (root) {
    return (
      <header className="md-topnav md-topnav--root app-topnav">
        <h1 className="md-topnav__title">{title}</h1>
        <div style={{ display: 'flex' }}>{right}</div>
      </header>
    );
  }
  return (
    <header className="md-topnav app-topnav">
      <button className="md-iconbtn md-pressable" type="button" aria-label="뒤로 가기" onClick={onBack || pop}><Icon name="ChevronLeft" /></button>
      <h1 className="md-topnav__title">{title}</h1>
      <div style={{ width: 48, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </header>
  );
}

export function IconButton({ icon, label, onClick, badge }) {
  return (
    <button className="md-iconbtn md-pressable" type="button" aria-label={badge ? `${label} ${badge}개` : label} onClick={onClick}>
      <Icon name={icon} />
      {badge ? <span className="md-nbadge">{badge}</span> : null}
    </button>
  );
}

export function BottomNav({ badges = {} }) {
  const { role, nav, goTab } = useApp();
  return (
    <nav className="md-bottomnav" aria-label={role === 'guardian' ? '보호자 메뉴' : '시터 메뉴'}>
      {TABS[role].map((t) => (
        <button key={t.id} className="md-tab md-pressable" type="button" aria-current={nav.tab === t.id ? 'page' : undefined} onClick={() => goTab(t.id)}>
          <Icon name={t.icon} />
          {t.label}
          {badges[t.id] ? <span className="md-nbadge">{badges[t.id]}</span> : null}
        </button>
      ))}
    </nav>
  );
}

export function Btn({ variant = 'weak', size = 'medium', busy, busyLabel, children, className = '', ...rest }) {
  const v = { brand: 'md-btn--brand', neutral: 'md-btn--neutral', weak: '', outline: 'md-btn--outline', ghost: 'md-btn--ghost', critical: 'md-btn--critical' }[variant];
  const s = { small: 'md-btn--small', medium: '', large: 'md-btn--large' }[size];
  return (
    <button className={`md-btn ${v} ${s} md-pressable ${className}`} type="button" aria-busy={busy ? 'true' : undefined} disabled={rest.disabled} {...rest}>
      {busy ? <><span className="md-spinner" aria-hidden="true" />{busyLabel || children}</> : children}
    </button>
  );
}

export function Badge({ tone = 'neutral', children }) {
  const t = { neutral: '', brand: 'md-badge--brand', brandSolid: 'md-badge--brand-solid', outline: 'md-badge--outline', critical: 'md-badge--critical', info: 'md-badge--info' }[tone];
  return <span className={`md-badge ${t}`}>{children}</span>;
}

export function ChipGroup({ label, options, value, onChange, outline }) {
  return (
    <div className="md-row" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} className={`md-chip ${outline ? 'md-chip--outline' : ''} md-pressable`} type="button" aria-pressed={value === o} onClick={() => onChange(o)}><span>{o}</span></button>
      ))}
    </div>
  );
}

export function Callout({ tone = 'info', title, children }) {
  const cls = tone === 'warning' ? 'md-callout md-callout--warning' : tone === 'critical' ? 'md-callout md-callout--critical' : 'md-callout';
  return (
    <div className={cls} role="note">
      <Icon name="Info" size={18} />
      <span>{title ? <><b>{title}</b><br /></> : null}{children}</span>
    </div>
  );
}

export function ListHeader({ children, sub }) {
  return (
    <div className="md-list-header" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span>{children}</span>
      {sub ? <span className="md-detail" style={{ fontWeight: 400 }}>{sub}</span> : null}
    </div>
  );
}

export const Band = () => <div className="md-band" />;

export function Avatar({ size = 48, icon = 'User' }) {
  return <span className="md-avatar" style={{ width: size, height: size }}><Icon name={icon} size={Math.round(size / 2)} /></span>;
}

export function Thumb({ size = 56, icon = 'PawPrint', label }) {
  return <span className="md-thumb" style={{ width: size, height: size }}><Icon name={icon} label={label} /></span>;
}

export function Tags({ items, className = '' }) {
  return <span className={`md-tags md-num ${className}`}>{items.map((t, i) => <span key={i}>{t}</span>)}</span>;
}

export function Switch({ checked, onChange, label }) {
  return <input type="checkbox" role="switch" className="app-switch" checked={checked} onChange={onChange} aria-label={label} />;
}

// ── The four states every data region draws ──

export function SkeletonList({ rows = 3, avatar = 'circle', label = '불러오는 중' }) {
  return (
    <div aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="md-item" style={{ cursor: 'default' }}>
          <span className={`md-skel ${avatar === 'circle' ? 'md-skel--circle' : ''}`} style={{ width: 48, height: 48 }} />
          <span style={{ display: 'grid', gap: 8 }}>
            <span className="md-skel md-skel--line" style={{ width: `${40 + (i % 3) * 12}%` }} />
            <span className="md-skel md-skel--line" style={{ width: `${70 + (i % 2) * 15}%` }} />
          </span>
          <span />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlock({ height = 160, radius, style }) {
  return <div className="md-skel" aria-hidden="true" style={{ height, borderRadius: radius, ...style }} />;
}

export function Result({ icon, title, children, action, onAction, actionVariant = 'brand', role }) {
  return (
    <section className="md-result" role={role}>
      {icon ? <span className="md-thumb" style={{ borderRadius: 9999 }}><Icon name={icon} /></span> : null}
      <h3 className="md-section-title">{title}</h3>
      {children ? <p>{children}</p> : null}
      {action ? <Btn variant={actionVariant} onClick={onAction}>{action}</Btn> : null}
    </section>
  );
}

export function ErrorResult({ what, onRetry }) {
  return (
    <Result title={`${what}을 불러오지 못했어요`} action="다시 시도" actionVariant="weak" onAction={onRetry} role="alert">
      인터넷 연결을 확인하고 다시 시도해 주세요.
    </Result>
  );
}

// Load a region and draw the right one of its four states.
export function Region({ load, skeleton, empty, error, children }) {
  if (load.status === 'loading') return skeleton;
  if (load.status === 'error') return error || <ErrorResult what="내용" onRetry={load.retry} />;
  if (load.status === 'empty') return empty;
  return children(load.data);
}

export function Bubble({ mine, text, time }) {
  return (
    <div className={`app-bubble ${mine ? 'app-bubble--mine' : ''}`}>
      <p>{text}</p>
      <span className="md-tagtext">{time}</span>
    </div>
  );
}

export function SystemNote({ title, children }) {
  return (
    <div role="status" className="app-systemnote">
      <span className="md-label" style={{ color: 'var(--fg-positive)' }}>{title}</span>
      <span className="md-detail">{children}</span>
    </div>
  );
}

export function RouteMap({ height = 320, aspect, progress = 'part', label, children }) {
  const full = 'M70 280 C 90 230, 130 220, 150 180 S 170 100, 230 92 S 320 110, 312 170 S 260 250, 205 238';
  const part = 'M70 280 C 90 230, 130 220, 150 180 S 170 100, 230 92';
  return (
    <div className="app-map" style={aspect ? { aspectRatio: aspect } : { height }}>
      <svg viewBox="0 0 390 340" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
        <path d="M0 85H390M0 170H390M0 255H390M98 0V340M195 0V340M292 0V340" className="grid" />
        {progress === 'part' ? <path d={full} className="suggest" /> : null}
        <path d={progress === 'part' ? part : full} className="walked" />
        <circle cx="70" cy="280" r="7" className="start" />
        {progress === 'part'
          ? <><circle cx="230" cy="92" r="15" className="here-halo" /><circle cx="230" cy="92" r="7.5" className="here" /></>
          : <circle cx="205" cy="238" r="6" className="end" />}
      </svg>
      {children}
    </div>
  );
}
