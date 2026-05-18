import React from 'react';
import { Search, Square, Play, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ searchQuery, setSearchQuery, handleLocationSearch, isMonitoring, toggleMonitoring }) => {
  const location = useLocation();
  
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0A0A0A] p-6 lg:p-8 rounded-2xl border border-[#222] mb-8">
      <div>
        <h2 className="text-2xl font-light text-white tracking-wide">
          {location.pathname === '/' ? 'Overview' : 'Route Intelligence'}
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-[#666] mt-2">
          Real-time metrics & observation
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center w-full md:w-auto mt-6 md:mt-0 gap-4">
        {location.pathname === '/' && (
          <form onSubmit={handleLocationSearch} className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search city or region..."
              className="bg-[#111] border border-[#333] text-white placeholder-[#666] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-white transition-all w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 text-[#666] absolute left-3.5" />
            <button type="submit" className="hidden">Search</button>
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
