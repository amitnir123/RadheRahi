"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children, roles = [] }) {
    const { user, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }
            if (roles.length > 0 && !roles.includes(user.role)) {
                router.push("/");
            }
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;
    if (roles.length > 0 && !roles.includes(user.role)) return null;

    return children;
}