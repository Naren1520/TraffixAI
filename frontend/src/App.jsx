import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CityProvider } from './context/CityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import RouteAnalyzer from './pages/RouteAnalyzer';
import IncidentCenter from './pages/IncidentCenter';
import Help from './pages/Help';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import LoginModal from './components/LoginModal';

const GOOGLE_CLIENT_ID = '166478995811-gntljectoq3ht2hkvi67rg7u26dnrsru.apps.googleusercontent.com';

// Separate inner component so it can access AuthContext
function AppShell() {
  const { isLoggedIn } = useAuth();
  const [phase, setPhase] = useState('loading'); // 'loading' | 'login' | 'app'
  const [showLogin, setShowLogin] = useState(false);

  // When loader completes → move to login phase (if not already signed in)
  const handleLoaderComplete = () => {
    if (isLoggedIn) {
      setPhase('app');
    } else {
      setPhase('login');
    }
  };

  // Called after successful Google sign-in
  const handleLoginSuccess = () => {
    setPhase('app');
  };

  if (phase === 'loading') {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  if (phase === 'login') {
    return <LoginModal onSuccess={handleLoginSuccess} />;
  }

  return (
    <CityProvider>
      <Router>
        <div className="flex bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-white selection:text-black">
          <Sidebar onLoginClick={() => setShowLogin(true)} />
          <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-[#050505]">
            <div className="p-4 sm:p-6 lg:p-8 pt-16 md:pt-8 max-w-[1600px] mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/route-analyzer" element={<RouteAnalyzer />} />
                <Route path="/incident-center" element={<IncidentCenter />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </div>
          </main>
        </div>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </Router>
    </CityProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
