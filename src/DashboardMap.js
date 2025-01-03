import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React from 'react';

const DashboardMap = ({ entries }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDVUgEg18n1Pc6coUWDrGPJRh1vaS889Js', // Replace with your Google Maps API Key
  });

  // Map container styling
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
  };

  // Default map center (modify as needed)
  const defaultCenter = {
    lat: 0, // Latitude
    lng: 0, // Longitude
  };

  if (!isLoaded) return <div>Loading Map...</div>; // Show a loader until the map is ready

  return (
    <GoogleMap
      center={defaultCenter} // Set initial center of the map
      zoom={2} // Adjust the zoom level for a global view
      mapContainerStyle={mapContainerStyle} // Apply styling
    >
      {/* Add markers for entries with location */}
      {entries.map((entry, index) =>
        entry.location ? (
          <Marker
            key={index}
            position={entry.location} // Provide location coordinates
            title={entry.title} // Title for the marker
          />
        ) : null
      )}
    </GoogleMap>
  );
};

export default DashboardMap;
