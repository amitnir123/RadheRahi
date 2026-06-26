import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    withCredentials: true, // sends httpOnly cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});

// response interceptor — auto refresh token on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            // #region agent log
            fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',location:'axios.js:401',message:'401 intercepted - attempting refresh',data:{url:original.url,pathname:typeof window!=='undefined'?window.location.pathname:null},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                return api(original);
            } catch {
                const pathname =
                    typeof window !== "undefined" ? window.location.pathname : null;
                const isAuthPage = pathname === "/login" || pathname === "/register";
                // #region agent log
                fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',runId:'post-fix',location:'axios.js:refresh-fail',message:isAuthPage?'refresh failed - skip redirect on auth page':'refresh failed - redirecting to /login',data:{pathname,isAuthPage},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                if (typeof window !== "undefined" && !isAuthPage) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;