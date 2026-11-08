import React from 'react';
import { Icon } from '../ui.jsx';

// The walk record's shared parts: plain figures split by hairlines, and the timeline of what happened.
export function Figs({ items, small }) {
  return (
    <dl className={`wk-figs${small ? ' wk-figs--sm' : ''}`}>
      {items.map(([label, value, unit]) => <div key={label}><dt>{label}</dt><dd>{value}{unit ? <small>{unit}</small> : null}</dd></div>)}
    </dl>
  );
}

const EV_ICON = { pee: 'Droplet', poop: 'Poop', photo: 'Camera', start: 'Footprints', end: 'Footprints' };
export function Timeline({ events }) {
  return (
    <ol className="wk-tl" aria-label="산책 소식">
      {events.map((e, i) => (
        <li key={`${e.time}-${i}`}>
          <time>{e.time}</time>
          <span className="wk-tl__node" />
          <span className="wk-tl__text">
            <span><Icon name={EV_ICON[e.kind]} size={16} />{e.text}</span>
            {e.kind === 'photo' ? <span className="wk-tl__thumb"><Icon name="PawPrint" size={20} label="산책 사진" /></span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Section({ title, sub, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 16px' }}>
      {title ? <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><h2 className="md-section-title" style={{ margin: 0 }}>{title}</h2>{sub ? <p className="wk-sub">{sub}</p> : null}</div> : null}
      {children}
    </section>
  );
}
