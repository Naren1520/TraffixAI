import React, { useState } from 'react';
import { Search, Square, Play, Activity, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ searchQuery, setSearchQuery, handleLocationSearch, isMonitoring, toggleMonitoring }) => {
  const location = useLocation();
  const { recentSearches, isLoggedIn } = useAuth();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelectRecent = (search) => {
    setSearchQuery(search.city);
    setShowSuggestions(false);
  };
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0A0A0A] p-5 lg:p-8 rounded-2xl border border-[#222] mb-8 gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
          {location.pathname === '/' ? 'Overview' : 'Route Intelligence'}
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-[#666] mt-2">
          Real-time metrics & observation
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3">
        {location.pathname === '/' && (
          <form onSubmit={handleLocationSearch} className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search city or region..."
              className="bg-[#111] border border-[#333] text-white placeholder-[#666] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-white transition-all w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
            />
            <Search className="w-4 h-4 text-[#666] absolute left-3.5" />
            <button type="submit" className="hidden">Search</button>

            {/* Recent searches dropdown */}
            {showSuggestions && isLoggedIn && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden">
                <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-[#555] font-semibold">Recent Searches</p>
                {recentSearches.slice(0, 6).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => handleSelectRecent(s)}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-[#111] transition text-left"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#555] flex-shrink-0" />
                    <span className="text-sm text-[#CCC]">{s.city}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        )}

        {location.pathname === '/' && (
          <button 
            onClick={toggleMonitoring}
            className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto ${
              isMonitoring 
                ? 'bg-[#1A0505] text-rose-500 border border-rose-900/50 hover:bg-[#2A0808]' 
                : 'bg-white text-black hover:bg-[#E5E5E5]'
            }`}
          >
            {isMonitoring ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isMonitoring ? 'Halt Monitoring' : 'Start Feed'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
