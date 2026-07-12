import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Navigation, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Route Analyzer', path: '/route-analyzer', icon: Navigation },
    { name: 'Incident Center', path: '/incident-center', icon: AlertTriangle },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <div className="w-64 h-full bg-[#0F0F0F] border-r border-[#222] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 pb-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#050505] border border-[#222]">
          <img src="/logo1.png" alt="TraffixAI" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">TraffixAI</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#888]">Intelligence</p>
        </div>
      </div>

      <div className="flex-1 px-4 mt-8 space-y-2">
        <p className="px-4 text-[10px] font-semibold text-[#555] uppercase tracking-widest mb-4">Menu</p>
        {links.map((link, idx) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path && !link.disabled;
          return (
            <NavLink
              key={idx}
              to={link.disabled ? '#' : link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${
                isActive
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
              } ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#888] group-hover:text-white'}`} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-8">
        <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
          <div className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse mb-2"></div>
          <p className="text-xs text-[#AAA]">System Status</p>
          <p className="text-sm font-semibold text-white mt-1">All services operational</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
