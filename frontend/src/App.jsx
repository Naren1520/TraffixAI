import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, Car, Play, Square, Activity, MapPin } from 'lucide-react';

function App() {
  const [trafficData, setTrafficData] = useState([]);
  const [topRoads, setTopRoads] = useState([]);
  const [peakHour, setPeakHour] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchInitialData();
    connectWebSocket();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [allRes, topRoadsRes, peakRes, alertsRes] = await Promise.all([
        axios.get('/api/traffic/all'),
        axios.get('/api/traffic/top-roads'),
        axios.get('/api/traffic/peak-hours'),
        axios.get('/api/traffic/alerts')
      ]);
      setTrafficData(allRes.data.slice(-20)); // last 20 elements
      setTopRoads(topRoadsRes.data);
      setPeakHour(peakRes.data);
      setAlerts(alertsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws-traffic');
    const client = Stomp.over(socket);
    client.debug = () => {}; // disable debug logs

    client.connect({}, () => {
      client.subscribe('/topic/traffic', (message) => {
        const newData = JSON.parse(message.body);
        setTrafficData(prev => [...prev.slice(-19), newData]);
        // Re-fetch aggregated data on updates
        fetchInitialData();
      });
    });
  };

  const toggleSimulation = async () => {
    try {
      if (isSimulating) {
        await axios.post('/api/sim/stop');
      } else {
        await axios.post('/api/sim/start');
      }
      setIsSimulating(!isSimulating);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto basis-full flex flex-col space-y-8">
        
        <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                TraffixAI
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Premium Traffic Analytics Dashboard</p>
            </div>
          </div>
          
          <button 
            onClick={toggleSimulation}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
              isSimulating 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 hover:shadow-rose-500/20' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isSimulating ? 'Stop Simulation' : 'Start Simulation'}</span>
          </button>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Peak Hour Card */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Peak Hour</p>
              <h3 className="text-3xl font-bold text-white">
                {peakHour?.peakHour !== undefined ? `${peakHour.peakHour}:00` : '--:--'}
              </h3>
              <p className="text-indigo-400 text-sm mt-2 font-medium">Highest Congestion Window</p>
            </div>
            <div className="bg-indigo-500/10 p-4 rounded-full">
              <Activity className="w-10 h-10 text-indigo-400" />
            </div>
          </div>

          {/* Active Vehicles Card */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Live Vehicles</p>
              <h3 className="text-3xl font-bold text-white">
                {trafficData.length > 0 ? trafficData[trafficData.length - 1].vehicleCount : '0'}
              </h3>
              <p className="text-emerald-400 text-sm mt-2 font-medium">Currently on tracked roads</p>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-full">
              <Car className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          {/* Total Alerts Card */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Active Alerts</p>
              <h3 className="text-3xl font-bold text-white">{alerts.length}</h3>
              <p className="text-rose-400 text-sm mt-2 font-medium">Issues requiring attention</p>
            </div>
            <div className="bg-rose-500/10 p-4 rounded-full">
              <AlertCircle className="w-10 h-10 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Chart */}
          <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Live Traffic Flow</span>
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    stroke="#475569" 
                    tick={{fill: '#64748b'}}
                  />
                  <YAxis stroke="#475569" tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem' }}
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                  />
                  <Area type="monotone" dataKey="vehicleCount" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVehicles)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Roads */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>Top Congested Roads</span>
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {topRoads.map((road, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-bold">#{idx + 1}</span>
                    <span className="font-semibold text-slate-200">{road.roadId}</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-md font-medium text-sm">
                    {road.totalVehicleCount} Vehicles
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>System Alerts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.slice(-6).reverse().map((alert, idx) => (
              <div key={idx} className="bg-rose-500/5 p-5 rounded-xl border border-rose-500/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-200">{alert.roadId}</span>
                  <span className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-rose-400 text-sm font-medium">{alert.alertReason}</p>
                <div className="mt-4 flex space-x-4 text-xs font-semibold text-slate-400">
                  <span className="bg-slate-950/50 px-2 py-1 rounded">Count: {alert.vehicleCount}</span>
                  <span className="bg-slate-950/50 px-2 py-1 rounded">Speed: {alert.avgSpeed.toFixed(1)} km/h</span>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-500">
                No active traffic alerts. Excellent flow currently!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
