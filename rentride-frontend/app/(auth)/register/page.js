"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
    { value: "renter", label: "Renter", desc: "I want to rent vehicles" },
    { value: "owner", label: "Owner", desc: "I want to list my vehicles" },
];

export default function RegisterPage() {
    const { register } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        role: "renter",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            toast.success("Account created! Please login.");
            router.push("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Car className="text-primary" size={32} />
                    <span className="text-3xl font-bold">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </div>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-1">Create account</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        Join RentRide today
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-3">
                            {ROLES.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() =>
                                        setForm({ ...form, role: r.value })
                                    }
                                    className={`p-3 rounded-lg border text-left transition-colors ${
                                        form.role === r.value
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className="font-semibold text-sm">
                                        {r.label}
                                    </div>
                                    <div className="text-text-secondary text-xs mt-0.5">
                                        {r.desc}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Full Name
                            </label>
                            <input
                                className="input-field"
                                placeholder="John Doe"
                                value={form.fullname}
                                onChange={(e) =>
                                    setForm({ ...form, fullname: e.target.value })
                                }
                                required
                            />
                        </div>

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
                                Username
                            </label>
                            <input
                                className="input-field"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({ ...form, username: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Phone
                            </label>
                            <input
                                className="input-field"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Min 8 characters"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}