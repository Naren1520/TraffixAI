import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CityProvider } from './context/CityContext';
import { CityContext } from './context/CityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import RouteAnalyzer from './pages/RouteAnalyzer';
import IncidentCenter from './pages/IncidentCenter';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import LoginModal from './components/LoginModal';
import DefaultLocationModal from './components/DefaultLocationModal';

const GOOGLE_CLIENT_ID = '166478995811-gntljectoq3ht2hkvi67rg7u26dnrsru.apps.googleusercontent.com';

function AppShell() {
  const { isLoggedIn, user } = useAuth();
  const { updateCity } = useContext(CityContext);

  // phase: 'loading' → 'login' → 'location' (first-login only) → 'app'
  const [phase, setPhase]         = useState('loading');
  const [showLogin, setShowLogin] = useState(false);

  const handleLoaderComplete = () => {
    if (isLoggedIn) {
      // Returning user — skip login + location modal
      setPhase('app');
    } else {
      setPhase('login');
    }
  };

  const handleLoginSuccess = (firstLogin) => {
    if (firstLogin) {
      setPhase('location');
    } else {
      setPhase('app');
    }
  };

  const handleLocationComplete = (location) => {
    if (location) {
      // Apply the chosen city to CityContext so dashboard loads it immediately
      updateCity(location.city, { lat: location.lat, lng: location.lng, radius: 0.08 });
    }
    setPhase('app');
  };

  if (phase === 'loading') {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  if (phase === 'login') {
    return <LoginModal onSuccess={handleLoginSuccess} />;
  }

  if (phase === 'location') {
    return <DefaultLocationModal onComplete={handleLocationComplete} />;
  }

  return (
    <Router>
      <div className="flex bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-white selection:text-black">
        <Sidebar onLoginClick={() => setShowLogin(true)} />
        <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-[#050505]">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 md:pt-8 max-w-[1600px] mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
            <Routes>
              <Route path="/"                element={<Dashboard />} />
              <Route path="/route-analyzer"  element={<RouteAnalyzer />} />
              <Route path="/incident-center" element={<IncidentCenter />} />
              <Route path="/settings"        element={<Settings />} />
              <Route path="/help"            element={<Help />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Re-login modal triggered from sidebar UserMenu */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </Router>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CityProvider>
          <AppShell />
        </CityProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
