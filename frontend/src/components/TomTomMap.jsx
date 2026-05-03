import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const TomTomMap = () => {
    const mapElement = useRef();

    useEffect(() => {
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY || 'your_tomtom_api_key';

        const map = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: [74.8427, 12.8711], // Mangaluru, MG Road
            zoom: 14,
        });

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

        // Click event to show popup with coordinates and raw data idea
        map.on('click', (e) => {
            new tt.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div style="color: #333; padding: 5px;">
                    <b style="font-size: 14px;">Live Location Check</b><br/>
                    Lat: ${e.lngLat.lat.toFixed(4)}<br/>
                    Lng: ${e.lngLat.lng.toFixed(4)}
                </div>
              `)
              .addTo(map);
        });

        return () => map.remove();
    }, []);

    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="text-rose-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Live Geographic Monitoring</span>
            </h3>
            <div ref={mapElement} style={{ height: '400px', width: '100%', borderRadius: '12px' }} />
        </div>
    );
};

export default TomTomMap;
