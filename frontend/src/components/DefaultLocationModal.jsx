import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Search, CheckCircle2, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DefaultLocationModal = ({ onComplete }) => {
  const { updateDefaultLocation, user } = useAuth();

  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [searching, setSearching]   = useState(false);
  const [saving, setSaving]         = useState(false);

  const searchLocation = async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
      );
      setSuggestions(res.data);
    } catch {}
    finally { setSearching(false); }
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
    setSelected(null);
    searchLocation(e.target.value);
  };

  const handleSelect = (place) => {
    const city = place.name || place.display_name.split(',')[0];
    setQuery(city);
    setSelected({ city, lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setSuggestions([]);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    await updateDefaultLocation(selected.city, selected.lat, selected.lng);
    setSaving(false);
    onComplete(selected);
  };

  const handleSkip = () => {
    // Skip without setting — firstLogin stays true until they set it from Settings
    onComplete(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0A0A0A] border border-[#222] rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-[#00E676]" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Welcome, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#888] mt-1">
            Set your default city
          </p>
        </div>

        <p className="text-sm text-[#AAA] text-center mb-6 leading-relaxed">
          TraffixAI will automatically load traffic data for this city every time you open the app.
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <div className="absolute left-4 top-3.5 text-[#555]">
            {searching
              ? <Loader className="w-4 h-4 animate-spin" />
              : <Search className="w-4 h-4" />
            }
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Type your city..."
            className="w-full bg-[#050505] border border-[#222] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white transition"
            autoComplete="off"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl z-20 overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-3 hover:bg-[#111] transition border-b border-[#1A1A1A] last:border-b-0"
                >
                  <p className="text-sm font-semibold text-white">
                    {s.name || s.display_name.split(',')[0]}
                  </p>
                  <p className="text-[11px] text-[#666] mt-0.5 truncate">{s.display_name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected confirmation */}
        {selected && (
          <div className="flex items-center space-x-2 bg-[#0A1A0A] border border-emerald-900/40 rounded-xl px-4 py-3 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-emerald-300 font-medium">{selected.city}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest text-[#666] border border-[#222] hover:border-[#444] hover:text-white transition"
          >
            Skip for now
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || saving}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition flex items-center justify-center space-x-2 ${
              selected && !saving
                ? 'bg-white text-black hover:bg-[#E5E5E5]'
                : 'bg-[#111] text-[#444] border border-[#222] cursor-not-allowed'
            }`}
          >
            {saving
              ? <><Loader className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></>
              : <span>Confirm</span>
            }
          </button>
        </div>

        <p className="text-center text-[10px] text-[#555] mt-4">
          You can change this anytime in Settings.
        </p>
      </div>
    </div>
  );
};

export default DefaultLocationModal;
