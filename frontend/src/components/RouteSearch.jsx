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
    <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-8 backdrop-blur-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Start Location */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-2">📍 Start Point</label>
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-[#009688]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={startInput}
              onChange={handleStartInputChange}
              onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
              placeholder="Enter starting location..."
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#009688] transition"
            />
            
            {/* Start Suggestions */}
            {showStartSuggestions && startSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                {startSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectStart(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[#2a2a2a]/50 transition text-gray-300 text-sm border-b border-[#2a2a2a] last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.name || suggestion.display_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedStart && (
            <p className="text-xs text-[#69f0ae] mt-1">✓ Selected</p>
          )}
        </div>

        {/* End Location */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-300 mb-2">📍 End Point</label>
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-[#009688]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={endInput}
              onChange={handleEndInputChange}
              onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
              placeholder="Enter destination..."
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#009688] transition"
            />
            
            {/* End Suggestions */}
            {showEndSuggestions && endSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                {endSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectEnd(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[#2a2a2a]/50 transition text-gray-300 text-sm border-b border-[#2a2a2a] last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.name || suggestion.display_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedEnd && (
            <p className="text-xs text-[#69f0ae] mt-1">✓ Selected</p>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyzeRoute}
        disabled={!isFormValid}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
          isFormValid
            ? 'bg-[#009688] text-white hover:bg-[#00897b] active:scale-95'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>{loading ? 'Analyzing Routes...' : 'Analyze Routes'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default RouteSearch;
