"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    Car, Bike, Zap, Calendar, Shield,
    Loader2, ChevronLeft, CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

// Load Razorpay script dynamically
const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PaymentPage() {
    const { bookingId } = useParams();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payLoading, setPayLoading] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${bookingId}`);
                const b = res.data.data;

                // Guard — only accepted + unpaid can access this page
                if (b.status !== "accepted") {
                    toast.error("Booking is not accepted yet");
                    router.push(`/bookings/${bookingId}`);
                    return;
                }
                if (b.payment?.status === "paid") {
                    toast.success("Already paid!");
                    router.push(`/bookings/${bookingId}`);
                    return;
                }

                setBooking(b);
            } catch {
                toast.error("Booking not found");
                router.push("/bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handlePay = async () => {
        setPayLoading(true);

        try {
            // 1. Create order on backend
            const orderRes = await api.post("/payments/create-order", { bookingId });
            const { orderId, amount, amountInPaise, keyId, isMock } = orderRes.data.data;

            if (isMock) {
                toast.success("Simulating payment (Razorpay blocked)...");
                // 2. Verify mock payment on backend
                await api.post("/payments/verify", {
                    razorpay_order_id: orderId,
                    razorpay_payment_id: "mock_payment_" + Date.now(),
                    razorpay_signature: "mock_signature",
                    bookingId,
                    isMock: true
                });
                toast.success("Payment successful!");
                router.push(
                    `/payment-success?bookingId=${bookingId}&amount=${amount}`
                );
                return;
            }

            // 3. Load Razorpay script for actual payment
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error("Failed to load payment gateway. Check your internet.");
                setPayLoading(false);
                return;
            }

            // 4. Open Razorpay checkout
            const options = {
                key: keyId,
                amount: amountInPaise,
                currency: "INR",
                name: "RentRide",
                description: `Booking for ${booking.vehicle?.name}`,
                order_id: orderId,
                prefill: {
                    name: booking.renter?.fullname || "",
                    email: booking.renter?.email || "",
                    contact: booking.renter?.phone || "",
                },
                theme: {
                    color: "#0F766E",
                },
                modal: {
                    ondismiss: () => {
                        setPayLoading(false);
                        toast("Payment cancelled", { icon: "⚠️" });
                    },
                },
                handler: async (response) => {
                    // 5. Verify payment on backend
                    try {
                        await api.post("/payments/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId,
                        });
                        toast.success("Payment successful!");
                        router.push(
                            `/payment-success?bookingId=${bookingId}&amount=${amount}`
                        );
                    } catch (err) {
                        toast.error(
                            err.response?.data?.message || "Payment verification failed"
                        );
                        setPayLoading(false);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                toast.error(
                    response.error?.description || "Payment failed"
                );
                setPayLoading(false);
            });
            rzp.open();
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment initiation failed");
            setPayLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
            </div>
        );
    }

    if (!booking) return null;

    const Icon = TYPE_ICON[booking.vehicle?.type] || Car;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="container-page max-w-lg py-8">
                {/* Back */}
                <Link
                    href={`/bookings/${bookingId}`}
                    className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to booking
                </Link>

                <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

                {/* Booking Summary Card */}
                <div className="card p-6 mb-4">
                    <h2 className="font-semibold mb-4 text-text-secondary text-sm uppercase tracking-wide">
                        Booking Summary
                    </h2>

                    {/* Vehicle */}
                    <div className="flex gap-3 mb-4 pb-4 border-b border-border">
                        <div className="w-16 h-16 rounded-lg bg-border overflow-hidden flex-shrink-0">
                            {booking.vehicle?.images?.[0]?.url ? (
                                <img
                                    src={booking.vehicle.images[0].url}
                                    className="w-full h-full object-cover"
                                    alt={booking.vehicle?.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon size={24} className="text-border" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold">{booking.vehicle?.name}</p>
                            <p className="text-text-secondary text-sm">
                                {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2.5 text-sm mb-4 pb-4 border-b border-border">
                        <div className="flex justify-between">
                            <span className="text-text-secondary flex items-center gap-1.5">
                                <Calendar size={13} className="text-primary" />
                                Start Date
                            </span>
                            <span className="font-medium">{formatDate(booking.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary flex items-center gap-1.5">
                                <Calendar size={13} className="text-primary" />
                                End Date
                            </span>
                            <span className="font-medium">{formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Duration</span>
                            <span className="font-medium">{booking.totalDays} days</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Rate</span>
                            <span className="font-medium">{formatCurrency(booking.pricePerDay)}/day</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center bg-background rounded-xl p-4 border border-border">
                        <span className="font-bold text-lg">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatCurrency(booking.totalPrice)}
                        </span>
                    </div>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-2.5 text-text-secondary text-xs mb-6 px-2 py-3 bg-success/5 border border-success/20 rounded-xl">
                    <Shield size={14} className="text-success flex-shrink-0 mt-0.5" />
                    <span>
                        Payments are processed securely via Razorpay. Your card details
                        are never stored on our servers.
                    </span>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePay}
                    disabled={payLoading}
                    className="btn-primary btn-lg w-full flex items-center justify-center gap-2"
                >
                    {payLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Opening Payment...
                        </>
                    ) : (
                        <>
                            <CreditCard size={18} />
                            Pay {formatCurrency(booking.totalPrice)}
                        </>
                    )}
                </button>

                <p className="text-center text-text-secondary text-xs mt-3">
                    Full refund on cancellation
                </p>
            </div>
        </ProtectedRoute>
    );
}