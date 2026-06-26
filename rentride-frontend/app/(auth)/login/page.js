"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car, Mail, Phone, User } from "lucide-react";
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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Car className="text-primary" size={32} />
                    <span className="text-3xl font-bold">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </div>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        Sign in with email, phone or username
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            {LOGIN_METHODS.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setMethod(value);
                                        setIdentifier("");
                                    }}
                                    className={`py-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                                        method === value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-text-secondary hover:border-primary/50"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                {active.label}
                            </label>
                            <input
                                type={active.type}
                                className="input-field"
                                placeholder={active.placeholder}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        <Link href="/register" className="text-primary hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
