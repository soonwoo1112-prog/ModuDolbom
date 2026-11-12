// Phone preview shell: runs the canvas boards full-screen, follows their links,
// and keeps a list of every screen one tap away.
import { h, render, Component } from 'preact';
import '../../design/canvas/modudolbom.css';
import '../../design/canvas/v2.css';
import '../../design/canvas/ds/modudolbom/components/bundle.css';
import './shell.css';
import { Board } from './player.js';
import { boards, canvas } from './boards.gen.js';

const W = 390;
const BAR = 44;


// The app as it is now: only the chosen screens, grouped the way the app is used.
// Old versions and experiments stay on the canvas but are left out of this list.
const APP = [
  ['계정 · 가입과 인증', [['Login', '시작하기'], ['SignupRole', '역할 고르기'], ['VerifyPhone', '본인 인증'], ['VerifyHome', '동네 인증'], ['SitterAccount', '시터: 정산 계좌'], ['SitterQuiz', '시터: 시팅 팁 퀴즈'], ['SitterPending', '시터: 가입 심사 중'], ['SitterApproved', '시터: 가입 승인']]],
  ['보호자 · 예약', [['MainR', '예약 홈'], ['MainRNew', '예약 홈 (처음 쓰는 보호자)'], ['Matching', '시터 고르기'], ['SitterProfile', '시터 프로필'], ['SitterProfileFeed', '시터 프로필: 산책 기록'], ['SitterProfilePrice', '시터 프로필: 가격'], ['RequestDone', '요청 보냄'], ['Sent', '요청 현황'], ['SentNone', '요청 현황: 아무도 수락하지 않음'], ['SentCanceled', '요청 현황: 모두 취소함']]],
  ['보호자 · 채팅', [['GuardianChatList', '채팅 목록'], ['Chat', '채팅'], ['ChatInfo', '채팅: 예약 정보'], ['ChatMenu', '채팅: 더보기 메뉴'], ['ChatEdit', '예약 수정 요청']]],
  ['보호자 · 결제와 취소', [['PayMethods', '결제 수단'], ['PayHistory', '결제 내역'], ['CancelBooking', '예약 취소: 24시간 안'], ['CancelMid', '예약 취소: 24시간 전까지'], ['CancelFree', '예약 취소: 무료 기간'], ['NoShow', '노쇼 신고: 시터가 오지 않음'], ['NoShowSitter', '노쇼 신고: 보호자가 나오지 않음 (시터)']]],
  ['보호자 · 산책', [['GuardianLive', '실시간 위치'], ['GuardianLog', '산책 기록과 후기'], ['GuardianWalk', '직접 산책 나가기']]],
  ['보호자 · 소셜', [['SocialFeed', '산책 피드'], ['Community', '동네 이야기'], ['ComposePick', '글쓰기'], ['ComposeWalk', '산책 올리기'], ['Compose', '직접 쓰기']]],
  ['보호자 · 캘린더', [['GuardianCalendar', '캘린더'], ['GuardianCalendarDay', '캘린더: 날짜 보기']]],
  ['보호자 · 더보기', [['GuardianMore', '더보기'], ['DogProfile', '강아지 프로필'], ['DogProfileFeed', '강아지 프로필: 산책 기록'], ['DogProfilePhotos', '강아지 프로필: 사진'], ['DogEdit', '강아지 프로필 수정'], ['Notifications', '알림']]],
  ['시터 · 오늘', [['SitterToday', '오늘'], ['SitterRequest', '새 요청 자세히']]],
  ['시터 · 채팅', [['SitterChatList', '채팅 목록'], ['SitterChat', '채팅']]],
  ['시터 · 산책', [['Walking', '산책중'], ['WalkLogWrite', '산책 기록 보내기']]],
  ['시터 · 캘린더', [['SitterSchedule', '캘린더'], ['SitterWeek', '그 주'], ['SitterWeekEdit', '이 날 일정 수정']]],
  ['공용 · 권한과 동의', [['LocationConsent', '위치정보 이용 동의'], ['PermLocation', '권한 요청: 위치'], ['PermNotify', '권한 요청: 알림'], ['PermPhoto', '권한 요청: 사진']]],
  ['시터 · 더보기', [['SitterMore', '더보기'], ['SitterProfileSelf', '내 프로필'], ['SitterProfileEdit', '프로필 꾸미기'], ['SitterService', '서비스 설정'], ['SitterAnalytics', '시터 분석'], ['SitterPayout', '정산']]]
];
const LABEL = Object.fromEntries(APP.flatMap(([, items]) => items));
const titleOf = (name) => LABEL[name] || (canvas.boards[name + '.dc.html'] || {}).title || name;
const groups = () => APP.map(([title, items]) => ({ title, items: items.filter(([n]) => boards[n]).map(([name, label]) => ({ name, title: label })) })).filter((g) => g.items.length);
const SCREENS = APP.reduce((n, [, items]) => n + items.length, 0);

const fromHash = () => {
  const n = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  // Old links to the finished blind test (#compare) open the app instead.
  return boards[n] ? n : 'MainR';
};

const ListIcon = () => h('svg', { class: 'md-ico md-ico--md', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' },
  h('path', { d: 'M3 5h.01' }), h('path', { d: 'M3 12h.01' }), h('path', { d: 'M3 19h.01' }), h('path', { d: 'M8 5h13' }), h('path', { d: 'M8 12h13' }), h('path', { d: 'M8 19h13' }));

class App extends Component {
  constructor() {
    super();
    this.state = { name: fromHash(), list: false, size: this.measure(), visit: 0 };
    // Screens visited in this preview, so a board's back button returns to where you came from.
    this.trail = [this.state.name];
    this.groups = groups();
  }
  measure() {
    const s = Math.min(1, window.innerWidth / W);
    const bh = Math.min(844, Math.floor((window.innerHeight - BAR) / s));
    return { s, bh };
  }
  componentDidMount() {
    this.onHash = () => {
      const name = fromHash();
      if (this.goingBack) { this.goingBack = false; this.trail.pop(); }
      else if (this.trail[this.trail.length - 1] !== name) this.trail.push(name);
      this.setState({ name: name, list: false, visit: this.state.visit + 1 });
    };
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
    // A back button goes back along the trail; its href is only the canvas default.
    if (a.getAttribute('aria-label') === '뒤로 가기' && this.trail.length > 1) { this.goingBack = true; history.back(); return; }
    this.go(m[1]);
  };
  render(_, { name, list, size, visit }) {
    const { s, bh } = size;
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
          h('p', { class: 'pv-sheet__sub' }, `지금 고른 방향의 화면 ${SCREENS}개예요. 화면 안의 버튼과 링크로 모두 이어져요.`),
          this.groups.map((g) => h('section', { class: 'pv-group' },
            h('h3', { class: 'pv-group__title' }, g.title),
            g.items.map((it) => h('button', { type: 'button', class: 'pv-item md-pressable', 'aria-current': it.name === name ? 'page' : null, onClick: () => this.go(it.name) }, it.title)))))));
  }
}

render(h(App), document.getElementById('root'));
