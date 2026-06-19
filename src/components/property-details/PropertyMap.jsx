// components/PropertyMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds to marker position
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);
  return null;
}

const PropertyMap = ({ address, city, propertyTitle }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address && !city) return;

    const query = `${address}, ${city}`;
    // Using Nominatim (OpenStreetMap) geocoding 
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    fetch(geocodeUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates([parseFloat(lat), parseFloat(lon)]);
        } else {
          setError('Location not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Geocoding error:', err);
        setError('Unable to fetch location');
        setLoading(false);
      });
  }, [address, city]);

  if (loading) {
    return (
      <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Loading map...
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="h-70 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Map unavailable
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-70">
      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>{propertyTitle || 'Property Location'}</Popup>
        </Marker>
        <MapUpdater position={coordinates} />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;