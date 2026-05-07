import React from 'react';
import { Clock, MapPin, TrendingUp, Award } from 'lucide-react';

function RouteDetails({ routes, selectedRoute, onSelectRoute }) {
  const getCongestionColor = (level) => {
    if (level === 'HIGH') return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (level === 'MEDIUM') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-[#69f0ae] bg-[#69f0ae]/10 border-[#69f0ae]/30';
  };

  const getCongestionIcon = (level) => {
    if (level === 'HIGH') return '🔴';
    if (level === 'MEDIUM') return '🟡';
    return '🟢';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-[#009688]" />
        <span>Available Routes</span>
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {routes && routes.map((route, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRoute(route)}
            className={`w-full p-4 rounded-xl text-left transition transform ${
              selectedRoute && selectedRoute.routeId === route.routeId
                ? 'bg-[#009688]/20 border-2 border-[#009688] scale-105'
                : 'bg-[#1a1a1a]/80 border border-[#2a2a2a] hover:border-[#009688]/50'
            }`}
          >
            {/* Route Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-white text-sm">{route.routeName}</h4>
                <p className="text-xs text-gray-400">{route.routeId.substring(0, 20)}...</p>
              </div>
              {route.isOptimal && (
                <div className="bg-[#009688]/20 text-[#69f0ae] px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Optimal</span>
                </div>
              )}
            </div>

            {/* Route Stats */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Distance</span>
                </span>
                <span className="font-semibold text-white">{route.distance.toFixed(1)} km</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Est. Time</span>
                </span>
                <span className="font-semibold text-white">{route.estimatedTime.toFixed(0)} min</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Delay</span>
                <span className="font-semibold text-yellow-400">{route.estimatedDelay.toFixed(0)} min</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#009688] to-[#69f0ae]"
                      style={{ width: `${route.routeScore}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-[#009688] w-8">{route.routeScore.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Congestion Status */}
            <div className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 ${getCongestionColor(route.congestionLevel)}`}>
              <span>{getCongestionIcon(route.congestionLevel)}</span>
              <span>{route.congestionLevel} Congestion</span>
            </div>

            {/* Heavy Traffic Zones */}
            {route.heavyTrafficZones && route.heavyTrafficZones.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                <p className="text-xs text-gray-400 mb-1">⚠️ Heavy zones:</p>
                <p className="text-xs text-gray-500">{route.heavyTrafficZones.join(', ')}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RouteDetails;
