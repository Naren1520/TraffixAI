import React, { useState, useEffect, useContext } from 'react';
import TomTomMap from '../../components/map/TomTomMap';
import { AlertTriangle, Clock, Map as MapIcon, Activity, ShieldAlert, Navigation } from 'lucide-react';
import { CityContext } from '../../context/CityContext';
import IncidentCenterSkeleton from './IncidentCenterSkeleton';

// ── Incident card — extracted to avoid repetition ──────────────────────────
const IncidentCard = ({ inc, severityClass }) => (
  <div className="bg-[#050505] border border-[#222] rounded-xl p-4 hover:border-[#444] transition w-full overflow-hidden">
    <div className="flex items-start justify-between mb-2 gap-2">
      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border font-semibold flex-shrink-0 ${severityClass(inc.type)}`}>
        {inc.type}
      </span>
      <span className="text-[10px] text-[#666] flex-shrink-0">{inc.timestamp}</span>
    </div>
    <p className="text-sm font-medium text-white mb-1">{inc.category}</p>
    <p className="text-xs text-[#888] mb-3 line-clamp-2 leading-relaxed break-words">{inc.description}</p>
    <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between gap-2">
      <div className="flex items-center space-x-1.5 text-[#AAA] min-w-0 overflow-hidden">
        <Navigation className="w-3 h-3 flex-shrink-0" />
        <span className="text-[11px] truncate">{inc.location}</span>
      </div>
      <div className="flex items-center space-x-1 text-orange-500 flex-shrink-0">
        <Clock className="w-3 h-3" />
        <span className="text-[11px] font-medium whitespace-nowrap">+{inc.delay}</span>
      </div>
    </div>
  </div>
);

// ── Map overlay badges ─────────────────────────────────────────────────────
const MapOverlays = () => (
  <>
    <div className="absolute top-3 left-3 bg-[#050505]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#222] z-10">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-medium tracking-widest uppercase text-white">Live Incident Map</span>
      </div>
    </div>
    <div className="absolute top-3 right-3 bg-[#050505]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-[#222] space-y-1.5 z-10">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-rose-500 rounded-full" />
        <span className="text-[10px] text-[#888]">Critical</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        <span className="text-[10px] text-[#888]">Major</span>
      </div>
    </div>
  </>
);

// ── Main component ─────────────────────────────────────────────────────────
function IncidentCenter() {
  const { selectedCity, coordinates } = useContext(CityContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [incidents, setIncidents]       = useState([]);
  const [loading, setLoading]           = useState(true);

  const filters = ['All', 'Accidents', 'Construction', 'Closures', 'Congestion'];

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
        const radius = coordinates?.radius || 0.08;
        const lat    = coordinates?.lat    || 12.9716;
        const lng    = coordinates?.lng    || 77.5946;
        const bbox   = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;
        const url    = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}&bbox=${bbox}&language=en-GB&fields={incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay}}}`;

        const res  = await fetch(url);
        const data = await res.json();

        if (data?.incidents) {
          setIncidents(data.incidents.map(inc => {
            const p = inc.properties;
            let type = 'Minor';
            if (p.magnitudeOfDelay === 4) type = 'Critical';
            else if (p.magnitudeOfDelay === 3) type = 'Major';
            else if (p.magnitudeOfDelay === 2) type = 'Moderate';

            let category = 'Congestion';
            if (p.iconCategory === 1) category = 'Accident';
            if (p.iconCategory === 9) category = 'Construction';
            if (p.iconCategory === 8 || p.iconCategory === 7) category = 'Closure';

            const delayMins = p.delay ? Math.round(p.delay / 60) : 0;
            const diffMins  = Math.round((Date.now() - new Date(p.startTime)) / 60000);
            const timeStr   = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`;

            return {
              id:          p.id,
              type, category,
              location:    p.from || p.to || 'Unknown',
              delay:       delayMins > 0 ? `${delayMins} mins` : 'N/A',
              timestamp:   timeStr,
              description: p.events?.map(e => e.description).join(' | ') || 'Traffic event reported',
            };
          }));
        }
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const id = setInterval(fetchIncidents, 60000);
    return () => clearInterval(id);
  }, [selectedCity, coordinates]);

  const filtered = incidents.filter(inc => {
    if (activeFilter === 'All')          return true;
    if (activeFilter === 'Accidents')    return inc.category === 'Accident';
    if (activeFilter === 'Construction') return inc.category === 'Construction';
    if (activeFilter === 'Closures')     return inc.category === 'Closure';
    if (activeFilter === 'Congestion')   return inc.category === 'Congestion';
    return true;
  });

  const severityClass = (type) => {
    if (type === 'Critical') return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    if (type === 'Major')    return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (type === 'Moderate') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-[#888] bg-[#111] border-[#222]';
  };

  const totalDelay = incidents.reduce((a, i) => a + (parseInt(i.delay) || 0), 0);
  const critical   = incidents.filter(i => i.type === 'Critical' || i.type === 'Major').length;
  const mapCenter  = [coordinates?.lng || 77.5946, coordinates?.lat || 12.9716];

  if (loading) return <IncidentCenterSkeleton />;

  return (
    <div className="flex flex-col space-y-5 pb-10 w-full">

      {/* Header */}
      <header className="bg-[#0A0A0A] p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#222]">
        <h2 className="text-lg sm:text-2xl font-light text-white">
          Incident Center {selectedCity && <span className="text-[#888]"> &bull; {selectedCity}</span>}
        </h2>
        <p className="text-[10px] uppercase tracking-wide text-[#666] mt-1.5">
          Real-Time Incident Monitoring & Emergency Intelligence
        </p>
      </header>

      {/* Stat cards — 1 col mobile, 2 col sm, 4 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: incidents.length, sub: 'Currently tracked',  icon: <Activity className="w-5 h-5 text-white" />,          ib: 'bg-[#111] border-[#222]' },
          { label: 'Critical Alerts',  value: critical,         sub: 'Requires attention', icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,   ib: 'bg-[#1A0505] border-[#3A0A0A]', vc: 'text-rose-500' },
          { label: 'Total Delay',      value: `${totalDelay}m`, sub: 'Sum of all zones',   icon: <Clock className="w-5 h-5 text-white" />,               ib: 'bg-[#111] border-[#222]' },
          { label: 'Live Map',         value: 'TomTom',         sub: 'Real-time sync',     icon: <MapIcon className="w-5 h-5 text-[#10b981]" />,         ib: 'bg-[#021008] border-[#062414]', vc: 'text-[#10b981]' },
        ].map(({ label, value, sub, icon, ib, vc = 'text-white' }, i) => (
          <div key={i} className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#222] flex items-center justify-between hover:border-[#444] transition">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-[#888] font-bold uppercase tracking-[0.12em] mb-2 leading-tight">{label}</p>
              <h3 className={`text-2xl font-light ${vc}`}>{value}</h3>
              <p className="text-[#666] text-xs mt-2">{sub}</p>
            </div>
            <div className={`p-3 rounded-full border flex-shrink-0 ml-3 ${ib}`}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition whitespace-nowrap flex-shrink-0 ${
              activeFilter === f ? 'bg-white text-black' : 'bg-[#111] text-[#888] border border-[#222] hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* MOBILE — map then feed stacked */}
      <div className="lg:hidden space-y-5">
        <div className="relative rounded-2xl overflow-hidden w-full" style={{ height: '280px' }}>
          <TomTomMap center={mapCenter} hideHeader />
          <MapOverlays />
        </div>
        <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-4 flex flex-col" style={{ height: '360px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Incident Feed</h3>
            <Activity className="w-4 h-4 text-[#888]" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filtered.length === 0
              ? <p className="text-center py-8 text-[#666] text-sm">No incidents for this filter.</p>
              : filtered.map(inc => <IncidentCard key={inc.id} inc={inc} severityClass={severityClass} />)
            }
          </div>
        </div>
      </div>

      {/* DESKTOP — side by side */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[500px]">
          <TomTomMap center={mapCenter} hideHeader />
          <MapOverlays />
        </div>
        <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-5 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Incident Feed</h3>
            <Activity className="w-4 h-4 text-[#888]" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filtered.length === 0
              ? <p className="text-center py-8 text-[#666] text-sm">No incidents for this filter.</p>
              : filtered.map(inc => <IncidentCard key={inc.id} inc={inc} severityClass={severityClass} />)
            }
          </div>
        </div>
      </div>

      {/* AI insights */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-5 lg:p-8">
        <div className="flex items-center space-x-3 mb-5">
          <ShieldAlert className="w-5 h-5 text-[#00E676]" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">AI Real-Time Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Predicted Congestion', body: 'Traffic at Silk Board junction is expected to bottleneck further over the next 45 minutes. Approaching routes will see cascading delays.' },
            { title: 'Alternate Routes',     body: 'Divert via HSR Layout inner routes. Avoid ORR Marathahalli and reroute through Old Airport Road.' },
            { title: 'Impact Assessment',    body: 'City-wide travel times elevated 18% vs daily median. Commercial corridors in the south quadrant are most impacted.' },
          ].map(({ title, body }, i) => (
            <div key={i} className="bg-[#050505] p-4 rounded-xl border border-[#222] overflow-hidden">
              <p className="text-[10px] text-[#888] uppercase tracking-widest mb-2 font-semibold">{title}</p>
              <p className="text-xs leading-relaxed text-[#AAA] break-words">{body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default IncidentCenter;
