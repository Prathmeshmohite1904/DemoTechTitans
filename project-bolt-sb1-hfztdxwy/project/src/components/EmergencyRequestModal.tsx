import { useState, FormEvent } from 'react';
import { socket } from '../services/socket';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: { lat: number; lng: number };
}

export const EmergencyRequestModal = ({ isOpen, onClose, location }: EmergencyRequestModalProps) => {
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: 'normal',
    notes: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('emergency:request', {
      ...formData,
      location,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Emergency Blood Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
              Blood Type Required
            </label>
            <select
              id="bloodType"
              value={formData.bloodType}
              onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
              Urgency Level
            </label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 