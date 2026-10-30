import React from "react";
import {
  LogOut,
  Users,
  LayoutDashboard,
  Settings,
  Building2,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Brand from "./Brand";
export const workspaceLinks = (role) => [
  { to: "/app/home", label: "Overview", icon: LayoutDashboard },
  { to: "/app/requests", label: "Maintenance", icon: Wrench },
  { to: "/app/properties", label: "Properties", icon: Building2 },
  ...(role === "admin"
    ? [{ to: "/app/users", label: "People & access", icon: Users }]
    : []),
  { to: "/app/settings", label: "Account settings", icon: Settings },
];
export function WorkspaceNavigation({ role, onNavigate }) {
  return (
    <nav aria-label="Workspace navigation">
      {workspaceLinks(role).map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="app-sidebar">
      <Brand light />
      <p className="sidebar-caption">Your workspace</p>
      <WorkspaceNavigation role={role} />
      <div className="mt-auto">
        <div className="sidebar-note">
          <strong>A fresh perspective</strong>
          <p>Explore a repair from all four roles in a private demo.</p>
          <Link to="/demo">
            Try the demo <ArrowUpRight size={14} />
          </Link>
        </div>
        <button
          className="sidebar-link mb-6 mt-4 w-11/12"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
