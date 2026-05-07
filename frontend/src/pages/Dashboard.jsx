import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, Car, Play, Square, Activity, MapPin, Search } from 'lucide-react';
import Header from '../components/Header';
import TomTomMap from '../components/TomTomMap';

function Dashboard() {
  const [trafficData, setTrafficData] = useState([]);
  const [topRoads, setTopRoads] = useState([]);
  const [leastRoads, setLeastRoads] = useState([]); // Free flow state
  const [peakHour, setPeakHour] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([74.8427, 12.8711]); // Default Mangaluru
  const [currentCity, setCurrentCity] = useState('Mangalore'); // Default current city
  const currentCityRef = useRef(currentCity); // Ref to avoid stale closure in WebSocket

  useEffect(() => {
    currentCityRef.current = currentCity;
  }, [currentCity]);

  useEffect(() => {
    fetchInitialData(currentCity);
    connectWebSocket();
  }, []);

  const fetchInitialData = async (cityName = '') => {
    try {
      const qs = cityName ? `?city=${encodeURIComponent(cityName)}` : '';
      const [allRes, topRoadsRes, leastRoadsRes, peakRes, alertsRes] = await Promise.all([
        axios.get(`/api/traffic/all${qs}`),
        axios.get(`/api/traffic/top-roads${qs}`),
        axios.get(`/api/traffic/least-roads${qs}`),
        axios.get(`/api/traffic/peak-hours${qs}`),
        axios.get(`/api/traffic/alerts${qs}`)
      ]);
      setTrafficData(allRes.data.slice(-20)); // last 20 elements
      setTopRoads(topRoadsRes.data);
      setLeastRoads(leastRoadsRes.data);
      setPeakHour(peakRes.data);
      setAlerts(alertsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('/ws-traffic');
    const client = Stomp.over(socket);
    client.debug = () => {}; // disable debug logs

    client.connect({}, () => {
      client.subscribe('/topic/traffic', (message) => {
        const newData = JSON.parse(message.body);
        
        // Prevent cross-city data bleeding: Only process the socket message if it matches our CURRENT tracked city
        if (newData.roadId && newData.roadId.toLowerCase().includes(currentCityRef.current.toLowerCase())) {
          setTrafficData(prev => [...prev.slice(-19), newData]);
          // Re-fetch aggregated data on updates using the latest city reference
          fetchInitialData(currentCityRef.current);
        }
      });
    });
  };

  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        await axios.post('/api/live/stop');
      } else {
        await axios.post('/api/live/start');
      }
      setIsMonitoring(!isMonitoring);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Using OpenStreetMap Nominatim for free geocoding to avoid TomTom API 403 Forbidden errors
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        
        // Format the user's exact search string nicely (e.g. "banglore" -> "Banglore") 
        // instead of relying on OpenStreetMap's arbitrary internal subdivision names
        const rawSearch = searchQuery.trim();
        const cityName = rawSearch.charAt(0).toUpperCase() + rawSearch.slice(1).toLowerCase();
        
        setCurrentCity(cityName);
        setMapCenter([parseFloat(lon), parseFloat(lat)]);

        // ðŸš€ Notify the Java Backend to start pinging real traffic data for this new location!
        await axios.post(`/api/live/location?name=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`);
        
        // Fetch new initial data specifically for this city
        fetchInitialData(cityName);
        
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      alert("Error searching for location.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#eaeaea] p-4 md:p-8 font-sans selection:bg-[#009688]/30">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto basis-full flex flex-col space-y-6 md:space-y-8">
        
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleLocationSearch={handleLocationSearch}
          isMonitoring={isMonitoring}
          toggleMonitoring={toggleMonitoring}
        />

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Peak Hour Card */}
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-1">Today's Peak Congestion</p>
              <h3 className="text-3xl font-bold text-white">
                {peakHour?.peakHour !== undefined ? `${peakHour.peakHour % 12 || 12}:00 ${peakHour.peakHour >= 12 ? 'PM' : 'AM'}` : '--:--'}
              </h3>
              <p className="text-[#009688] text-sm mt-2 font-medium">Busiest hour since 12:00 AM</p>
            </div>
            <div className="bg-[#009688]/10 p-4 rounded-full">
              <Activity className="w-10 h-10 text-[#009688]" />
            </div>
          </div>

          {/* Active Vehicles Card */}
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-1">Estimated Load</p>
              <h3 className="text-3xl font-bold text-white">
                {trafficData.length > 0 ? trafficData[trafficData.length - 1].vehicleCount : '0'}
              </h3>
              <p className="text-[#69f0ae] text-sm mt-2 font-medium">Real-time flow density</p>
            </div>
            <div className="bg-[#69f0ae]/10 p-4 rounded-full">
              <Car className="w-10 h-10 text-[#69f0ae]" />
            </div>
          </div>

          {/* Total Alerts Card */}
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-1">Active Alerts</p>
              <h3 className="text-3xl font-bold text-white">{alerts.length}</h3>
              <p className="text-rose-400 text-sm mt-2 font-medium">Critical system notifications</p>
            </div>
            <div className="bg-rose-500/10 p-4 rounded-full">
              <AlertCircle className="w-10 h-10 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Main Map + Data Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TomTomMap center={mapCenter} />
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#009688]" />
              <span>Live Speed Analytics</span>
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>

                  <defs>
                    <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#009688" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#009688" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true})}
                    stroke="#444444" 
                    tick={{fill: '#888888'}}
                  />
                  <YAxis stroke="#444444" tick={{fill: '#888888'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderRadius: '0.75rem', color: '#f8fafc' }}
                    labelFormatter={(label) => new Date(label).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true})}
                  />
                  <Area type="monotone" dataKey="vehicleCount" stroke="#009688" strokeWidth={3} fillOpacity={1} fill="url(#colorVehicles)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Separated Routes Analyics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Free & Safe Routes (Left) */}
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl flex flex-col h-[400px]">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#69f0ae]" />
              <span>Free & Safe Routes (Low Congestion)</span>
            </h3>
            <div className="space-y-3 overflow-y-auto pr-2 pb-2">
              {leastRoads.map((road, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-[#222222]/40 rounded-xl border-l-4 border-[#69f0ae] shadow-md shadow-[#69f0ae]/10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#69f0ae]/20 text-[#69f0ae] font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-[#eaeaea] text-lg">{road.roadId}</span>
                  </div>
                  <span className="px-4 py-2 bg-[#69f0ae]/10 text-[#69f0ae] border border-[#69f0ae]/30 rounded-lg font-medium text-sm">
                    {road.totalVehicleCount} Flow Index
                  </span>
                </div>
              ))}
              {leastRoads.length === 0 && <p className="text-gray-400 italic mt-4 text-center">Fetching safe routes...</p>}
            </div>
          </div>

          {/* Highest Congestion (Right) */}
          <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl flex flex-col h-[400px]">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <span>Highest Congestion (Avoid)</span>
            </h3>
            <div className="space-y-3 overflow-y-auto pr-2 mb-6">
              {topRoads.map((road, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-[#222222]/40 rounded-xl border-l-4 border-rose-500 shadow-md shadow-rose-500/10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-rose-500/20 text-rose-400 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-[#eaeaea] text-lg">{road.roadId}</span>
                  </div>
                  <span className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg font-medium text-sm animate-pulse">
                    {road.totalVehicleCount} Traffic Units
                  </span>
                </div>
              ))}
              {topRoads.length === 0 && <p className="text-gray-400 italic mt-4 text-center">Fetching congested routes...</p>}
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#2a2a2a] backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>System Alerts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.slice(-6).reverse().map((alert, idx) => (
              <div key={idx} className="bg-rose-500/5 p-5 rounded-xl border border-rose-500/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#eaeaea]">{alert.roadId}</span>
                  <span className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-rose-400 text-sm font-medium">{alert.alertReason}</p>
                <div className="mt-4 flex space-x-4 text-xs font-semibold text-gray-300">
                  <span className="bg-[#121212]/50 px-2 py-1 rounded">Count: {alert.vehicleCount}</span>
                  <span className="bg-[#121212]/50 px-2 py-1 rounded">Speed: {alert.avgSpeed.toFixed(1)} km/h</span>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400">
                No active traffic alerts. Excellent flow currently!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
