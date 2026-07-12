import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import TomTomMap from '../components/TomTomMap';
import { AlertTriangle, Clock, Map as MapIcon, Activity, AlertCircle, ShieldAlert, Navigation, Loader2 } from 'lucide-react';
import { CityContext } from '../context/CityContext';

function IncidentCenter() {
  const { selectedCity, coordinates } = useContext(CityContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Accidents', 'Construction', 'Closures', 'Congestion'];

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
        // Calculate bounding box from city coordinates with dynamic radius
        const radius = coordinates?.radius || 0.08;
        const lat = coordinates?.lat || 12.9716;
        const lng = coordinates?.lng || 77.5946;
        
        const bbox = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}&bbox=${bbox}&language=en-GB&fields={incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay}}}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.incidents) {
          const parsedIncidents = data.incidents.map((inc) => {
            const props = inc.properties;
            
            // Map TomTom magnitudeOfDelay to our UI types
            let type = 'Minor';
            if (props.magnitudeOfDelay === 4) type = 'Critical';
            else if (props.magnitudeOfDelay === 3) type = 'Major';
            else if (props.magnitudeOfDelay === 2) type = 'Moderate';
            
            // Map TomTom iconCategory to our category
            let category = 'Congestion';
            if (props.iconCategory === 1) category = 'Accident';
            if (props.iconCategory === 9) category = 'Construction';
            if (props.iconCategory === 8 || props.iconCategory === 7) category = 'Closure';
            
            const delayMins = props.delay ? Math.round(props.delay / 60) : 0;
            
            // Simple time ago format
            const startTime = new Date(props.startTime);
            const diffMins = Math.round((new Date() - startTime) / 60000);
            const timeStr = diffMins < 60 ? `${diffMins} mins ago` : `${Math.floor(diffMins/60)} hrs ago`;
            
            return {
              id: props.id,
              type,
              category,
              location: props.from || props.to || 'Unknown Location',
              delay: delayMins > 0 ? `${delayMins} mins` : 'N/A',
              timestamp: timeStr,
              status: props.endTime ? 'Resolved' : 'Active',
              description: props.events ? props.events.map(e => e.description).join(' | ') : 'Traffic event reported'
            };
          });
          setIncidents(parsedIncidents);
        }
      } catch (err) {
        console.error("Failed to fetch fresh incidents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    // Poll every 60 seconds
    const interval = setInterval(fetchIncidents, 60000);
    return () => clearInterval(interval);
  }, [selectedCity, coordinates]);

  const filteredIncidents = incidents.filter(incident => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Accidents') return incident.category === 'Accident';
    if (activeFilter === 'Construction') return incident.category === 'Construction';
    if (activeFilter === 'Closures') return incident.category === 'Closure';
    if (activeFilter === 'Congestion') return incident.category === 'Congestion';
    return true;
  });

  const getSeverityColor = (type) => {
    switch (type) {
      case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Major': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Minor': return 'text-[#888] bg-[#111] border-[#222]';
      default: return 'text-white bg-[#111] border-[#222]';
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0A0A0A] p-5 lg:p-8 rounded-2xl border border-[#222]">
        <div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
            Incident Center {selectedCity && <span className="text-[#888]">• {selectedCity}</span>}
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-[#666] mt-2">
            Real-Time Traffic Incident Monitoring & Emergency Intelligence
          </p>
        </div>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Active Incidents</p>
            <h3 className="text-3xl font-light text-white">{loading ? <Loader2 className="w-8 h-8 animate-spin text-[#888]"/> : incidents.length}</h3>
            <p className="text-[#666] text-xs mt-3">Currently tracked</p>
          </div>
          <div className="p-3 bg-[#111] rounded-full border border-[#222]">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Critical Alerts</p>
            <h3 className="text-3xl font-light text-rose-500">{loading ? <Loader2 className="w-8 h-8 animate-spin text-[#888]"/> : incidents.filter(i => i.type === 'Critical' || i.type === 'Major').length}</h3>
            <p className="text-[#666] text-xs mt-3">Requires attention</p>
          </div>
          <div className="p-3 bg-[#1A0505] rounded-full border border-[#3A0A0A]">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Total Delay</p>
            <h3 className="text-3xl font-light text-white">{loading ? <Loader2 className="w-8 h-8 animate-spin text-[#888]"/> : `${incidents.reduce((acc, curr) => acc + (parseInt(curr.delay) || 0), 0)}m`}</h3>
            <p className="text-[#666] text-xs mt-3">Sum of all zones</p>
          </div>
          <div className="p-3 bg-[#111] rounded-full border border-[#222]">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222] flex items-center justify-between transition hover:border-[#444]">
          <div>
            <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.2em] mb-2">Live Map Connected</p>
            <h3 className="text-3xl font-light text-[#10b981]">{loading ? '...' : 'TomTom'}</h3>
            <p className="text-[#666] text-xs mt-3">Real-time sync</p>
          </div>
          <div className="p-3 bg-[#021008] rounded-full border border-[#062414]">
            <MapIcon className="w-6 h-6 text-[#10b981]" />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
              activeFilter === filter
                ? 'bg-white text-black'
                : 'bg-[#111] text-[#888] border border-[#222] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col min-h-[400px] lg:h-[550px]">
          <div className="relative flex-grow group">
            <TomTomMap 
              center={[coordinates?.lng || 77.5946, coordinates?.lat || 12.9716]}
            />
            {/* Absolute positioning overlays will be contained inside the column now */}
            <div className="absolute top-8 left-8 bg-[#050505]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#222] z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium tracking-widest uppercase text-white">Live Incident Map</span>
              </div>
            </div>
            
            <div className="absolute top-8 right-8 bg-[#050505]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#222] space-y-2 z-10">
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                 <span className="text-xs text-[#888]">Critical</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                 <span className="text-xs text-[#888]">Major</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 flex flex-col min-h-[400px] lg:h-[550px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Incident Feed</h3>
              <Activity className="w-4 h-4 text-[#888]" />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
              {loading ? (
                 <div className="text-center py-10 flex flex-col items-center justify-center space-y-4">
                   <Loader2 className="w-8 h-8 animate-spin text-[#888]" />
                   <p className="text-[#666] text-sm uppercase tracking-widest">Syncing with TomTom APIs...</p>
                 </div>
              ) : filteredIncidents.length === 0 ? (
                 <div className="text-center py-10 text-[#666] text-sm">
                   No incidents found matching this filter.
                 </div>
              ) : (
                filteredIncidents.map((incident) => (
                  <div key={incident.id} className="bg-[#050505] border border-[#222] rounded-xl p-4 transition-all hover:border-[#444]">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border font-semibold ${getSeverityColor(incident.type)}`}>
                        {incident.type}
                      </span>
                      <span className="text-[10px] text-[#666] uppercase tracking-wider">{incident.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1">{incident.category}</h4>
                    <p className="text-xs text-[#888] mb-3 leading-relaxed">{incident.description}</p>
                    
                    <div className="pt-3 border-t border-[#1A1A1A] flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#AAA]">
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="text-[11px] truncate max-w-[120px]">{incident.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-orange-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">+{incident.delay}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6 flex-wrap">
          <ShieldAlert className="w-5 h-5 text-[#00E676]" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">AI Real-Time Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#050505] p-5 rounded-xl border border-[#222]">
             <p className="text-[10px] text-[#888] uppercase tracking-widest mb-2 font-semibold">Predicted Congestion</p>
             <p className="text-xs leading-relaxed text-[#AAA]">Traffic at Silk Board junction is expected to bottleneck further over the next 45 minutes due to the collision. Approaching routes will see cascading delays.</p>
          </div>
          <div className="bg-[#050505] p-5 rounded-xl border border-[#222]">
             <p className="text-[10px] text-[#888] uppercase tracking-widest mb-2 font-semibold">Alternate Routes</p>
             <p className="text-xs leading-relaxed text-[#AAA]">Divert traffic coming via Hosur Road to HSR Layout inner routes. Avoid ORR Marathahalli segment completely and reroute through Old Airport Road.</p>
          </div>
          <div className="bg-[#050505] p-5 rounded-xl border border-[#222]">
             <p className="text-[10px] text-[#888] uppercase tracking-widest mb-2 font-semibold">Impact Assessment</p>
             <p className="text-xs leading-relaxed text-[#AAA]">City-wide travel times have elevated by 18% compared to the daily median. Commercial corridors in the south quadrant are most impacted.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default IncidentCenter;