import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const TomTomMap = ({ center }) => {
    const mapElement = useRef();
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

        if (!apiKey) {
            console.error("TomTom API key is missing! Please set VITE_TOMTOM_API_KEY in your .env file.");
            return;
        }

        const map = tt.map({
            key: apiKey,
            container: mapElement.current,
            center: center || [74.8427, 12.8711], // Mangaluru, MG Road
            zoom: 14,
        });

        setMapInstance(map);

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

    // Update map center when standard 'center' prop changes
    useEffect(() => {
        if (mapInstance && center) {
            mapInstance.setCenter(center);
            mapInstance.setZoom(13); // Zoom into the specific city
        }
    }, [center, mapInstance]);

    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl h-full min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Live Geographic Monitoring</span>
            </h3>
            <div ref={mapElement} className="w-full grow rounded-xl overflow-hidden shadow-2xl border border-slate-700/50" style={{ height: '400px' }} />
        </div>
    );
};

export default TomTomMap;
