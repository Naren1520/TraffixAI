import React, { useEffect, useRef, forwardRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

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

    // Create start marker (green)
    const startPopup = new tt.Popup().setHTML(`
      <div style="color: #333; padding: 8px; font-weight: bold; background: #69f0ae; border-radius: 4px;">
        Start Point
      </div>
    `);

    startMarker.current = new tt.Marker({
      color: '#69f0ae',
      size: 'large'
    })
      .setLngLat(startCoords)
      .setPopup(startPopup)
      .addTo(mapInstance.current);

    // Create end marker (red)
    const endPopup = new tt.Popup().setHTML(`
      <div style="color: #fff; padding: 8px; font-weight: bold; background: #ff6b6b; border-radius: 4px;">
        End Point
      </div>
    `);

    endMarker.current = new tt.Marker({
      color: '#ff6b6b',
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
    <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-6 backdrop-blur-xl h-full">
      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#009688]">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Route Map</span>
      </h3>

      <div
        ref={mapElement}
        className="w-full h-96 rounded-xl overflow-hidden border border-[#333333]/50 shadow-2xl"
        style={{ touchAction: 'manipulation' }}
      />

      {/* Map Info */}
      <div className="mt-4 p-3 bg-[#121212]/50 rounded-lg border border-[#2a2a2a] text-sm text-gray-400">
        <p>🚦 Showing live traffic flow and incidents</p>
        <p>📍 Green marker: Start | 📍 Red marker: Destination</p>
      </div>
    </div>
  );
});

RouteMap.displayName = 'RouteMap';

export default RouteMap;
