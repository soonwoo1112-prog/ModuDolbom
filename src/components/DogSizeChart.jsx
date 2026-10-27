import React from 'react';
import { sizeOf } from '../utils.js';

// 몸무게·견종 기반 크기 비교 그림 — 사람 실루엣 옆에 강아지 실루엣을 비율로 표시
// 체고 추정: 소형(~10kg), 중형(~25kg), 대형(25kg~) 구간 기반 보간
const estimateHeight = (kg) => (kg < 10 ? 22 + kg * 1.9 : kg < 25 ? 33 + kg * 0.9 : 48 + kg * 0.35);

export default function DogSizeChart({ weight, name, compact = false }) {
  const humanH = 165;
  const dogH = Math.round(estimateHeight(weight));
  const W = compact ? 300 : 340;
  const ground = compact ? 150 : 170;
  const scale = compact ? 0.72 : 0.82;
  const humanPx = humanH * scale; // 그림상 사람 픽셀 높이
  const dogPx = dogH * scale;

  const humanTop = ground - humanPx;
  const dogTop = ground - dogPx;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${ground + 34}`} width="100%" style={{ display: 'block' }}>
        {/* 바닥선 */}
        <line x1="10" y1={ground} x2={W - 10} y2={ground} stroke="#EAE3D8" strokeWidth="2" strokeLinecap="round" />

        {/* 사람 실루엣 */}
        <g fill="#2E2A24" opacity="0.75">
          <circle cx="92" cy={humanTop + 17} r={17} />
          <rect x="76" y={humanTop + 36} width="32" height={humanPx * 0.42} rx="14" />
          <rect x="81" y={humanTop + 36 + humanPx * 0.42} width="9" height={humanPx * 0.2} rx="4.5" />
          <rect x="94" y={humanTop + 36 + humanPx * 0.42} width="9" height={humanPx * 0.2} rx="4.5" />
          <rect x="66" y={humanTop + 40} width="10" height={humanPx * 0.3} rx="5" transform={`rotate(18 71 ${humanTop + 40})`} />
          <rect x="108" y={humanTop + 40} width="10" height={humanPx * 0.3} rx="5" transform={`rotate(-18 113 ${humanTop + 40})`} />
        </g>
        <text x="92" y={ground + 16} textAnchor="middle" fontSize="12" fill="#7A7065">보호자(165cm)</text>

        {/* 강아지 실루엣 (체고 비율) */}
        <g fill="#3F7D58">
          {/* 몸통 */}
          <ellipse cx="212" cy={dogTop + dogPx * 0.52} rx={dogPx * 0.62} ry={dogPx * 0.3} />
          {/* 머리 */}
          <circle cx={212 + dogPx * 0.62} cy={dogTop + dogPx * 0.3} r={dogPx * 0.26} />
          {/* 귀 */}
          <ellipse cx={212 + dogPx * 0.52} cy={dogTop + dogPx * 0.12} rx={dogPx * 0.09} ry={dogPx * 0.18} transform={`rotate(-16 ${212 + dogPx * 0.52} ${dogTop + dogPx * 0.12})`} />
          {/* 다리 4 */}
          <rect x={212 - dogPx * 0.45} y={dogTop + dogPx * 0.7} width={dogPx * 0.11} height={dogPx * 0.3} rx={dogPx * 0.055} />
          <rect x={212 - dogPx * 0.2} y={dogTop + dogPx * 0.7} width={dogPx * 0.11} height={dogPx * 0.3} rx={dogPx * 0.055} />
          <rect x={212 + dogPx * 0.12} y={dogTop + dogPx * 0.7} width={dogPx * 0.11} height={dogPx * 0.3} rx={dogPx * 0.055} />
          <rect x={212 + dogPx * 0.36} y={dogTop + dogPx * 0.7} width={dogPx * 0.11} height={dogPx * 0.3} rx={dogPx * 0.055} />
          {/* 꼬리 */}
          <rect x={212 - dogPx * 0.78} y={dogTop + dogPx * 0.4} width={dogPx * 0.22} height={dogPx * 0.09} rx={dogPx * 0.045} transform={`rotate(-24 ${212 - dogPx * 0.78} ${dogTop + dogPx * 0.4})`} />
        </g>
        {/* 체고 눈금선 */}
        <line x1="160" y1={dogTop} x2="236" y2={dogTop} stroke="#F2A65A" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="212" y={ground + 16} textAnchor="middle" fontSize="12" fill="#3F7D58" fontWeight="600">
          {name ? `${name} ` : ''}약 {dogH}cm
        </text>
      </svg>
      <div className="muted" style={{ textAlign: 'center' }}>
        <span className="chip peach">{sizeOf(weight)} · {weight}kg</span>
      </div>
    </div>
  );
}
