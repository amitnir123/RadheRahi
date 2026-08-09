import { STATUS_COLORS } from "@/lib/utils";

const SIZE_CLASSES = {
    sm: "text-[0.625rem] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
};

export default function StatusBadge({ status, size = "md" }) {
    return (
        <span
            className={`font-medium rounded-full border capitalize ${SIZE_CLASSES[size]} ${
                STATUS_COLORS[status] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            }`}
        >
            {status}
        </span>
    );
}