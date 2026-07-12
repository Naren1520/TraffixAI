import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

const UserMenu = ({ onLoginClick }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-[#E5E5E5] transition w-full justify-center"
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-[#1A1A1A] transition"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 rounded-full border border-[#333] flex-shrink-0"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#222] border border-[#333] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#888]" />
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
          <p className="text-[10px] text-[#666] truncate">{user.email}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#666] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111] border border-[#222] rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A1A]">
            <p className="text-xs font-semibold text-white">{user.name}</p>
            <p className="text-[10px] text-[#666] mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="flex items-center space-x-2 w-full px-4 py-3 text-xs text-rose-400 hover:bg-[#1A0505] transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
