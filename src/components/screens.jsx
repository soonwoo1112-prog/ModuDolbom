import React from 'react';
import { Empty } from './ui.jsx';

// 온보딩(지역·역할 선택, 대기자 등록)
import Onboarding from '../screens/common/Onboarding.jsx';
// 공통
import MyPage from '../screens/common/MyPage.jsx';
import Chat from '../screens/common/Chat.jsx';
import WaitlistScreen from '../screens/common/WaitlistScreen.jsx';
import DiaryDetail from '../screens/common/DiaryDetail.jsx';
// 보호자
import Home from '../screens/guardian/Home.jsx';
import Requests from '../screens/guardian/Requests.jsx';
import RequestFlow from '../screens/guardian/RequestFlow.jsx';
import Matching from '../screens/guardian/Matching.jsx';
import Dogs from '../screens/guardian/Dogs.jsx';
import Bookings from '../screens/guardian/Bookings.jsx';
import BookingDetail from '../screens/guardian/BookingDetail.jsx';
import SitterProfileView from '../screens/guardian/SitterProfileView.jsx';
// 시터
import Inbox from '../screens/sitter/Inbox.jsx';
import Schedule from '../screens/sitter/Schedule.jsx';
import DiaryWrite from '../screens/sitter/DiaryWrite.jsx';
import Verify from '../screens/sitter/Verify.jsx';
import Learn from '../screens/sitter/Learn.jsx';
import Membership from '../screens/sitter/Membership.jsx';

export const SCREENS = {
  onboarding: Onboarding,
  my: MyPage,
  chat: Chat,
  waitlist: WaitlistScreen,
  diaryDetail: DiaryDetail,
  home: Home,
  requests: Requests,
  requestFlow: RequestFlow,
  matching: Matching,
  dogs: Dogs,
  bookings: Bookings,
  bookingDetail: BookingDetail,
  sitterProfile: SitterProfileView,
  inbox: Inbox,
  schedule: Schedule,
  diary: DiaryWrite,
  verify: Verify,
  learn: Learn,
  membership: Membership,
};

// 하단 탭 → 루트 화면 이름
export const TAB_SCREENS = {
  guardian: { home: 'home', requests: 'requests', dogs: 'dogs', bookings: 'bookings', my: 'my' },
  sitter: { inbox: 'inbox', schedule: 'schedule', diary: 'diary', learn: 'learn', my: 'my' },
};
