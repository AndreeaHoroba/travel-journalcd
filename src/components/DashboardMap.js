import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const DashboardMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBI2UI0EdutE9k7o9deNDjndcvnsvwXf0E', // 🔑 cheia ta validă
    libraries: ['places'],
  });

  const [pins, setPins] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    marginBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  };

  const defaultCenter = { lat: 20, lng: 0 };

  // 🔹 1. Încarcă pinurile existente
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pins');
        const data = await response.json();
        setPins(data);
      } catch (error) {
        console.error('❌ Eroare la încărcarea pinurilor:', error);
      }
    };

    fetchPins();
  }, []);

  // 🔹 2. Click pe hartă → adaugă pin
  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPin = {
      name: 'New Pin',
      lat,
      lng,
      visited: false,
      color: 'red',
    };

    setSelectedLocation({ lat, lng });

    try {
      const response = await fetch('http://localhost:8080/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPin),
      });

      if (!response.ok) throw new Error('Eroare la salvarea pinului');

      const savedPin = await response.json();
      setPins((prevPins) => [...prevPins, savedPin]);
    } catch (error) {
      console.error('❌ Eroare la adăugarea pinului:', error);
    }
  };

  // 🔹 3. Click dreapta pe pin → șterge pin
  const handleRightClick = async (pinId) => {
    if (!window.confirm('Ștergi acest pin?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/pins/${pinId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Eroare la ștergerea pinului');

      setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
    } catch (error) {
      console.error('❌ Eroare la ștergerea pinului:', error);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={defaultCenter}
      zoom={2}
      mapContainerStyle={mapContainerStyle}
      onClick={handleMapClick}
    >
      {/* Marker pentru pinul selectat */}
      {selectedLocation && (
        <Marker
          position={selectedLocation}
          label="📍"
          title="Locație selectată"
        />
      )}

      {/* Markerele salvate */}
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          title={pin.name}
          onRightClick={() => handleRightClick(pin.id)} // 👈 click dreapta = delete
        />
      ))}
    </GoogleMap>
  );
};

export default DashboardMap;
