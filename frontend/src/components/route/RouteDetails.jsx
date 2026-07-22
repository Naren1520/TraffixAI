import React from 'react';
import { Clock, MapPin, TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';

function formatMinutesAsHours(minutes) {
  const total = Math.round(minutes);
  if (total < 60) {
    return `${total} min`;
  }
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

function RouteDetails({ routes, selectedRoute, onSelectRoute }) {
  const getCongestionColor = (level) => {
    if (level === 'HIGH') return 'text-rose-500 bg-rose-500/5 border-rose-500/20';
    if (level === 'MEDIUM') return 'text-amber-500 bg-amber-500/5 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20';
  };

  const getCongestionIcon = (level) => {
    if (level === 'HIGH') return <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>;
    if (level === 'MEDIUM') return <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>;
    return <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>;
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-[#222]">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-[#888]" />
          <span>Computed Options</span>
        </h3>
        <span className="text-[10px] text-[#555] font-mono">{routes?.length || 0} FOUND</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-[#333] hover:scrollbar-thumb-[#444]">
        {routes && routes.map((route, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRoute(route)}
            className={`w-full p-5 text-left transition duration-300 border ${
              selectedRoute && selectedRoute.routeId === route.routeId
                ? 'bg-[#050505] border-white'
                : 'bg-[#000] border-[#222] hover:border-[#444]'
            }`}
          >
            {/* Route Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-light text-white text-base tracking-wide">{route.routeName}</h4>
                <p className="text-[10px] font-mono text-[#555] uppercase mt-1">{route.routeId.substring(0, 16)}...</p>
              </div>
              {route.isOptimal && (
                <div className="border border-emerald-500/30 text-emerald-400 px-2 py-1 flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Optimal</span>
                </div>
              )}
            </div>

            {/* Route Stats Minimal Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#111] border border-[#222] p-3 flex justify-between items-center">
                <span className="text-[10px] text-[#666] tracking-widest uppercase font-semibold">Dist</span>
                <span className="font-light text-white text-sm">{route.distance.toFixed(1)} <span className="text-[#555] text-[10px]">km</span></span>
              </div>
              <div className="bg-[#111] border border-[#222] p-3 flex justify-between items-center">
                <span className="text-[10px] text-[#666] tracking-widest uppercase font-semibold">Time</span>
                <span className="font-light text-white text-sm">{formatMinutesAsHours(route.estimatedTime)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 bg-[#111] border border-[#222] p-3">
               <div className="flex flex-col">
                  <span className="text-[10px] text-[#666] tracking-widest uppercase font-semibold mb-1">Score Matrix</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-1 bg-[#222] overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-1000"
                        style={{ width: `${route.routeScore}%` }}
                      ></div>
                    </div>
                  </div>
               </div>
               <span className="font-light text-white text-lg">{route.routeScore.toFixed(0)}<span className="text-[#555] text-[10px]">/100</span></span>
            </div>

            {/* Congestion Status */}
            <div className={`p-3 border text-[10px] uppercase tracking-widest font-bold flex items-center justify-start ${getCongestionColor(route.congestionLevel)}`}>
              {getCongestionIcon(route.congestionLevel)}
              <span>{route.congestionLevel} Density</span>
              {route.estimatedDelay > 0 && (
                <span className="ml-auto opacity-70">+{formatMinutesAsHours(route.estimatedDelay)} Delay</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RouteDetails;
