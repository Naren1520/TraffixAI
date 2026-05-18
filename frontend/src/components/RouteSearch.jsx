import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, ArrowRight } from 'lucide-react';

function RouteSearch({ onSearch, loading }) {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  const searchLocation = async (query) => {
    if (query.length < 2) return [];
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  };

  const handleStartInputChange = async (e) => {
    const value = e.target.value;
    setStartInput(value);
    if (value.length >= 2) {
      const suggestions = await searchLocation(value);
      setStartSuggestions(suggestions);
      setShowStartSuggestions(true);
    } else {
      setStartSuggestions([]);
      setShowStartSuggestions(false);
    }
  };

  const handleEndInputChange = async (e) => {
    const value = e.target.value;
    setEndInput(value);
    if (value.length >= 2) {
      const suggestions = await searchLocation(value);
      setEndSuggestions(suggestions);
      setShowEndSuggestions(true);
    } else {
      setEndSuggestions([]);
      setShowEndSuggestions(false);
    }
  };

  const handleSelectStart = (location) => {
    setStartInput(location.display_name);
    setSelectedStart(location);
    setShowStartSuggestions(false);
  };

  const handleSelectEnd = (location) => {
    setEndInput(location.display_name);
    setSelectedEnd(location);
    setShowEndSuggestions(false);
  };

  const handleAnalyzeRoute = () => {
    if (selectedStart && selectedEnd) {
      onSearch(
        selectedStart.display_name,
        selectedEnd.display_name,
        parseFloat(selectedStart.lat),
        parseFloat(selectedStart.lon),
        parseFloat(selectedEnd.lat),
        parseFloat(selectedEnd.lon)
      );
    }
  };

  const isFormValid = selectedStart && selectedEnd && !loading;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Start Location */}
        <div className="relative">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#666] mb-3">Origin</label>
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-[#555]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={startInput}
              onChange={handleStartInputChange}
              onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
              placeholder="Enter starting point..."
              className="w-full bg-[#050505] border border-[#222] rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white transition"
            />
            
            {/* Start Suggestions */}
            {showStartSuggestions && startSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto">
                {startSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectStart(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[#111] transition text-[#CCC] text-sm border-b border-[#1A1A1A] last:border-b-0"
                  >
                    <div className="font-semibold text-white">{suggestion.name || suggestion.display_name.split(',')[0]}</div>
                    <div className="text-[11px] text-[#666] leading-tight mt-1">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedStart && (
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#555] mt-3 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span> Selected</p>
          )}
        </div>

        {/* End Location */}
        <div className="relative">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#666] mb-3">Destination</label>
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-[#555]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={endInput}
              onChange={handleEndInputChange}
              onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
              placeholder="Enter destination..."
              className="w-full bg-[#050505] border border-[#222] rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white transition"
            />
            
            {/* End Suggestions */}
            {showEndSuggestions && endSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto">
                {endSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectEnd(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[#111] transition text-[#CCC] text-sm border-b border-[#1A1A1A] last:border-b-0"
                  >
                    <div className="font-semibold text-white">{suggestion.name || suggestion.display_name.split(',')[0]}</div>
                    <div className="text-[11px] text-[#666] leading-tight mt-1">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedEnd && (
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#555] mt-3 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span> Selected</p>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyzeRoute}
        disabled={!isFormValid}
        className={`w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center space-x-3 transition duration-300 ${
          isFormValid
            ? 'bg-white text-black hover:bg-[#E5E5E5] active:scale-[0.99] border hover:border-white'
            : 'bg-[#050505] text-[#444] border border-[#222] cursor-not-allowed'
        }`}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">{loading ? 'COMPUTING...' : 'COMPUTE ROUTE'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default RouteSearch;
