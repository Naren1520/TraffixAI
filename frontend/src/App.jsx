import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import RouteAnalyzer from './pages/RouteAnalyzer';
import IncidentCenter from './pages/IncidentCenter';
import Help from './pages/Help';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

const ProtectedLayout = () => (
  <div className="flex bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-white selection:text-black">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen bg-[#050505]">
      <div className="p-8 max-w-[1600px] mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
        <Outlet />
      </div>
    </main>
  </div>
);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return <Loader onComplete={() => setIsLoaded(true)} />;
  }

  return (
    <AuthProvider>
      <CityProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthGuard><ProtectedLayout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="route-analyzer" element={<RouteAnalyzer />} />
              <Route path="incident-center" element={<IncidentCenter />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </Router>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
