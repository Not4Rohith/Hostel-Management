import { create } from 'zustand';

type UserRole = 'student' | 'admin' | null;

interface AuthState {
  user: { name: string; role: UserRole } | null;
  login: (role: 'student' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Mock login action - in real app, this would verify credentials
  login: (role) => set({ 
    user: { 
      name: role === 'student' ? 'Rohith' : 'Hostel Warden', 
      role 
    } 
  }),
  logout: () => set({ user: null }),
}));