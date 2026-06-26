"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',location:'login/page.js:mount',message:'LoginPage mounted',data:{},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
        // #endregion
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(form);
            toast.success("Welcome back!");
            const role = res.data.user.role;
            if (role === "admin") router.push("/admin/dashboard");
            else router.push("/vehicles");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Car className="text-primary" size={32} />
                    <span className="text-3xl font-bold">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </div>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-6">
                        No account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}