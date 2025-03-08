import { useState } from 'react';
import { LocationMap } from './components/LocationMap';
import { RoleSelection } from './components/RoleSelection';
import { LoginForm } from './components/LoginForm';
import { EmergencyRequestModal } from './components/EmergencyRequestModal';

export default function App() {
  const [user, setUser] = useState<{ id: string; role: 'donor' | 'recipient' } | null>(null);
  const [selectedRole, setSelectedRole] = useState<'donor' | 'recipient' | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });

  const handleLogin = (userId: string) => {
    if (selectedRole) {
      setUser({ id: userId, role: selectedRole });
    }
  };

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
  };

  if (!selectedRole) {
    return <RoleSelection onRoleSelect={setSelectedRole} />;
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLogin} userRole={selectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">
            Blood Donation System - {user.role === 'donor' ? 'Donor' : 'Recipient'} View
          </h1>
          <div className="mb-4">
            <LocationMap 
              userType={user.role} 
              userId={user.id} 
              onLocationUpdate={handleLocationUpdate}
            />
          </div>
          {user.role === 'recipient' && (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setIsEmergencyModalOpen(true)}
            >
              Request Emergency Blood
            </button>
          )}
        </div>
      </div>
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        location={userLocation}
      />
    </div>
  );
}