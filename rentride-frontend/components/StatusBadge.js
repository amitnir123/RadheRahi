import { STATUS_COLORS } from "@/lib/utils";

export default function StatusBadge({ status }) {
    return (
        <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                STATUS_COLORS[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}
        >
            {status}
        </span>
    );
}