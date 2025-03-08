import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { socket } from '../services/socket';
import { UserLocation } from '../types';

const containerStyle = {
  width: '100%',
  height: '500px'
};

interface LocationMapProps {
  userType: 'donor' | 'recipient';
  userId: string;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

export const LocationMap = ({ userType, userId, onLocationUpdate }: LocationMapProps) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [userLocations, setUserLocations] = useState<Record<string, UserLocation>>({});
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    // Get initial user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          userType,
          userId,
          timestamp: new Date().toISOString()
        };
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        setUserLocations(prev => ({ ...prev, [userId]: newLocation }));
        socket.emit(`${userType}:location`, newLocation);
        onLocationUpdate({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    // Watch for location changes
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          userType,
          userId,
          timestamp: new Date().toISOString()
        };
        setUserLocations(prev => ({ ...prev, [userId]: newLocation }));
        socket.emit(`${userType}:location`, newLocation);
        onLocationUpdate({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        console.error('Error watching location:', error);
      }
    );

    // Listen for location updates from other users
    socket.on('donor:locationUpdate', (location: UserLocation) => {
      setUserLocations(prev => ({ ...prev, [location.userId]: location }));
    });

    socket.on('recipient:locationUpdate', (location: UserLocation) => {
      setUserLocations(prev => ({ ...prev, [location.userId]: location }));
    });

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      socket.off('donor:locationUpdate');
      socket.off('recipient:locationUpdate');
    };
  }, [userId, userType, onLocationUpdate]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {Object.values(userLocations).map((location) => (
          <Marker
            key={location.userId}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url: location.userType === 'donor' ? '/donor-marker.svg' : '/recipient-marker.svg',
              scaledSize: new google.maps.Size(30, 30)
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}; 