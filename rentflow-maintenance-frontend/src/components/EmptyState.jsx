import React from "react";
import { Inbox } from "lucide-react";
export default function EmptyState({ title, description, children }) {
  return (
    <div className="px-5 py-14 text-center">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf2e8] text-[#65845b]">
        <Inbox size={23} aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mb-5 mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {children}
    </div>
  );
}
