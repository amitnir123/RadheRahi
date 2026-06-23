import { create } from "zustand";
import api from "@/lib/axios";

const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    fetchMe: async () => {
        try {
            // backend returns user from cookie — no token needed in header
            const res = await api.get("/users/me");
            set({ user: res.data.data, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },

    login: async (data) => {
        const res = await api.post("/auth/login", data);
        set({ user: res.data.data.user });
        return res.data;
    },

    register: async (data) => {
        const res = await api.post("/auth/register", data);
        return res.data;
    },

    logout: async () => {
        await api.post("/auth/logout");
        set({ user: null });
    },
}));

export default useAuthStore;