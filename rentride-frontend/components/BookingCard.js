"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { Calendar, Car, Bike, Zap, CreditCard } from "lucide-react";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function BookingCard({ booking }) {
    const router = useRouter();
    const Icon = TYPE_ICON[booking.vehicle?.type] || Car;
    const isPaid = booking.payment?.status === "paid";
    const needsPayment =
        booking.status === "accepted" && booking.payment?.status !== "paid";

    return (
        <div className="card card-hover group cursor-pointer">
            <div className="flex gap-4 p-4">
                {/* Vehicle Image */}
                <div className="w-20 h-20 rounded-lg bg-border overflow-hidden flex-shrink-0">
                    {booking.vehicle?.images?.[0]?.url ? (
                        <img
                            src={booking.vehicle.images[0].url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={booking.vehicle.name}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon size={24} className="text-border" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <Link href={`/bookings/${booking._id}`}>
                            <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {booking.vehicle?.name || "Vehicle"}
                            </h3>
                        </Link>
                        <StatusBadge status={booking.status} size="sm" />
                    </div>

                    <p className="text-text-secondary text-sm mb-3">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                    </p>

                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                        <Calendar size={13} className="text-primary flex-shrink-0" />
                        <span>{formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span>
                        <span className="text-xs">({booking.totalDays}d)</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                            {formatCurrency(booking.totalPrice)}
                        </span>
                        <div className="flex items-center gap-2">
                            {needsPayment && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/payment/${booking._id}`);
                                    }}
                                    className="flex items-center gap-1.5 badge-warning px-3 py-1.5 text-sm font-semibold"
                                >
                                    <CreditCard size={12} />
                                    Pay Now
                                </button>
                            )}
                            {isPaid && (
                                <span className="badge-success flex items-center gap-1.5">
                                    <CreditCard size={11} />
                                    Paid
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}