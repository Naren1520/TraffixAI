import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Navigation, AlertCircle, CheckCircle2, AlertTriangle, Zap, Route } from 'lucide-react';
import RouteSearch from '../../components/route/RouteSearch';
import RouteDetails from '../../components/route/RouteDetails';
import RouteMap from '../../components/map/RouteMap';
import RouteAnalyzerSkeleton from './RouteAnalyzerSkeleton';
import { apiUrl } from '../../api';

const ROUTE_ANALYZER_STATE_KEY = 'traffixai_route_analyzer_state';

function formatMinutesAsHours(minutes) {
  const total = Math.round(minutes);
  if (total < 60) {
    return `${total} min`;
  }
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

function readStoredAnalysis() {
  try {
    const stored = localStorage.getItem(ROUTE_ANALYZER_STATE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);

    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function getSelectedRoute(routeData, selectedRouteId) {
  if (!routeData) return null;

  if (selectedRouteId) {
    const matchedRoute = routeData.routes?.find((route) => route.routeId === selectedRouteId);
    if (matchedRoute) return matchedRoute;

    if (routeData.bestRoute?.routeId === selectedRouteId) {
      return routeData.bestRoute;
    }
  }

  return routeData.bestRoute || null;
}

function RouteAnalyzer() {
  const storedAnalysis = readStoredAnalysis();
  const [startLocation, setStartLocation] = useState(storedAnalysis?.startLocation ?? '');
  const [endLocation, setEndLocation] = useState(storedAnalysis?.endLocation ?? '');
  const [startCoords, setStartCoords] = useState(storedAnalysis?.startCoords ?? null);
  const [endCoords, setEndCoords] = useState(storedAnalysis?.endCoords ?? null);
  const [routeData, setRouteData] = useState(storedAnalysis?.routeData ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(storedAnalysis?.error ?? null);
  const [selectedRoute, setSelectedRoute] = useState(() =>
    getSelectedRoute(storedAnalysis?.routeData ?? null, storedAnalysis?.selectedRouteId ?? null)
  );
  const mapRef = useRef(null);

  useEffect(() => {
    try {
      const hasPersistedContent =
        startLocation ||
        endLocation ||
        startCoords ||
        endCoords ||
        routeData ||
        error;

      if (!hasPersistedContent) {
        localStorage.removeItem(ROUTE_ANALYZER_STATE_KEY);
        return;
      }

      localStorage.setItem(
        ROUTE_ANALYZER_STATE_KEY,
        JSON.stringify({
          startLocation,
          endLocation,
          startCoords,
          endCoords,
          routeData,
          selectedRouteId: selectedRoute?.routeId ?? routeData?.bestRoute?.routeId ?? null,
          error,
        })
      );
    } catch {
      // Ignore storage failures and keep the analyzer usable.
    }
  }, [startLocation, endLocation, startCoords, endCoords, routeData, selectedRoute, error]);

  const handleSearch = async (start, end, startLat, startLon, endLat, endLon) => {
    setStartLocation(start);
    setEndLocation(end);
    setStartCoords([startLon, startLat]);
    setEndCoords([endLon, endLat]);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(apiUrl('/api/route/analyze'), {
        startLocation: start,
        endLocation: end,
        startLat: startLat,
        startLon: startLon,
        endLat: endLat,
        endLon: endLon,
        city: 'Current'
      });

      setRouteData(response.data);
      if (response.data.bestRoute) {
        setSelectedRoute(response.data.bestRoute);
      }
      setError(null);
    } catch (err) {
      setError('Failed to analyze route. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-10">
      <div className="mb-0">
        <div className="flex items-center space-x-3 mb-2">
          <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white">Route Analyzer</h1>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[#666]">AI precision routing & analysis</p>
      </div>

      {/* Search Section */}
      <div className="bg-[#0A0A0A] border border-[#222] p-6 rounded-2xl w-full">
        <RouteSearch onSearch={handleSearch} loading={loading} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-[#1A0505] border border-rose-900 rounded-2xl p-6 flex items-center space-x-4">
          <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-rose-400 text-sm tracking-wide">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State — full skeleton while computing */}
      {loading && <RouteAnalyzerSkeleton />}

      {/* Results Section */}
      {routeData && !loading && (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out_forwards]">
          {/* Best Route Recommendation */}
          {routeData.bestRoute && (
            <div className="bg-[#050505] border border-[#333] border-l-2 border-l-emerald-500 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 opacity-5 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] transition duration-1000 group-hover:opacity-10"></div>
              
              <div className="flex items-start space-x-4 mb-6 relative z-10">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#888] mb-1">Recommended Execution</h2>
                  <p className="text-2xl font-light text-white">{routeData.bestRoute.routeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mb-1">Distance</p>
                  <p className="text-xl font-light text-white">{routeData.bestRoute.distance.toFixed(1)} <span className="text-xs text-[#555] font-mono">KM</span></p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mb-1">Est. Time</p>
                  <p className="text-xl font-light text-white">{formatMinutesAsHours(routeData.bestRoute.estimatedTime)}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mb-1">Delay</p>
                  <p className="text-xl font-light text-white">{formatMinutesAsHours(routeData.bestRoute.estimatedDelay)}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mb-1">Score</p>
                  <p className="text-xl font-light text-emerald-400">{routeData.bestRoute.routeScore.toFixed(0)}<span className="text-xs text-[#555] font-mono">/100</span></p>
                </div>
              </div>

              {/* AI Recommendation */}
              {routeData.aiRecommendation && (
                <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5 relative z-10 transition hover:border-[#444]">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[10px] uppercase tracking-widest text-white mb-2">AI Synopsis</p>
                      <p className="text-[#AAA] text-sm leading-relaxed">{routeData.aiRecommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Map and Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#222] min-h-[400px]">
              <RouteMap
                ref={mapRef}
                startCoords={startCoords}
                endCoords={endCoords}
                route={selectedRoute}
              />
            </div>
            <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 h-full">
              <RouteDetails
                routes={routeData.routes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
              />
            </div>
          </div>

          {/* Heavy Traffic Zones */}
          {selectedRoute && selectedRoute.heavyTrafficZones && selectedRoute.heavyTrafficZones.length > 0 && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E5E5E5]">Congestion Intersections</h3>
              </div>
              <div className="space-y-3">
                {selectedRoute.heavyTrafficZones.map((zone, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 bg-[#050505] border border-[#1A1A1A] rounded-xl transition hover:border-[#333]">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    <span className="text-[#CCC] text-sm font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results State */}
      {!routeData && !loading && !error && (
        <div className="flex items-center justify-center py-32 opacity-50">
          <div className="text-center">
            <Route className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#666] text-xs font-mono tracking-widest uppercase">Awaiting coordinates to render analysis</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteAnalyzer;
