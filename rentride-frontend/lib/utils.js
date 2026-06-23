import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

export const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export const calcDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const STATUS_COLORS = {
    pending:   "bg-warning/10 text-warning border-warning/20",
    approved:  "bg-success/10 text-success border-success/20",
    rejected:  "bg-danger/10 text-danger border-danger/20",
    accepted:  "bg-success/10 text-success border-success/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    completed: "bg-info/10 text-info border-info/20",
    paid:      "bg-success/10 text-success border-success/20",
    refunded:  "bg-refunded/10 text-refunded border-refunded/20",
    failed:    "bg-danger/10 text-danger border-danger/20",
    unpaid:    "bg-warning/10 text-warning border-warning/20",
};