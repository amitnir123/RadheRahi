"use client";
import Link from "next/link";
import { MapPin, Star, Car, Bike, Zap, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

const TYPE_ICON = {
    car: Car,
    bike: Bike,
    scooter: Zap,
};

export default function VehicleCard({ vehicle, showStatus = false, variant = "default" }) {
    const Icon = TYPE_ICON[vehicle.type] || Car;
    const rating = vehicle.rating || 4.8;
    const reviewCount = vehicle.reviewCount || 0;

    if (variant === "compact") {
        return (
            <Link href={`/vehicles/${vehicle._id}`} className="group">
                <div className="card card-hover p-4 flex gap-4 h-full">
                    <div className="w-20 h-20 rounded-lg bg-border overflow-hidden flex-shrink-0">
                        {vehicle.images?.[0]?.url ? (
                            <img
                                src={vehicle.images[0].url}
                                alt={vehicle.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Icon size={24} className="text-border" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-sm">
                                    {vehicle.name}
                                </h3>
                                {showStatus && <StatusBadge status={vehicle.status} size="sm" />}
                            </div>
                            <p className="text-text-secondary text-xs mb-2">
                                {vehicle.brand} {vehicle.model} · {vehicle.year}
                            </p>
                            <div className="flex items-center gap-1 text-text-secondary text-xs mb-2">
                                <MapPin size={12} className="text-primary flex-shrink-0" />
                                {vehicle.location?.city}, {vehicle.location?.state}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(vehicle.pricePerDay)}
                                </span>
                                <span className="text-text-secondary text-xs"> /day</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star size={12} className="text-warning fill-warning" />
                                <span className="text-sm font-medium">{rating}</span>
                                <span className="text-text-secondary text-xs">({reviewCount})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/vehicles/${vehicle._id}`} className="block">
            <div className="card card-hover p-0 overflow-hidden group cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 bg-border overflow-hidden">
                    {vehicle.images?.[0]?.url ? (
                        <img
                            src={vehicle.images[0].url}
                            alt={vehicle.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon size={56} className="text-border" />
                        </div>
                    )}
                    {/* Type badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 capitalize shadow-sm">
                        <Icon size={12} className="text-primary" />
                        {vehicle.type}
                    </div>
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star size={12} className="text-warning fill-warning" />
                        <span>{rating}</span>
                    </div>
                    {showStatus && (
                        <div className="absolute bottom-3 right-3">
                            <StatusBadge status={vehicle.status} />
                        </div>
                    )}
                    {/* Favorite button placeholder */}
                    <button
                        className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Add to favorites"
                    >
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground text-lg leading-tight mb-1.5 group-hover:text-primary transition-colors">
                        {vehicle.name}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                    </p>

                    <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-4">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        {vehicle.location?.city}, {vehicle.location?.state}
                    </div>

                    {/* Key specs */}
                    <div className="flex items-center gap-3 mb-4 pt-3 border-t border-border">
                        {vehicle.transmission && (
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary px-2.5 py-1 bg-muted rounded-full">
                                {vehicle.transmission}
                            </span>
                        )}
                        {vehicle.fuelType && (
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary px-2.5 py-1 bg-muted rounded-full">
                                {vehicle.fuelType}
                            </span>
                        )}
                        {vehicle.seatingCapacity && (
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary px-2.5 py-1 bg-muted rounded-full">
                                {vehicle.seatingCapacity} seats
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(vehicle.pricePerDay)}
                            </span>
                            <span className="text-text-secondary text-sm"> /day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {vehicle.ownerName && (
                                <span className="text-text-secondary text-xs hidden sm:block">
                                    by {vehicle.ownerName}
                                </span>
                            )}
                            <ShieldCheck className="text-success text-sm" size={14} aria-label="Verified vehicle" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}