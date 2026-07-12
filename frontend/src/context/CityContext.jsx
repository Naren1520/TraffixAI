import React, { createContext, useState } from 'react';

export const CityContext = createContext();

const CITY_COORDINATES = {
  'Bangalore':  { lat: 12.9716, lng: 77.5946, radius: 0.08 },
  'Mangalore':  { lat: 12.8711, lng: 74.8427, radius: 0.08 },
  'Delhi':      { lat: 28.7041, lng: 77.1025, radius: 0.12 },
  'Mumbai':     { lat: 19.0760, lng: 72.8777, radius: 0.10 },
  'Hyderabad':  { lat: 17.3850, lng: 78.4867, radius: 0.08 },
  'Pune':       { lat: 18.5204, lng: 73.8567, radius: 0.08 },
  'Chennai':    { lat: 13.0827, lng: 80.2707, radius: 0.08 },
  'Kolkata':    { lat: 22.5726, lng: 88.3639, radius: 0.08 },
};

const DEFAULT_CITY   = 'Mangalore';
const DEFAULT_COORDS = CITY_COORDINATES['Mangalore'];

/**
 * Reads the stored user from localStorage so CityContext can boot
 * with the user's saved default location without needing AuthContext.
 */
function getInitialCity() {
  try {
    const stored = localStorage.getItem('traffixai_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.defaultCity) return { city: u.defaultCity, lat: u.defaultLat, lng: u.defaultLng };
    }
  } catch {}
  return null;
}

export const CityProvider = ({ children }) => {
  const initial = getInitialCity();

  const [selectedCity, setSelectedCity] = useState(
    initial?.city || DEFAULT_CITY
  );
  const [coordinates, setCoordinates] = useState(
    initial
      ? { lat: initial.lat, lng: initial.lng, radius: 0.08 }
      : DEFAULT_COORDS
  );

  const updateCity = (cityName, customCoords = null) => {
    setSelectedCity(cityName);
    if (customCoords) {
      setCoordinates({ ...customCoords, radius: customCoords.radius || 0.08 });
    } else if (CITY_COORDINATES[cityName]) {
      setCoordinates(CITY_COORDINATES[cityName]);
    }
  };

  return (
    <CityContext.Provider value={{ selectedCity, coordinates, updateCity, CITY_COORDINATES }}>
      {children}
    </CityContext.Provider>
  );
};
