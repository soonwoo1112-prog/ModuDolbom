import React from 'react';

// 로그인 · 온보딩
import Login from '../screens/common/Login.jsx';
import Onboarding from '../screens/common/Onboarding.jsx';
// 공통
import MyPage from '../screens/common/MyPage.jsx';
import ChatList from '../screens/common/ChatList.jsx';
import Chat from '../screens/common/Chat.jsx';
import WaitlistScreen from '../screens/common/WaitlistScreen.jsx';
import DiaryDetail from '../screens/common/DiaryDetail.jsx';
import Feed from '../screens/common/Feed.jsx';
import DogProfile from '../screens/common/DogProfile.jsx';
import DogEdit from '../screens/common/DogEdit.jsx';
import GuardianProfile from '../screens/common/GuardianProfile.jsx';
// 보호자
import Home from '../screens/guardian/Home.jsx';
import RequestFlow from '../screens/guardian/RequestFlow.jsx';
import Matching from '../screens/guardian/Matching.jsx';
import Bookings from '../screens/guardian/Bookings.jsx';
import BookingDetail from '../screens/guardian/BookingDetail.jsx';
import SitterProfileView from '../screens/guardian/SitterProfileView.jsx';
// 시터
import SitterHome from '../screens/sitter/SitterHome.jsx';
import Schedule from '../screens/sitter/Schedule.jsx';
import DiaryWrite from '../screens/sitter/DiaryWrite.jsx';
import Verify from '../screens/sitter/Verify.jsx';
import Learn from '../screens/sitter/Learn.jsx';
import Membership from '../screens/sitter/Membership.jsx';

export const SCREENS = {
  login: Login,
  onboarding: Onboarding,
  my: MyPage,
  chatList: ChatList,
  chat: Chat,
  waitlist: WaitlistScreen,
  diaryDetail: DiaryDetail,
  feed: Feed,
  dogProfile: DogProfile,
  dogEdit: DogEdit,
  guardianProfile: GuardianProfile,
  home: Home,
  requestFlow: RequestFlow,
  matching: Matching,
  bookings: Bookings,
  bookingDetail: BookingDetail,
  sitterProfile: SitterProfileView,
  sitterHome: SitterHome,
  schedule: Schedule,
  diary: DiaryWrite,
  verify: Verify,
  learn: Learn,
  membership: Membership,
};

// 하단 탭 → 루트 화면 이름
export const TAB_SCREENS = {
  guardian: { home: 'home', feed: 'feed', bookings: 'bookings', chats: 'chatList', my: 'my' },
  sitter: { home: 'sitterHome', feed: 'feed', schedule: 'schedule', chats: 'chatList', my: 'my' },
};
