"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const amount = searchParams.get("amount");

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                            <CheckCircle size={48} className="text-success" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-text-secondary mb-2">
                        Your booking has been confirmed.
                    </p>

                    {amount && (
                        <p className="text-4xl font-bold text-primary my-6">
                            {formatCurrency(Number(amount))}
                        </p>
                    )}

                    <div className="card text-left mb-6 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Status</span>
                            <span className="text-success font-medium">Paid ✓</span>
                        </div>
                        {bookingId && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Booking ID</span>
                                <span className="font-mono text-xs text-text-secondary">
                                    {bookingId}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {bookingId && (
                            <Link
                                href={`/bookings/${bookingId}`}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                View Booking
                                <ArrowRight size={16} />
                            </Link>
                        )}
                        <Link
                            href="/bookings"
                            className="btn-outline w-full"
                        >
                            All Bookings
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}