"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    Calendar, Car, Bike, Zap, User, Phone, Mail,
    MapPin, ChevronLeft, Loader2, CreditCard, X, MapPinned,
    Share2, AlertCircle, CheckCircle, Clock, ShieldCheck
} from "lucide-react";
import { PLATFORM_CONTACT } from "@/lib/constants";
import toast from "react-hot-toast";
import Link from "next/link";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

const STATUS_ICONS = {
    pending: { icon: Clock, color: "text-warning bg-warning/10 border-warning/20" },
    accepted: { icon: CheckCircle, color: "text-success bg-success/10 border-success/20" },
    completed: { icon: CheckCircle, color: "text-info bg-info/10 border-info/20" },
    cancelled: { icon: X, color: "text-text-secondary bg-muted border-border" },
    rejected: { icon: AlertCircle, color: "text-danger bg-danger/10 border-danger/20" },
};

export default function BookingDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const fetchBooking = async () => {
        try {
            const res = await api.get(`/bookings/${id}`);
            setBooking(res.data.data);
        } catch {
            toast.error("Booking not found");
            router.push("/bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            // if paid → use payment cancel (triggers refund)
            // if unpaid → use booking cancel
            if (booking.payment?.status === "paid") {
                await api.patch(`/payments/cancel/${id}`, {
                    reason: cancelReason || "Cancelled by renter"
                });
                toast.success("Booking cancelled. Refund initiated.");
            } else {
                await api.patch(`/bookings/${id}/cancel`, {
                    reason: cancelReason || "Cancelled by renter"
                });
                toast.success("Booking cancelled.");
            }
            setShowCancelModal(false);
            fetchBooking();
        } catch (err) {
            toast.error(err.response?.data?.message || "Cancel failed");
        } finally {
            setCancelLoading(false);
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
    const canCancel = ["pending", "accepted"].includes(booking.status);
    const needsPayment =
        booking.status === "accepted" && booking.payment?.status !== "paid";
    const statusConfig = STATUS_ICONS[booking.status] || STATUS_ICONS.cancelled;
    const StatusIcon = statusConfig.icon;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="container-page py-8">
                {/* Back */}
                <Link
                    href="/bookings"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to bookings
                </Link>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl font-bold">Booking Details</h1>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={booking.status} size="lg" />
                        </div>
                    </div>

                    {/* Payment Due Banner */}
                    {needsPayment && (
                        <div className="card p-5 border-warning/40 bg-warning/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-warning flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-semibold text-warning">Payment Required</p>
                                    <p className="text-text-secondary text-sm mt-0.5">
                                        Your booking is accepted! Complete payment to confirm your ride.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/payment/${id}`}
                                className="btn-primary flex-shrink-0 flex items-center gap-2 text-sm"
                            >
                                <CreditCard size={14} />
                                Pay {formatCurrency(booking.totalPrice)}
                            </Link>
                        </div>
                    )}

                    {/* Vehicle Info */}
                    <div className="card p-5 flex gap-4">
                        <div className="w-20 h-20 rounded-lg bg-border overflow-hidden flex-shrink-0">
                            {booking.vehicle?.images?.[0]?.url ? (
                                <img
                                    src={booking.vehicle.images[0].url}
                                    className="w-full h-full object-cover"
                                    alt={booking.vehicle.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon size={24} className="text-border" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-lg truncate">{booking.vehicle?.name}</h2>
                            <p className="text-text-secondary text-sm mt-0.5">
                                {booking.vehicle?.brand} {booking.vehicle?.model}
                            </p>
                            <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                                <MapPin size={13} className="text-primary" />
                                {booking.vehicle?.location?.city}, {booking.vehicle?.location?.state}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(booking.totalPrice)}
                            </span>
                            <span className="text-text-secondary text-sm">Total</span>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="card p-5 space-y-4">
                        <h3 className="font-semibold text-lg">Booking Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-text-secondary mb-1">Start Date</p>
                                <p className="font-medium flex items-center gap-1.5">
                                    <Calendar size={13} className="text-primary" />
                                    {formatDate(booking.startDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-text-secondary mb-1">End Date</p>
                                <p className="font-medium flex items-center gap-1.5">
                                    <Calendar size={13} className="text-primary" />
                                    {formatDate(booking.endDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-text-secondary mb-1">Duration</p>
                                <p className="font-medium">{booking.totalDays} days</p>
                            </div>
                            <div>
                                <p className="text-text-secondary mb-1">Pickup Place</p>
                                <p className="font-medium flex items-center gap-1.5">
                                    <MapPinned size={13} className="text-primary" />
                                    {booking.pickupPlace}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-text-secondary mb-1">Price/Day</p>
                                <p className="font-medium">{formatCurrency(booking.pricePerDay)}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-text-secondary mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-5 h-5 ${statusConfig.color.split(' ')[0]}`} size={18} />
                                    <StatusBadge status={booking.status} />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between items-center">
                            <span className="font-bold text-lg">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(booking.totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="card p-5">
                        <h3 className="font-semibold text-lg mb-3">Payment Status</h3>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={booking.payment?.status || "unpaid"} size="lg" />
                                {booking.payment?.transactionId && (
                                    <span className="text-text-secondary text-xs font-mono bg-muted px-2 py-1 rounded">
                                        {booking.payment.transactionId}
                                    </span>
                                )}
                            </div>
                            {needsPayment && (
                                <Link
                                    href={`/payment/${id}`}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <CreditCard size={14} />
                                    Pay Now
                                </Link>
                            )}
                        </div>
                    </div>

                    {booking.vehicle?.ownerName && (
                        <div className="card p-5">
                            <h3 className="font-semibold text-lg mb-4">Vehicle Owner</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={18} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{booking.vehicle.ownerName}</p>
                                    <p className="text-text-secondary text-sm">Contact via RentRide</p>
                                    <div className="flex flex-col gap-1 mt-2 text-sm text-text-secondary">
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={13} className="text-primary" />
                                            {booking.vehicle?.listedBy?.phone || PLATFORM_CONTACT.phone}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={13} className="text-primary" />
                                            {booking.vehicle?.listedBy?.email || PLATFORM_CONTACT.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rejection/Cancellation reason */}
                    {booking.rejectionReason && (
                        <div className="card p-5 border-danger/30 bg-danger/5">
                            <p className="text-sm text-danger font-medium mb-1 flex items-center gap-1.5">
                                <AlertCircle size={14} />
                                Rejection Reason
                            </p>
                            <p className="text-text-secondary text-sm">{booking.rejectionReason}</p>
                        </div>
                    )}
                    {booking.cancellationReason && (
                        <div className="card p-5 border-zinc-500/30 bg-zinc-500/5">
                            <p className="text-sm text-text-secondary font-medium mb-1 flex items-center gap-1.5">
                                <X size={14} className="text-text-secondary" />
                                Cancellation Reason
                            </p>
                            <p className="text-text-secondary text-sm">{booking.cancellationReason}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                        {needsPayment && (
                            <Link
                                href={`/payment/${id}`}
                                className="btn-primary flex-1 sm:flex-none text-center flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} />
                                Pay Now — {formatCurrency(booking.totalPrice)}
                            </Link>
                        )}
                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="btn-outline flex-1 sm:flex-none border-danger/50 text-danger hover:border-danger flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in">
                    <div className="card w-full max-w-md p-6 animate-in scale-in">
                        <h2 className="text-xl font-bold mb-1">Cancel Booking</h2>
                        <p className="text-text-secondary text-sm mb-5">
                            {booking.payment?.status === "paid"
                                ? "A full refund will be initiated to your account."
                                : "This action cannot be undone."}
                        </p>
                        <div className="mb-5">
                            <label className="label" htmlFor="cancelReason">
                                Reason (optional)
                            </label>
                            <textarea
                                id="cancelReason"
                                className="input-field resize-none h-20"
                                placeholder="Why are you cancelling?"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="btn-outline flex-1"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelLoading}
                                className="flex-1 bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancelLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    "Yes, Cancel"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}