import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import Dashboard from './pages/Dashboard';
import RouteAnalyzer from './pages/RouteAnalyzer';
import IncidentCenter from './pages/IncidentCenter';
import Help from './pages/Help';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return <Loader onComplete={() => setIsLoaded(true)} />;
  }

  return (
    <CityProvider>
      <Router>
        <div className="flex bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-white selection:text-black">
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen bg-[#050505]">
            <div className="p-8 max-w-[1600px] mx-auto animate-[fadeIn_0.5s_ease-out_forwards]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/route-analyzer" element={<RouteAnalyzer />} />
                <Route path="/incident-center" element={<IncidentCenter />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </CityProvider>
  );
}

export default App;
