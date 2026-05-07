import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RouteAnalyzer from './pages/RouteAnalyzer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/route-analyzer" element={<RouteAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;
