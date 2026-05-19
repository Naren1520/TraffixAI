import React, { createContext, useState } from 'react';

export const CityContext = createContext();

// City coordinates for bounding box calculations
const CITY_COORDINATES = {
  'Bangalore': { lat: 12.9716, lng: 77.5946, radius: 0.08 },
  'Mangalore': { lat: 12.8711, lng: 74.8427, radius: 0.08 },
  'Delhi': { lat: 28.7041, lng: 77.1025, radius: 0.12 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, radius: 0.10 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, radius: 0.08 },
  'Pune': { lat: 18.5204, lng: 73.8567, radius: 0.08 },
  'Chennai': { lat: 13.0827, lng: 80.2707, radius: 0.08 },
  'Kolkata': { lat: 22.5726, lng: 88.3639, radius: 0.08 },
};

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [coordinates, setCoordinates] = useState(CITY_COORDINATES['Bangalore']);

  const updateCity = (cityName, customCoords = null) => {
    setSelectedCity(cityName);
    if (customCoords) {
      setCoordinates(customCoords);
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
