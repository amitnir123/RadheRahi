import { create } from "zustand";
import api from "@/lib/axios";

const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    fetchMe: async () => {
        // #region agent log
        fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',location:'authStore.js:fetchMe',message:'fetchMe called',data:{pathname:typeof window!=='undefined'?window.location.pathname:null},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        try {
            // backend returns user from cookie — no token needed in header
            const res = await api.get("/users/me");
            set({ user: res.data.data, loading: false });
        } catch (err) {
            // #region agent log
            fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',location:'authStore.js:fetchMe:catch',message:'fetchMe failed',data:{status:err.response?.status,pathname:typeof window!=='undefined'?window.location.pathname:null},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
            // #endregion
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