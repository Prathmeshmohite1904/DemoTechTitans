import React, { useState } from 'react';
import { Map } from './Map';
import { Ambulance, Guitar as Hospital, Users, AlertTriangle } from 'lucide-react';

export const RecipientDashboard = () => {
  const [donors] = useState([
    { lat: 40.7128, lng: -74.006 }, // Example donor locations
    { lat: 40.7148, lng: -74.008 },
  ]);

  const handleEmergencyRequest = (type: 'ambulance' | 'hospital' | 'firstResponder') => {
    // TODO: Implement emergency request logic
    console.log(`Requesting ${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Emergency Services</h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleEmergencyRequest('ambulance')}
                  className="flex flex-col items-center p-4 bg-red-100 rounded-lg hover:bg-red-200 transition duration-200"
                >
                  <Ambulance className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm font-medium">Ambulance</span>
                </button>
                <button
                  onClick={() => handleEmergencyRequest('hospital')}
                  className="flex flex-col items-center p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <Hospital className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Hospital</span>
                </button>
                <button
                  onClick={() => handleEmergencyRequest('firstResponder')}
                  className="flex flex-col items-center p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition duration-200"
                >
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium">First Responder</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Active Donation Requests</h2>
              <div className="space-y-4">
                {/* Mock donation requests */}
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Emergency Request</p>
                      <p className="text-sm text-gray-600">Blood Type: O-</p>
                      <p className="text-sm text-gray-600">Distance: 2.3 miles</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Critical
                    </span>
                  </div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Urgent Request</p>
                      <p className="text-sm text-gray-600">Blood Type: A+</p>
                      <p className="text-sm text-gray-600">Distance: 3.1 miles</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Live Donor Map</h2>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700">{donors.length} Active Donors</span>
              </div>
            </div>
            <div className="h-[600px]">
              <Map
                center={{ lat: 40.7128, lng: -74.006 }}
                markers={donors.map((pos) => ({ position: pos }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};