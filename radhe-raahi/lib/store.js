import { create } from "zustand";

export const useStore = create((set) => ({
  user: null, // Default logged out
  userRole: null, // 'renter', 'owner', 'admin'
  searchCriteria: {
    pickupDate: "",
    dropDate: "",
    vehicleType: "",
  },
  
  setUser: (user, role) => set({ user, userRole: role }),
  logout: () => set({ user: null, userRole: null }),
  setSearchCriteria: (criteria) => set((state) => ({
    searchCriteria: { ...state.searchCriteria, ...criteria }
  })),
}));