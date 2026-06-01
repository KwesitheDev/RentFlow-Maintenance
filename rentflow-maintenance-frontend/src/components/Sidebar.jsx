import React from "react";
import {
  LogOut,
  Wrench,
  Users,
  LayoutDashboard,
  Settings,
  Building2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold">RentFlow</h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavLink to="/app/home" className={linkClass}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink to="/app/requests" className={linkClass}>
          <Wrench className="mr-3 h-5 w-5" />
          Maintenance Requests
        </NavLink>

        <NavLink to="/app/properties" className={linkClass}>
          <Building2 className="mr-3 h-5 w-5" />
          Properties
        </NavLink>

        {role === "admin" && (
          <NavLink to="/app/users" className={linkClass}>
            <Users className="mr-3 h-5 w-5" />
            Users
          </NavLink>
        )}

        <NavLink to="/app/settings" className={linkClass}>
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
