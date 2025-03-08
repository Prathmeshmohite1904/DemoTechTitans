import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { MapPin, Power } from 'lucide-react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';
import { User, Location } from '../types';

export const DonorDashboard = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to socket when component mounts
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isSharing) {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setError(null);

          // Emit location update through socket
          socket.emit('donor:location', {
            donorId: 'current-user-id', // Replace with actual user ID
            location: newLocation,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location');
          setIsSharing(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.emit('donor:stopSharing', { donorId: 'current-user-id' });
      };
    }
  }, [isSharing]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Location Sharing</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-red-600 mr-2" />
                <span className="text-gray-700">
                  {isSharing ? 'Currently sharing location' : 'Location sharing disabled'}
                </span>
              </div>
              <button
                onClick={() => setIsSharing(!isSharing)}
                className={`px-4 py-2 rounded-md ${
                  isSharing
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white transition duration-200`}
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
            <div className="h-96">
              {location && (
                <Map
                  center={location}
                  markers={[{ position: location, title: 'Your Location' }]}
                />
              )}
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Donation History</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold">Last Donation: March 1, 2024</p>
                  <p className="text-gray-600">City Hospital</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <p className="font-semibold">Next Eligible Date: June 1, 2024</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Current Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Blood Type: A+</p>
                  <p className="text-gray-600">Status: Available to donate</p>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-full">
                  <span className="text-green-800">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};