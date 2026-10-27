import React from 'react';
import { useApp } from './store/AppContext.jsx';
import Layout from './components/Layout.jsx';
import ReviewNudge from './components/ReviewNudge.jsx';
import Onboarding from './screens/common/Onboarding.jsx';

export default function App() {
  const { db, toast } = useApp();
  if (!db.session.onboarded) return <Onboarding />;
  return (
    <>
      <ReviewNudge />
      <Layout />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
