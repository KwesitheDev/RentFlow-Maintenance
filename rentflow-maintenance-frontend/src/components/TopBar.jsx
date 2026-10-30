import React from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export default function TopBar({ user, menuOpen, onMenuToggle }) {
  const { pathname } = useLocation();
  const title =
    {
      home: "Overview",
      requests: "Maintenance",
      properties: "Properties",
      users: "People & access",
      settings: "Account settings",
    }[pathname.split("/").pop()] || "Workspace";
  return (
    <header className="app-topbar">
      <div className="flex items-center gap-3">
        <button
          className="icon-button md:hidden"
          aria-label={menuOpen ? "Close workspace menu" : "Open workspace menu"}
          aria-expanded={menuOpen}
          aria-controls="workspace-mobile-menu"
          onClick={onMenuToggle}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <p className="app-breadcrumb">
          <span>Workspace</span>
          <ChevronRight size={13} aria-hidden="true" />
          <strong>{title}</strong>
        </p>
      </div>
      <Link
        to="/app/settings"
        aria-label="Open your account settings"
        className="flex items-center gap-3"
      >
        <span className="app-avatar" aria-hidden="true">
          {user?.name
            ?.split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "RF"}
        </span>
        <div className="hidden sm:block">
          <p className="text-xs font-semibold">{user?.name}</p>
          <p className="mt-1 text-[10px] capitalize text-slate-500">
            {user?.role === "admin" ? "Administrator" : "Property manager"}
          </p>
        </div>
      </Link>
    </header>
  );
}
