import React from 'react';
import { useApp } from './store/AppContext.jsx';
import Layout from './components/Layout.jsx';
import ReviewNudge from './components/ReviewNudge.jsx';
import Onboarding from './screens/common/Onboarding.jsx';
import Login from './screens/common/Login.jsx';

export default function App() {
  const { db, toast } = useApp();
  if (!db.session.loggedIn) return <Login />;
  if (!db.session.onboarded) return <Onboarding />;
  return (
    <>
      <ReviewNudge />
      <Layout />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
