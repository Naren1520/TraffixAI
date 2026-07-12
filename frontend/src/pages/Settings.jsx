import React, { useState } from 'react';
import axios from 'axios';
import {
  User, Mail, MapPin, Clock, Search, CheckCircle2,
  Loader, History, Settings as SettingsIcon, LogOut, Pencil, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user, recentSearches, updateDefaultLocation, logout } = useAuth();

  const [editing, setEditing]         = useState(false);
  const [locQuery, setLocQuery]       = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [searching, setSearching]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch { return iso; }
  };

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

  const handleLocInput = (e) => {
    setLocQuery(e.target.value);
    setSelected(null);
    searchLocation(e.target.value);
  };

  const handleSelect = (place) => {
    const city = place.name || place.display_name.split(',')[0];
    setLocQuery(city);
    setSelected({ city, lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setSuggestions([]);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await updateDefaultLocation(selected.city, selected.lat, selected.lng);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setLocQuery('');
    setSelected(null);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleCancel = () => {
    setEditing(false);
    setLocQuery('');
    setSelected(null);
    setSuggestions([]);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col space-y-8 pb-10">

      {/* Page header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <SettingsIcon className="w-5 h-5 text-white" />
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white">Settings</h1>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[#666]">
          Account preferences & configuration
        </p>
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#555] font-semibold mb-6">
          Profile
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {user.picture ? (
            <img src={user.picture} alt={user.name}
              className="w-20 h-20 rounded-full border-2 border-[#333] flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-[#333] flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-[#666]" />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">Full Name</p>
              <p className="text-white font-semibold text-lg">{user.name}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-4 flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#666] flex-shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#555]">Email</p>
                  <p className="text-sm text-white mt-0.5 break-all">{user.email}</p>
                </div>
              </div>
              <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-4 flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#666] flex-shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#555]">Member Since</p>
                  <p className="text-sm text-white mt-0.5">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Default City ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#555] font-semibold">
            Default City
          </p>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-1.5 text-xs text-[#888] hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-[#1A1A1A] border border-transparent hover:border-[#333]"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          )}
        </div>
        <p className="text-xs text-[#666] mb-5">
          Loaded automatically every time you open TraffixAI.
        </p>

        {/* DISPLAY MODE */}
        {!editing && (
          <div className="flex items-center space-x-3 bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-4">
            <div className="w-9 h-9 rounded-full bg-[#0A1A0A] border border-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#00E676]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#555]">Current default</p>
              <p className="text-base font-semibold text-white mt-0.5">
                {user.defaultCity || <span className="text-[#555] font-normal italic">Not set</span>}
              </p>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {editing && (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-[#555]">
                {searching
                  ? <Loader className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />
                }
              </div>
              <input
                type="text"
                value={locQuery}
                onChange={handleLocInput}
                placeholder="Search for a new city..."
                autoFocus
                autoComplete="off"
                className="w-full bg-[#050505] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white transition"
              />
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

            {selected && (
              <div className="flex items-center space-x-2 bg-[#0A1A0A] border border-emerald-900/40 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-300 font-medium">{selected.city}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-1">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-[#666] border border-[#222] hover:border-[#444] hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!selected || saving}
                className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition ${
                  selected && !saving
                    ? 'bg-white text-black hover:bg-[#E5E5E5]'
                    : 'bg-[#111] text-[#444] border border-[#222] cursor-not-allowed'
                }`}
              >
                {saving && <Loader className="w-3.5 h-3.5 animate-spin" />}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div className="mt-4 flex items-center space-x-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Default city updated successfully.</span>
          </div>
        )}
      </div>

      {/* ── Recent Searches ──────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#555] font-semibold mb-6">
          Recent Searches
        </p>
        {recentSearches.length === 0 ? (
          <p className="text-sm text-[#555] italic">No searches yet.</p>
        ) : (
          <div className="space-y-3">
            {recentSearches.map((s, i) => (
              <div key={i}
                className="flex items-center justify-between bg-[#050505] border border-[#1A1A1A] rounded-xl px-4 py-3">
                <div className="flex items-center space-x-3">
                  <History className="w-4 h-4 text-[#555] flex-shrink-0" />
                  <span className="text-sm text-white">{s.city}</span>
                </div>
                <span className="text-[10px] text-[#555] font-mono">
                  {s.searchedAt ? new Date(s.searchedAt).toLocaleDateString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Account ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#555] font-semibold mb-6">
          Account
        </p>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1A0505] border border-rose-900/50 text-rose-400 text-sm font-semibold hover:bg-[#2A0808] transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
}

export default Settings;
