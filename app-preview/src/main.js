// Phone preview shell: runs the canvas boards full-screen, follows their links,
// and keeps a list of every screen one tap away.
import { h, render, Component } from 'preact';
import '../../design/canvas/modudolbom.css';
import '../../design/canvas/ds/modudolbom/components/bundle.css';
import './shell.css';
import { Board } from './player.js';
import { Compare } from './compare.js';
import { boards, canvas } from './boards.gen.js';

const W = 390;
const BAR = 44;

const titleOf = (name) => (canvas.boards[name + '.dc.html'] || {}).title || name;

// Group boards under the canvas section titles, in canvas reading order.
function groups() {
  const notes = (canvas.noteOrder || Object.keys(canvas.notes)).map((k) => canvas.notes[k]).sort((a, b) => a.y - b.y);
  const out = notes.map((n) => ({ title: n.text, items: [] }));
  for (const [file, b] of Object.entries(canvas.boards)) {
    const name = file.replace('.dc.html', '');
    if (!boards[name]) continue;
    let gi = 0;
    notes.forEach((n, i) => { if (n.y <= b.y) gi = i; });
    out[gi].items.push({ name, title: b.title, x: b.x, y: b.y });
  }
  out.forEach((g) => g.items.sort((a, b) => a.y - b.y || a.x - b.x));
  return out.filter((g) => g.items.length);
}

const fromHash = () => {
  const n = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  return n === 'compare' || boards[n] ? n : 'Main';
};

const ListIcon = () => h('svg', { class: 'md-ico md-ico--md', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' },
  h('path', { d: 'M3 5h.01' }), h('path', { d: 'M3 12h.01' }), h('path', { d: 'M3 19h.01' }), h('path', { d: 'M8 5h13' }), h('path', { d: 'M8 12h13' }), h('path', { d: 'M8 19h13' }));

class App extends Component {
  constructor() {
    super();
    this.state = { name: fromHash(), list: false, size: this.measure(), visit: 0 };
    this.groups = groups();
  }
  measure() {
    const s = Math.min(1, window.innerWidth / W);
    const bh = Math.min(844, Math.floor((window.innerHeight - BAR) / s));
    return { s, bh };
  }
  componentDidMount() {
    this.onHash = () => this.setState({ name: fromHash(), list: false, visit: this.state.visit + 1 });
    this.onResize = () => this.setState({ size: this.measure() });
    window.addEventListener('hashchange', this.onHash);
    window.addEventListener('resize', this.onResize);
  }
  go(name) {
    if (name === this.state.name) { this.setState({ list: false, visit: this.state.visit + 1 }); return; }
    location.hash = '/' + name;
  }
  // Boards link to each other with href="Name.dc.html"; follow those inside the preview.
  onClick = (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const m = a.getAttribute('href').match(/^([A-Za-z0-9]+)\.dc\.html$/);
    if (!m) return;
    e.preventDefault();
    this.go(m[1]);
  };
  render(_, { name, list, size, visit }) {
    const { s, bh } = size;
    if (name === 'compare') return h('div', { class: 'pv' }, h(Compare, { size }));
    return h('div', { class: 'pv' },
      h('header', { class: 'pv-bar' },
        h('button', { class: 'pv-bar__btn md-pressable', type: 'button', onClick: () => this.setState({ list: true }), 'aria-haspopup': 'dialog' },
          h(ListIcon), h('span', { class: 'pv-bar__title' }, titleOf(name)))),
      h('div', { class: 'pv-stage', style: `width: ${W * s}px; height: ${bh * s}px;`, onClick: this.onClick },
        h('div', { class: 'pv-board', style: `width: ${W}px; height: ${bh}px; transform: scale(${s});` },
          h(Board, { name, key: name + ':' + visit }))),
      list && h('div', { class: 'md-overlay pv-overlay', onClick: () => this.setState({ list: false }) },
        h('div', { class: 'md-sheet pv-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': '화면 목록', onClick: (e) => e.stopPropagation() },
          h('div', { class: 'md-sheet__handle' }),
          h('h2', { class: 'pv-sheet__title' }, '화면 목록'),
          h('p', { class: 'pv-sheet__sub' }, `캔버스와 같은 화면 ${Object.keys(boards).length}개예요. 화면 안의 버튼과 링크도 그대로 움직여요.`),
          h('a', { class: 'pv-item pv-item--cmp md-pressable', href: '#compare' }, '블라인드 비교 시작하기: 지금 화면과 실험 화면'),
          this.groups.map((g) => h('section', { class: 'pv-group' },
            h('h3', { class: 'pv-group__title' }, g.title),
            g.items.map((it) => h('button', { type: 'button', class: 'pv-item md-pressable', 'aria-current': it.name === name ? 'page' : null, onClick: () => this.go(it.name) }, it.title)))))));
  }
}

render(h(App), document.getElementById('root'));
