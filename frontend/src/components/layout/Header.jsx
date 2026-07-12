import React, { useState, useRef, useCallback } from 'react';
import { Search, Square, Play, Clock, MapPin, Loader } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Header = ({ searchQuery, setSearchQuery, handleLocationSearch, isMonitoring, toggleMonitoring }) => {
  const routerLocation = useLocation();
  const { recentSearches, isLoggedIn } = useAuth();

  const [suggestions, setSuggestions]   = useState([]);
  const [showDrop, setShowDrop]         = useState(false);
  const [searching, setSearching]       = useState(false);
  const debounceRef                     = useRef(null);

  // ── autocomplete ──────────────────────────────────────────────────────────

  const fetchSuggestions = useCallback(async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`
      );
      setSuggestions(res.data);
    } catch {}
    finally { setSearching(false); }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowDrop(true);
    clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(val.trim()), 280);
    } else {
      setSuggestions([]);
    }
  };

  // Clicking a Nominatim suggestion → fire the search immediately
  const handleSelectSuggestion = (place) => {
    const city = place.name || place.display_name.split(',')[0];
    setSearchQuery(city);
    setSuggestions([]);
    setShowDrop(false);
    // Synthesise a submit event so Dashboard's handleLocationSearch runs
    handleLocationSearch({ preventDefault: () => {}, _override: { query: city, lat: place.lat, lon: place.lon } });
  };

  // Clicking a recent search → set query then submit
  const handleSelectRecent = (search) => {
    setSearchQuery(search.city);
    setSuggestions([]);
    setShowDrop(false);
    handleLocationSearch({ preventDefault: () => {}, _override: { query: search.city, lat: search.lat, lon: search.lng } });
  };

  const handleFocus = () => setShowDrop(true);
  const handleBlur  = () => setTimeout(() => setShowDrop(false), 180);

  // Decide what to show in the dropdown
  const showLiveSuggestions   = suggestions.length > 0;
  const showRecentSuggestions = !showLiveSuggestions && isLoggedIn && recentSearches.length > 0 && showDrop && searchQuery.length === 0;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0A0A0A] p-5 lg:p-8 rounded-2xl border border-[#222] mb-8 gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
          {routerLocation.pathname === '/' ? 'Overview' : 'Route Intelligence'}
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-[#666] mt-2">
          Real-time metrics & observation
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3">

        {/* Search form — only on Dashboard */}
        {routerLocation.pathname === '/' && (
          <form onSubmit={handleLocationSearch} className="relative flex items-center w-full sm:w-auto">
            {/* Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {searching
                  ? <Loader className="w-4 h-4 text-[#555] animate-spin" />
                  : <Search className="w-4 h-4 text-[#666]" />
                }
              </div>
              <input
                type="text"
                placeholder="Search city or region..."
                className="bg-[#111] border border-[#333] text-white placeholder-[#666] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-white transition-all w-full"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
              />

              {/* Dropdown */}
              {showDrop && (showLiveSuggestions || showRecentSuggestions) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden">

                  {/* Live Nominatim suggestions */}
                  {showLiveSuggestions && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-[#555] font-semibold">
                        Locations
                      </p>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={() => handleSelectSuggestion(s)}
                          className="flex items-start space-x-3 w-full px-4 py-2.5 hover:bg-[#111] transition text-left"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#555] flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {s.name || s.display_name.split(',')[0]}
                            </p>
                            <p className="text-[11px] text-[#555] truncate">{s.display_name}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Recent searches (shown when input is empty) */}
                  {showRecentSuggestions && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-[#555] font-semibold">
                        Recent
                      </p>
                      {recentSearches.slice(0, 6).map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={() => handleSelectRecent(s)}
                          className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-[#111] transition text-left"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#555] flex-shrink-0" />
                          <span className="text-sm text-[#CCC]">{s.city}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hidden submit for keyboard Enter */}
            <button type="submit" className="hidden" />
          </form>
        )}

        {/* Monitor toggle */}
        {routerLocation.pathname === '/' && (
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
