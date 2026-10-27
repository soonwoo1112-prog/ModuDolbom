import React, { createContext, useContext, useState, useCallback } from 'react';
import { seed } from '../data/seed.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

// 하단 탭 → 루트 화면 이름
export const TABS = {
  guardian: [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'requests', label: '요청', icon: '📬' },
    { id: 'dogs', label: '내 강아지', icon: '🐶' },
    { id: 'bookings', label: '예약', icon: '📅' },
    { id: 'my', label: '마이', icon: '👤' },
  ],
  sitter: [
    { id: 'inbox', label: '요청함', icon: '📥' },
    { id: 'schedule', label: '일정', icon: '🗓️' },
    { id: 'diary', label: '다이어리', icon: '✍️' },
    { id: 'learn', label: '배우기', icon: '📚' },
    { id: 'my', label: '마이', icon: '👤' },
  ],
};

let idCounter = 100;
const nextId = (prefix) => `${prefix}-${++idCounter}`;

export function AppProvider({ children }) {
  const [db, setDb] = useState(seed);
  const [nav, setNav] = useState({ tab: 'home', stack: [] });
  const [toast, setToast] = useState(null);
  const [nudgeDismissed, setNudgeDismissed] = useState({});

  const showToast = useCallback((text) => {
    setToast(text);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // ── 내비게이션 ──
  const push = useCallback((name, params = {}) => setNav((n) => ({ ...n, stack: [...n.stack, { name, params }] })), []);
  const pop = useCallback(() => setNav((n) => ({ ...n, stack: n.stack.slice(0, -1) })), []);
  const goTab = useCallback((tab) => setNav({ tab, stack: [] }), []);
  const setMode = useCallback((mode) => {
    setDb((s) => ({ ...s, session: { ...s.session, mode } }));
    setNav({ tab: mode === 'sitter' ? 'inbox' : 'home', stack: [] });
  }, []);

  // ── 온보딩 ──
  const onboard = useCallback((region, role) => {
    setDb((s) => ({ ...s, session: { ...s.session, onboarded: true, region, role, mode: role === 'sitter' ? 'sitter' : 'guardian' } }));
    setNav({ tab: role === 'sitter' ? 'inbox' : 'home', stack: [] });
  }, []);
  const onboardWaitlist = useCallback((entry) => {
    setDb((s) => ({
      ...s,
      waitlist: [...s.waitlist, { id: nextId('w'), ...entry }],
      session: { ...s.session, onboarded: true, regionLocked: true, role: 'guardian', mode: 'guardian' },
    }));
    setNav({ tab: 'home', stack: [] });
  }, []);

  // ── 강아지 ──
  const addDog = useCallback((dog) => ({ id: nextId('d'), ...dog }), []);
  const saveDog = useCallback((dog) => {
    setDb((s) => ({ ...s, dogs: s.dogs.some((x) => x.id === dog.id) ? s.dogs.map((x) => (x.id === dog.id ? dog : x)) : [...s.dogs, dog] }));
  }, []);

  // ── 돌봄 요청 ──
  const createRequest = useCallback((payload) => {
    const id = nextId('r');
    setDb((s) => {
      const favorite = s.favorites.find((f) => f.dogId === payload.dogId);
      const deadline = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
      const req = {
        id, ...payload,
        status: favorite ? 'awaiting_dedicated' : 'asking_neighbors',
        requestedSitterIds: favorite
          ? [favorite.sitterId]
          : s.sitters.filter((x) => x.userId !== s.session.userId).map((x) => x.id),
        confirmedSitterId: null,
        dedicatedDeadline: favorite ? deadline : null,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return { ...s, requests: [req, ...s.requests] };
    });
    return id;
  }, []);

  const makeBooking = (s, req, sitterId) => {
    const sitter = s.sitters.find((x) => x.id === sitterId);
    const meetingNumber = 1 + s.bookings.filter((b) => b.sitterId === sitterId && b.dogId === req.dogId).length;
    return {
      id: nextId('b'), requestId: req.id, guardianId: req.guardianId, sitterId,
      dogId: req.dogId, service: req.service, date: req.date, startTime: req.startTime,
      duration: req.duration, meetingNumber, stage: Math.min(meetingNumber, 3),
      status: 'upcoming', amount: sitter ? sitter.ratePer30 * (req.duration / 30) : 0,
    };
  };

  const confirmRequest = useCallback((reqId, sitterId) => {
    setDb((s) => {
      const req = s.requests.find((r) => r.id === reqId);
      if (!req || req.status === 'confirmed') return s;
      const booking = makeBooking(s, req, sitterId);
      return {
        ...s,
        requests: s.requests.map((r) => (r.id === reqId ? { ...r, status: 'confirmed', confirmedSitterId: sitterId } : r)),
        bookings: [booking, ...s.bookings],
      };
    });
  }, []);

  // 데모용: 매칭 단계 진행 (전담 대기 → 이웃 동시 요청 → 확정)
  const advanceRequest = useCallback((reqId) => {
    setDb((s) => {
      const req = s.requests.find((r) => r.id === reqId);
      if (!req) return s;
      if (req.status === 'awaiting_dedicated') {
        const others = s.sitters
          .filter((x) => x.userId !== s.session.userId && !req.requestedSitterIds.includes(x.id))
          .map((x) => x.id);
        return {
          ...s,
          requests: s.requests.map((r) => (r.id === reqId ? { ...r, status: 'asking_neighbors', requestedSitterIds: [...r.requestedSitterIds, ...others] } : r)),
        };
      }
      if (req.status === 'asking_neighbors') {
        const first = req.requestedSitterIds[0];
        if (!first) return s;
        const booking = makeBooking(s, req, first);
        return {
          ...s,
          requests: s.requests.map((r) => (r.id === reqId ? { ...r, status: 'confirmed', confirmedSitterId: first } : r)),
          bookings: [booking, ...s.bookings],
        };
      }
      return s;
    });
  }, []);

  // ── 시터: 요청 수락 / 거절 ──
  const acceptRequest = useCallback((reqId) => {
    setDb((s) => {
      const me = s.sitters.find((x) => x.userId === s.session.userId);
      if (!me) return s;
      const req = s.requests.find((r) => r.id === reqId);
      if (!req || req.status === 'confirmed') return s;
      const booking = makeBooking(s, req, me.id);
      return {
        ...s,
        requests: s.requests.map((r) => (r.id === reqId ? { ...r, status: 'confirmed', confirmedSitterId: me.id } : r)),
        bookings: [booking, ...s.bookings],
      };
    });
    showToast('수락했어요! 예약이 확정됐어요 🐾');
  }, [showToast]);

  const declineRequest = useCallback((reqId) => {
    setDb((s) => {
      const me = s.sitters.find((x) => x.userId === s.session.userId);
      return { ...s, requests: s.requests.map((r) => (r.id === reqId && me ? { ...r, requestedSitterIds: r.requestedSitterIds.filter((x) => x !== me.id) } : r)) };
    });
    showToast('이번엔 어려워요 — 다음 기회에 함께해요');
  }, [showToast]);

  // ── 전담 시터 지정 ──
  const toggleFavorite = useCallback((dogId, sitterId) => {
    setDb((s) => {
      const exists = s.favorites.some((f) => f.dogId === dogId && f.sitterId === sitterId);
      return {
        ...s,
        favorites: exists
          ? s.favorites.filter((f) => !(f.dogId === dogId && f.sitterId === sitterId))
          : [...s.favorites.filter((f) => f.dogId !== dogId), { guardianId: s.session.userId, dogId, sitterId }],
      };
    });
  }, []);

  // ── 리뷰 ──
  const addReview = useCallback((r) => {
    setDb((s) => ({
      ...s,
      reviews: [...s.reviews, { id: nextId('rv'), createdAt: new Date().toISOString().slice(0, 10), ...r }],
    }));
    setNudgeDismissed((d) => ({ ...d, [r.bookingId]: true }));
  }, []);

  // ── 채팅 ──
  // 채팅 화면 진입 시 호출 — 해당 예약의 채팅방이 없으면 만든다 (예약 확정 후에만 접근됨)
  const ensureChat = useCallback((bookingId) => {
    setDb((s) => {
      if (s.chats.some((c) => c.bookingId === bookingId)) return s;
      const b = s.bookings.find((x) => x.id === bookingId);
      if (!b) return s;
      const chat = { id: nextId('c'), bookingId, guardianId: b.guardianId, sitterId: b.sitterId, messages: [] };
      return { ...s, chats: [...s.chats, chat] };
    });
  }, []);

  const sendMessage = useCallback((chatId, text) => {
    setDb((s) => ({
      ...s,
      chats: s.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, { from: s.session.mode === 'sitter' ? 'sitter' : 'guardian', text, time: new Date().toISOString().slice(0, 10) }] }
          : c
      ),
    }));
  }, []);

  // ── 다이어리 / 인계 메모 ──
  const postDiary = useCallback((d) => {
    setDb((s) => ({ ...s, diaries: [{ id: nextId('p'), createdAt: new Date().toISOString().slice(0, 10), ...d }, ...s.diaries] }));
  }, []);
  const addNote = useCallback((n) => {
    setDb((s) => ({ ...s, notes: [...s.notes, { id: nextId('n'), createdAt: new Date().toISOString().slice(0, 10), ...n }] }));
  }, []);

  // ── 인증 상태 표시(데모) ──
  const setMySitterVerification = useCallback((key, value) => {
    setDb((s) => ({
      ...s,
      sitters: s.sitters.map((x) => (x.userId === s.session.userId ? { ...x, verified: { ...x.verified, [key]: value } } : x)),
    }));
  }, []);
  const updateMySitter = useCallback((patch) => {
    setDb((s) => ({ ...s, sitters: s.sitters.map((x) => (x.userId === s.session.userId ? { ...x, ...patch } : x)) }));
  }, []);

  // ── 배우기 ──
  const completeArticle = useCallback((articleId) => {
    setDb((s) => {
      const done = s.learnDone.includes(articleId) ? s.learnDone : [...s.learnDone, articleId];
      const allDone = ['a1', 'a2', 'a3'].every((a) => done.includes(a));
      return {
        ...s,
        learnDone: done,
        sitters: s.sitters.map((x) => (x.userId === s.session.userId && allDone ? { ...x, eduBadge: true } : x)),
      };
    });
    showToast('이수 완료! 교육 배지가 갱신됐어요 🎓');
  }, [showToast]);

  const value = {
    db, nav, toast, showToast,
    nudgeDismissed, setNudgeDismissed,
    push, pop, goTab, setMode,
    onboard, onboardWaitlist,
    addDog, saveDog,
    createRequest, confirmRequest, advanceRequest, acceptRequest, declineRequest,
    toggleFavorite, addReview, ensureChat, sendMessage,
    postDiary, addNote,
    setMySitterVerification, updateMySitter,
    completeArticle,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
