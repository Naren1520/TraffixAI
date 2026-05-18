import React, { useEffect, useRef, forwardRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { MapPin } from 'lucide-react';

const RouteMap = forwardRef(({ startCoords, endCoords, route }, ref) => {
  const mapElement = useRef();
  const mapInstance = useRef(null);
  const startMarker = useRef(null);
  const endMarker = useRef(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

    if (!apiKey || !mapElement.current) {
      console.error("TomTom API key or map element is missing!");
      return;
    }

    const map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [74.8427, 12.8711],
      zoom: 12,
    });

    mapInstance.current = map;

    map.on('load', () => {
      // Traffic Flow Layer
      map.addTier(new tt.TrafficFlowTilesTier({
        key: apiKey,
        style: 'tomtom://vector/1/relative'
      }));

      // Traffic Incidents Layer
      map.addTier(new tt.TrafficIncidentTier({
        key: apiKey,
        incidentDetails: {
          style: 's0'
        }
      }));
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Update markers when coordinates change
  useEffect(() => {
    if (!mapInstance.current || !startCoords || !endCoords) return;

    // Remove existing markers
    if (startMarker.current) startMarker.current.remove();
    if (endMarker.current) endMarker.current.remove();

    // Create start marker (white)
    const startPopup = new tt.Popup().setHTML(
      <div style="color: #000; padding: 6px 10px; font-weight: bold; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; background: #FFF; border-radius: 0;">
        START
      </div>
    );

    startMarker.current = new tt.Marker({
      color: '#FFFFFF',
      size: 'large'
    })
      .setLngLat(startCoords)
      .setPopup(startPopup)
      .addTo(mapInstance.current);

    // Create end marker (emerald)
    const endPopup = new tt.Popup().setHTML(
      <div style="color: #000; padding: 6px 10px; font-weight: bold; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; background: #10B981; border-radius: 0;">
        END
      </div>
    );

    endMarker.current = new tt.Marker({
      color: '#10B981',
      size: 'large'
    })
      .setLngLat(endCoords)
      .setPopup(endPopup)
      .addTo(mapInstance.current);

    // Center map to fit both markers
    const bounds = new tt.LngLatBounds()
      .extend(startCoords)
      .extend(endCoords);

    mapInstance.current.fitBounds(bounds, {
      padding: 100
    });
  }, [startCoords, endCoords]);

  return (
    <div className="w-full h-full flex flex-col bg-[#050505]">
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#0A0A0A]">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#888]" />
          <span>Real-time Map Matrix</span>
        </h3>
        <span className="flex items-center text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            LIVE
        </span>
      </div>

      {/* Map Container */}
      <div
        ref={mapElement}
        className="w-full flex-grow relative"
        style={{ touchAction: 'manipulation', minHeight: '400px' }}
      >
        <div className="absolute inset-0 border-[4px] border-[#0A0A0A] pointer-events-none z-10 mix-blend-overlay"></div>
      </div>
    </div>
  );
});

RouteMap.displayName = 'RouteMap';

export default RouteMap;
