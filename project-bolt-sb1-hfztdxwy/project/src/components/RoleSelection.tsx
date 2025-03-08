import { Dispatch, SetStateAction } from 'react';

interface RoleSelectionProps {
  onRoleSelect: Dispatch<SetStateAction<'donor' | 'recipient' | null>>;
}

export const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
        <div className="space-y-4">
          <button
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => onRoleSelect('donor')}
          >
            <h3 className="font-semibold text-lg">Donor</h3>
            <p className="text-gray-600">I want to donate blood and help others</p>
          </button>
          <button
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => onRoleSelect('recipient')}
          >
            <h3 className="font-semibold text-lg">Recipient</h3>
            <p className="text-gray-600">I need blood donation</p>
          </button>
        </div>
      </div>
    </div>
  );
};