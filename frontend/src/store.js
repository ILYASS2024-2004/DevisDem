import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
  logout: () => set({ isAuthenticated: false, user: null })
}));

export { useStore }; 