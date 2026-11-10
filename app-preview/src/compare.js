// Blind A/B test: each pair shows the current screen and its Taste-experiment version
// in a random order labelled 가 and 나. The viewer picks the one that feels made by a person.
import { h, Component } from 'preact';
import { Board } from './player.js';

export const PAIRS = [
  { id: 'booking', label: '예약 첫 화면', a: 'Main', b: 'MainR' },
  { id: 'booking-cta', label: '예약 첫 화면 버튼 위치 (작은 폰)', a: 'Main', b: 'MainS' },
];
const KEY = 'modudolbom-compare-v4';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode: keep in memory */ } };
const fresh = () => ({ order: PAIRS.map(() => Math.random() < 0.5), step: 0, answers: {} });

export class Compare extends Component {
  constructor() {
    super();
    this.state = Object.assign(load() || fresh(), { side: 0, sheet: false, why: '' });
  }
  persist(patch) {
    this.setState(patch, () => { const { order, step, answers } = this.state; save({ order, step, answers }); });
  }
  sides(i) { const p = PAIRS[i]; return this.state.order[i] ? [p.b, p.a] : [p.a, p.b]; }
  choose(k) {
    const { step, answers, why } = this.state;
    const pick = this.sides(step)[k];
    this.persist({ answers: Object.assign({}, answers, { [PAIRS[step].id]: { pick, taste: pick === PAIRS[step].b, why } }), step: step + 1, side: 0, sheet: false, why: '' });
  }
  restart() { const v = fresh(); this.persist(Object.assign(v, { side: 0, sheet: false, why: '' })); }
  // Links inside the boards would leave the test; keep the viewer on the pair.
  stopLinks = (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (a) e.preventDefault(); };
  render({ size }, { step, side, sheet, why, answers }) {
    const { s, bh } = size;
    if (step >= PAIRS.length) {
      const wins = PAIRS.filter((p) => answers[p.id] && answers[p.id].taste).length;
      const lines = PAIRS.map((p) => { const a = answers[p.id] || {}; return `${p.label}: ${a.taste ? '새 버전' : '지금 버전'}을 골랐어요${a.why ? ` (${a.why})` : ''}`; });
      return h('div', { class: 'pv-result' },
        h('h2', null, `새 버전을 ${PAIRS.length}개 중 ${wins}개 골랐어요`),
        h('p', { class: 'pv-result__sub' }, wins * 3 >= PAIRS.length * 2 ? '3분의 2 이상이라 실험 원칙을 모든 화면에 넓히는 쪽이에요.' : '3분의 2 미만이라 이긴 화면의 방식만 가져가는 쪽이에요.'),
        h('ul', null, lines.map((l) => h('li', null, l))),
        h('textarea', { class: 'md-input', readOnly: true, rows: 5, 'aria-label': '결과 복사용', value: lines.join('\n') }),
        h('button', { class: 'md-btn md-btn--large md-pressable', type: 'button', onClick: () => this.restart() }, '처음부터 다시 하기'));
    }
    const [x, y] = this.sides(step);
    const name = side === 0 ? x : y;
    return h('div', { class: 'pv-cmp' },
      h('header', { class: 'pv-bar pv-bar--cmp' },
        h('span', { class: 'pv-cmp__step' }, `${step + 1}/${PAIRS.length} ${PAIRS[step].label}`),
        h('div', { class: 'pv-cmp__seg', role: 'group', 'aria-label': '화면 고르기' },
          ['가', '나'].map((t, i) => h('button', { type: 'button', 'aria-pressed': side === i, onClick: () => this.setState({ side: i }) }, t))),
        h('button', { class: 'md-btn md-btn--brand md-btn--small md-pressable', type: 'button', onClick: () => this.setState({ sheet: true }) }, '고르기')),
      h('div', { class: 'pv-stage', style: `width: ${390 * s}px; height: ${bh * s}px;`, onClick: this.stopLinks },
        h('div', { class: 'pv-board', style: `width: 390px; height: ${bh}px; transform: scale(${s});` }, h(Board, { name, key: name }))),
      sheet && h('div', { class: 'md-overlay pv-overlay', onClick: () => this.setState({ sheet: false }) },
        h('div', { class: 'md-sheet pv-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': '고르기', onClick: (e) => e.stopPropagation() },
          h('div', { class: 'md-sheet__handle' }),
          h('h2', { class: 'pv-sheet__title' }, '어느 쪽이 사람이 만든 앱 같아요?'),
          h('p', { class: 'pv-sheet__sub' }, '가와 나를 둘 다 눌러 보고 골라 주세요. 어느 쪽이 새 버전인지는 끝나고 알려 드려요.'),
          h('label', { class: 'md-field__label', for: 'why', style: 'margin-top: 12px;' }, '이유', h('em', null, '선택')),
          h('textarea', { class: 'md-input', id: 'why', rows: 3, value: why, onInput: (e) => this.setState({ why: e.target.value }), placeholder: '예: 사진이 먼저 보여서 실제 서비스 같아요', style: 'margin-top: 8px;' }),
          h('div', { class: 'pv-cmp__pick' },
            ['가', '나'].map((t, i) => h('button', { class: 'md-btn md-btn--large md-pressable', type: 'button', onClick: () => this.choose(i) }, `${t} 화면`))))));
  }
}
