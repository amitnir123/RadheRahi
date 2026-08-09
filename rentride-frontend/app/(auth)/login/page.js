"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car, Mail, Phone, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const LOGIN_METHODS = [
    { value: "email", label: "Email", icon: Mail, placeholder: "you@example.com", type: "email" },
    { value: "phone", label: "Phone", icon: Phone, placeholder: "9876543210", type: "tel" },
    { value: "username", label: "Username", icon: User, placeholder: "johndoe", type: "text" },
];

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [method, setMethod] = useState("email");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const active = LOGIN_METHODS.find((m) => m.value === method);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { password };
            payload[method] = identifier.trim();

            const res = await login(payload);
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
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-mesh pointer-events-none" />
            <div className="w-full max-w-md relative animate-in">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Car className="text-primary" size={26} />
                    </div>
                    <span className="text-3xl font-bold">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </div>

                <div className="card p-6 md:p-8">
                    <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        Sign in with email, phone or username
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-3 gap-2">
                            {LOGIN_METHODS.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setMethod(value);
                                        setIdentifier("");
                                    }}
                                    className={`py-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                                        method === value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-text-secondary hover:border-primary/50 hover:text-primary"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="label" htmlFor="identifier">
                                {active.label}
                            </label>
                            <input
                                id="identifier"
                                type={active.type}
                                className="input-field"
                                placeholder={active.placeholder}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="label mb-0" htmlFor="password">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input-field pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="remember" className="text-sm text-text-secondary">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-6">
                        No account?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-text-secondary mt-6 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} className="text-success" />
                    Your account is protected with bank-grade security
                </p>
            </div>
        </div>
    );
}
