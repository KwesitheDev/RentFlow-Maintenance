import React from "react";
export default function StatusBadge({ status }) {
  const colors = {
    pending: "bg-slate-100 text-slate-600",
    submitted: "bg-slate-100 text-slate-600",
    inProgress: "bg-amber-50 text-amber-800",
    resolved: "bg-emerald-50 text-emerald-800",
    closed: "bg-emerald-50 text-emerald-800",
    high: "bg-red-50 text-red-700",
    medium: "bg-amber-50 text-amber-800",
    low: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`badge whitespace-nowrap ${colors[status] || "bg-slate-100 text-slate-600"}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
      />
      {status === "inProgress"
        ? "In progress"
        : status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
