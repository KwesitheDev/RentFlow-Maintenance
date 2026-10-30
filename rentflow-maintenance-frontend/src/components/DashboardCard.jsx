import React from "react";
import Card from "./Card";
export default function DashboardCard({
  title,
  icon: Icon,
  value,
  color = "blue",
}) {
  const styles = {
    blue: "bg-teal-50 text-teal-700",
    gray: "bg-slate-100 text-slate-600",
    yellow: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-medium text-slate-500">{title}</h2>
        {Icon && (
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles[color]}`}
          >
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
    </Card>
  );
}
