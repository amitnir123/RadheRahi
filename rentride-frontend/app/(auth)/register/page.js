"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const { register } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        const phoneDigits = form.phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
            toast.error("Enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            await register({ ...form, role: "renter" });
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
                        Join RentRide to book vehicles in Mathura. Email and phone must be unique.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Full Name</label>
                            <input
                                className="input-field"
                                placeholder="John Doe"
                                value={form.fullname}
                                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Username</label>
                            <input
                                className="input-field"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Phone</label>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Min 8 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Re-enter password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
