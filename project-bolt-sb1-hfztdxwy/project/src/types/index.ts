export type UserRole = 'donor' | 'recipient';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  bloodType?: string;
  location?: Location;
  isAvailable?: boolean;
  lastDonation?: Date;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface DonationRequest {
  id: string;
  recipientId: string;
  bloodType: string;
  urgency: number;
  location: Location;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  donorId?: string;
  priorityScore?: number;
  notes?: string;
  createdAt: Date;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  type: 'ambulance' | 'hospital' | 'firstResponder';
  location: Location;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: Date;
}

export interface UserLocation {
  lat: number;
  lng: number;
  userType: 'donor' | 'recipient';
  userId: string;
  timestamp: string;
}