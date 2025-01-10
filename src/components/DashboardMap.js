import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';

const DashboardMap = ({ entries }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: '', 
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
  };

  const defaultCenter = {
    lat: 0, 
    lng: 0, 
  };

  if (!isLoaded) return <div>Loading Map...</div>; 

  return (
    <GoogleMap
      center={defaultCenter} 
      zoom={2}
      mapContainerStyle={mapContainerStyle} 
    >
      {entries.map((entry, index) =>
        entry.location ? (
          <Marker
            key={index}
            position={entry.location} 
            title={entry.title} 
          />
        ) : null
      )}
    </GoogleMap>
  );
};

export default DashboardMap;
