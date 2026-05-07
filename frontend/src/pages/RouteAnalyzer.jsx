import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Navigation, AlertCircle, CheckCircle2, AlertTriangle, Zap, Route, Gauge } from 'lucide-react';
import RouteSearch from '../components/RouteSearch';
import RouteDetails from '../components/RouteDetails';
import RouteMap from '../components/RouteMap';

function RouteAnalyzer() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapRef = useRef(null);

  const handleSearch = async (start, end, startLat, startLon, endLat, endLon) => {
    setStartLocation(start);
    setEndLocation(end);
    setStartCoords([startLon, startLat]);
    setEndCoords([endLon, endLat]);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('/api/route/analyze', {
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
    } catch (err) {
      setError('Failed to analyze route. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#eaeaea] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Navigation className="w-8 h-8 text-[#009688]" />
            <h1 className="text-4xl font-bold">Route Analyzer</h1>
          </div>
          <p className="text-gray-400 text-lg">Find the best route with real-time traffic insights and AI recommendations</p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <RouteSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 flex items-center space-x-4">
            <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-400">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#009688]/30 border-t-[#009688] rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-400">Analyzing routes...</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {routeData && !loading && (
          <div className="space-y-8">
            {/* Best Route Recommendation */}
            {routeData.bestRoute && (
              <div className="bg-gradient-to-r from-[#009688]/20 to-[#69f0ae]/20 border border-[#009688]/30 rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#009688] flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Recommended Route</h2>
                    <p className="text-[#69f0ae]">{routeData.bestRoute.routeName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-[#2a2a2a]">
                    <p className="text-gray-400 text-sm mb-1">Distance</p>
                    <p className="text-xl font-bold text-white">{routeData.bestRoute.distance.toFixed(1)} km</p>
                  </div>
                  <div className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-[#2a2a2a]">
                    <p className="text-gray-400 text-sm mb-1">Est. Time</p>
                    <p className="text-xl font-bold text-white">{routeData.bestRoute.estimatedTime.toFixed(0)} min</p>
                  </div>
                  <div className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-[#2a2a2a]">
                    <p className="text-gray-400 text-sm mb-1">Delay</p>
                    <p className="text-xl font-bold text-white">{routeData.bestRoute.estimatedDelay.toFixed(0)} min</p>
                  </div>
                  <div className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-[#2a2a2a]">
                    <p className="text-gray-400 text-sm mb-1">Route Score</p>
                    <p className="text-xl font-bold text-[#009688]">{routeData.bestRoute.routeScore.toFixed(0)}/100</p>
                  </div>
                </div>

                {/* AI Recommendation */}
                {routeData.aiRecommendation && (
                  <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-[#ffd700] mb-1">🤖 AI Recommendation</p>
                        <p className="text-gray-300 leading-relaxed">{routeData.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Map and Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <RouteMap
                  ref={mapRef}
                  startCoords={startCoords}
                  endCoords={endCoords}
                  route={selectedRoute}
                />
              </div>

              {/* Route Details */}
              <div>
                <RouteDetails
                  routes={routeData.routes}
                  selectedRoute={selectedRoute}
                  onSelectRoute={setSelectedRoute}
                />
              </div>
            </div>

            {/* Heavy Traffic Zones */}
            {selectedRoute && selectedRoute.heavyTrafficZones && selectedRoute.heavyTrafficZones.length > 0 && (
              <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3 className="text-xl font-bold">Heavy Traffic Zones on Selected Route</h3>
                </div>
                <div className="space-y-3">
                  {selectedRoute.heavyTrafficZones.map((zone, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-rose-300">{zone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results State */}
        {!routeData && !loading && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Route className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Enter a start and end location to analyze routes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteAnalyzer;
