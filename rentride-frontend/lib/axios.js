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
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                return api(original);
            } catch {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;