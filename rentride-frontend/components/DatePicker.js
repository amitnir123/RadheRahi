"use client";
import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const toYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const parseYMD = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const formatDisplay = (str) => {
    if (!str) return "Select date";
    const d = parseYMD(str);
    return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

export default function DatePicker({ label, value, onChange, min, disabled = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const minDate = parseYMD(min) || new Date();
    const selected = parseYMD(value);
    const [viewDate, setViewDate] = useState(selected || minDate);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const isDisabled = (day) => {
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        if (date < today) return true;
        if (minDate && date < minDate) return true;
        return false;
    };

    const selectDay = (day) => {
        if (!day || isDisabled(day)) return;
        const date = new Date(year, month, day);
        onChange(toYMD(date));
        setOpen(false);
    };

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    return (
        <div ref={ref} className="relative">
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                {label}
            </label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(!open)}
                className={`input-field text-left flex items-center justify-between w-full ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
                <span className={value ? "text-white" : "text-text-secondary"}>
                    {formatDisplay(value)}
                </span>
                <Calendar size={16} className="text-primary flex-shrink-0" />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full min-w-[280px] bg-card border border-border rounded-xl shadow-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1.5 rounded-lg hover:bg-border transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-semibold text-sm">
                            {MONTHS[month]} {year}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1.5 rounded-lg hover:bg-border transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <div key={d} className="py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} />;
                            const ymd = toYMD(new Date(year, month, day));
                            const isSelected = value === ymd;
                            const disabledDay = isDisabled(day);
                            return (
                                <button
                                    key={ymd}
                                    type="button"
                                    disabled={disabledDay}
                                    onClick={() => selectDay(day)}
                                    className={`h-9 rounded-lg text-sm transition-colors ${
                                        isSelected
                                            ? "bg-primary text-white font-semibold"
                                            : disabledDay
                                            ? "text-border cursor-not-allowed"
                                            : "hover:bg-primary/20 hover:text-primary"
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
