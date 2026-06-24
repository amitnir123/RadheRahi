"use client";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { Calendar, Car, Bike, Zap, CreditCard } from "lucide-react";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function BookingCard({ booking }) {
    const Icon = TYPE_ICON[booking.vehicle?.type] || Car;
    const isPaid = booking.payment?.status === "paid";
    const needsPayment =
        booking.status === "accepted" && booking.payment?.status === "unpaid";

    return (
        <Link href={`/bookings/${booking._id}`}>
            <div className="card hover:border-primary transition-colors group cursor-pointer">
                <div className="flex gap-4">
                    {/* Vehicle Image */}
                    <div className="w-24 h-24 rounded-lg bg-border overflow-hidden flex-shrink-0">
                        {booking.vehicle?.images?.[0]?.url ? (
                            <img
                                src={booking.vehicle.images[0].url}
                                className="w-full h-full object-cover"
                                alt={booking.vehicle.name}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Icon size={28} className="text-border" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                                {booking.vehicle?.name || "Vehicle"}
                            </h3>
                            <StatusBadge status={booking.status} />
                        </div>

                        <p className="text-text-secondary text-sm mb-2">
                            {booking.vehicle?.brand} {booking.vehicle?.model}
                        </p>

                        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
                            <Calendar size={13} className="text-primary flex-shrink-0" />
                            {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                            <span className="text-xs">({booking.totalDays}d)</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">
                                {formatCurrency(booking.totalPrice)}
                            </span>
                            {needsPayment && (
                                <span className="flex items-center gap-1 text-xs bg-warning/10 text-warning border border-warning/20 px-2 py-1 rounded-full">
                                    <CreditCard size={11} />
                                    Pay Now
                                </span>
                            )}
                            {isPaid && (
                                <span className="flex items-center gap-1 text-xs bg-success/10 text-success border border-success/20 px-2 py-1 rounded-full">
                                    <CreditCard size={11} />
                                    Paid
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}