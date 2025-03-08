import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
  }>;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export const Map: React.FC<MapProps> = ({ center, markers = [] }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <p className="text-red-600">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={options}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
          animation={google.maps.Animation.DROP}
        />
      ))}
    </GoogleMap>
  );
};