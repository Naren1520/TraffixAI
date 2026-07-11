import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, Car, Play, Square, Activity, MapPin, Search } from 'lucide-react';
import Header from '../components/Header';
import TomTomMap from '../components/TomTomMap';
import { CityContext } from '../context/CityContext';
import { apiUrl, wsUrl } from '../api';

function Dashboard() {
  const { updateCity } = useContext(CityContext);
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
    // Update global city context whenever dashboard city changes
    // Using a debounce-like approach to prevent infinite loops
    updateCity(currentCity, { lat: mapCenter[1], lng: mapCenter[0], radius: 0.08 });
  }, [currentCity, mapCenter]);

  useEffect(() => {
    fetchInitialData(currentCity);
    connectWebSocket();
  }, []);

  const fetchInitialData = async (cityName = '') => {
    try {
      const qs = cityName ? `?city=${encodeURIComponent(cityName)}` : '';
      const [allRes, topRoadsRes, leastRoadsRes, peakRes, alertsRes] = await Promise.all([
        axios.get(apiUrl(`/api/traffic/all${qs}`)),
        axios.get(apiUrl(`/api/traffic/top-roads${qs}`)),
        axios.get(apiUrl(`/api/traffic/least-roads${qs}`)),
        axios.get(apiUrl(`/api/traffic/peak-hours${qs}`)),
        axios.get(apiUrl(`/api/traffic/alerts${qs}`))
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
    const socket = new SockJS(wsUrl('/ws-traffic'));
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
        await axios.post(apiUrl('/api/live/stop'));
      } else {
        await axios.post(apiUrl('/api/live/start'));
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
        await axios.post(apiUrl(`/api/live/location?name=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`));
        
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
    <div className="flex flex-col space-y-8 pb-10">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLocationSearch={handleLocationSearch}
        isMonitoring={isMonitoring}
        toggleMonitoring={toggleMonitoring}
      />

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Peak Congestion</p>
            <h3 className="text-3xl font-light text-white">
              {peakHour?.peakHour !== undefined ? `${peakHour.peakHour % 12 || 12}:00 ${peakHour.peakHour >= 12 ? 'PM' : 'AM'}` : '--:--'}
            </h3>
            <p className="text-[#666] text-xs mt-3">Busiest hour today</p>
          </div>
          <div className="p-3 bg-[#111] rounded-full border border-[#222]">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Estimated Load</p>
            <h3 className="text-3xl font-light text-white">
              {trafficData.length > 0 ? trafficData[trafficData.length - 1].vehicleCount : '0'}
            </h3>
            <p className="text-[#666] text-xs mt-3">Real-time flow density</p>
          </div>
          <div className="p-3 bg-[#111] rounded-full border border-[#222]">
            <Car className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Active Alerts</p>
            <h3 className="text-3xl font-light text-white">{alerts.length}</h3>
            <p className="text-rose-500 text-xs mt-3">Critical notifications</p>
          </div>
          <div className="p-3 bg-[#1A0505] rounded-full border border-[#300]">
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Main Map + Data Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden border border-[#222]">
          <TomTomMap center={mapCenter} />
        </div>
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222]">
          <h3 className="text-sm font-semibold mb-6 flex items-center space-x-3 text-white uppercase tracking-widest">
            <Activity className="w-4 h-4 text-[#888]" />
            <span>Live Diagnostics</span>
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true})}
                  stroke="#333" 
                  tick={{fill: '#666', fontSize: 10}}
                />
                <YAxis stroke="#333" tick={{fill: '#666', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#222', borderRadius: '8px', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                  labelFormatter={(label) => new Date(label).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true})}
                />
                <Area type="monotone" dataKey="vehicleCount" stroke="#FFF" strokeWidth={2} fillOpacity={1} fill="url(#colorVehicles)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Separated Routes Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Free & Safe Routes */}
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] xl:h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold mb-6 flex items-center space-x-3 text-[#E5E5E5] uppercase tracking-[0.15em]">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Optimized Routes</span>
          </h3>
          <div className="space-y-4 overflow-y-auto pr-2 pb-2">
            {leastRoads.map((road, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-[#1A1A1A] last:border-b-0 group transition hover:border-[#333]">
                <div className="flex items-center space-x-4">
                  <div className="text-emerald-400 font-mono text-xs w-6 text-center">{String(idx + 1).padStart(2, '0')}.</div>
                  <span className="font-medium text-[#E5E5E5] text-sm group-hover:text-emerald-300 transition-colors">{road.roadId}</span>
                </div>
                <span className="text-emerald-400 text-xs font-mono">FLOW: {road.totalVehicleCount}</span>
              </div>
            ))}
            {leastRoads.length === 0 && <p className="text-[#555] text-xs tracking-widest uppercase italic mt-4 text-center">Awaiting telemetry...</p>}
          </div>
        </div>

        {/* Highest Congestion */}
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] xl:h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold mb-6 flex items-center space-x-3 text-[#E5E5E5] uppercase tracking-[0.15em]">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Congestion Zones</span>
          </h3>
          <div className="space-y-4 overflow-y-auto pr-2 mb-6">
            {topRoads.map((road, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-[#1A1A1A] last:border-b-0 group transition hover:border-[#333]">
                <div className="flex items-center space-x-4">
                  <div className="text-rose-500 font-mono text-xs w-6 text-center">{String(idx + 1).padStart(2, '0')}.</div>
                  <span className="font-medium text-[#E5E5E5] text-sm group-hover:text-rose-400 transition-colors">{road.roadId}</span>
                </div>
                <span className="text-rose-500 text-xs font-mono animate-pulse">LOAD: {road.totalVehicleCount}</span>
              </div>
            ))}
            {topRoads.length === 0 && <p className="text-[#555] text-xs tracking-widest uppercase italic mt-4 text-center">Awaiting telemetry...</p>}
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222]">
        <h3 className="text-[11px] font-bold mb-8 flex items-center space-x-3 text-[#E5E5E5] uppercase tracking-[0.15em]">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>Priority Alerts</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.slice(-6).reverse().map((alert, idx) => (
            <div key={idx} className="flex flex-col relative pl-4 border-l border-rose-900 hover:border-rose-500 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-widest">{alert.roadId}</span>
                <span className="text-[10px] text-[#666] font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-rose-400 text-sm font-medium mb-4">{alert.alertReason}</p>
              <div className="flex space-x-4 text-[10px] text-[#888] font-mono mt-auto">
                <span>V-COUNT: {alert.vehicleCount}</span>
                <span>SPD: {alert.avgSpeed.toFixed(1)}KM/H</span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="col-span-full py-8 text-center text-[#555] text-xs tracking-widest uppercase">
              System nominal. No alerts.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
