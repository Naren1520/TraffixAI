import React from 'react';
import { Search, Square, Play, Navigation } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ searchQuery, setSearchQuery, handleLocationSearch, isMonitoring, toggleMonitoring }) => {
  const location = useLocation();
  
  return (
    <header className="flex flex-col lg:flex-row justify-between items-center bg-[#1a1a1a]/80 p-4 md:p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl gap-6 lg:gap-0">
      <Link to="/" className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4 cursor-pointer hover:opacity-80 transition">
        {/* Round Logo Container */}
        <div className="bg-[#009688]/10 p-1 rounded-full border-2 border-[#009688]/30 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg shadow-[#009688]/20">
          <img src="/logo1.png" alt="TraffixAI Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#009688] to-[#69f0ae]">
            TraffixAI 
          </h1>
          <p className="text-gray-300 text-xs md:text-sm font-medium mt-1">Traffic Monitoring &amp; Management System</p>
        </div>
      </Link>
      
      <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto gap-4 sm:space-x-4 space-x-0">
        {location.pathname === '/' && (
          <form onSubmit={handleLocationSearch} className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search a place..."
              className="bg-[#222222]/80 border border-[#333333] text-[#eaeaea] placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent transition-all w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <button type="submit" className="hidden">Search</button>
          </form>
        )}

        <Link
          to="/route-analyzer"
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg w-full sm:w-auto whitespace-nowrap ${
            location.pathname === '/route-analyzer'
              ? 'bg-[#009688] text-white border border-[#009688] shadow-[#009688]/30'
              : 'bg-[#009688]/20 text-[#009688] border border-[#009688]/50 hover:bg-[#009688]/30 hover:shadow-[#009688]/20'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span>Route Analyzer</span>
        </Link>

        {location.pathname === '/' && (
          <button 
            onClick={toggleMonitoring}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg w-full sm:w-auto ${
              isMonitoring 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 hover:shadow-rose-500/20' 
                : 'bg-[#69f0ae]/20 text-[#69f0ae] border border-[#69f0ae]/50 hover:bg-[#69f0ae]/30 hover:shadow-[#69f0ae]/20'
            }`}
          >
            {isMonitoring ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span className="whitespace-nowrap">{isMonitoring ? 'Stop Monitoring' : 'Start Live Monitoring'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
