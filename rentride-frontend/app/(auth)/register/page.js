"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Car, Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const passwordInputClass = (value) => `input-field pr-12 ${value ? "border-success/60" : ""}`;

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-mesh pointer-events-none" />
            <div className="w-full max-w-lg relative animate-in">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Car className="text-primary" size={26} />
                    </div>
                    <span className="text-3xl font-bold">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </div>

                <div className="card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <UserPlus size={20} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-0.5">Create account</h1>
                            <p className="text-text-secondary text-sm">
                                Join RentRide to book vehicles in Mathura. Email and phone must be unique.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label label-required" htmlFor="fullname">Full Name</label>
                            <input
                                id="fullname"
                                className="input-field"
                                placeholder="John Doe"
                                value={form.fullname}
                                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="label label-required" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="label label-required" htmlFor="username">Username</label>
                            <input
                                id="username"
                                className="input-field"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                minLength={3}
                            />
                        </div>

                        <div>
                            <label className="label label-required" htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                type="tel"
                                className="input-field"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="label label-required" htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={passwordInputClass(form.password)}
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={8}
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

                        <div>
                            <label className="label label-required" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={passwordInputClass(form.confirmPassword)}
                                    placeholder="Re-enter password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-text-secondary mt-6 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} className="text-success" />
                    Your details are encrypted and never shared
                </p>
            </div>
        </div>
    );
}
