import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'donor' | 'recipient';
  bloodType?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; bloodType: string }) => Promise<void>;
  setRole: (role: 'donor' | 'recipient') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      // Mock successful login
      set({
        user: {
          id: '1',
          name: 'John Doe',
          email: email
        },
        isAuthenticated: true
      });
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  register: async (userData) => {
    try {
      // TODO: Implement actual API call
      // Mock successful registration
      console.log('Registration data:', userData);
      // Don't set user or isAuthenticated here - user needs to login after registration
    } catch (error) {
      throw new Error('Registration failed');
    }
  },
  setRole: (role) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null
    }));
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false
    });
  }
}));