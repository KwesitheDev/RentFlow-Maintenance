import React from "react";
import {
  LogOut,
  Wrench,
  Users,
  LayoutDashboard,
  Settings,
  Building2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role }) {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">RentFlow</h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavLink to="/home" className={linkClass}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink to="/requests" className={linkClass}>
          <Wrench className="mr-3 h-5 w-5" />
          Maintenance Requests
        </NavLink>

        <NavLink to="/properties" className={linkClass}>
          <Building2 className="mr-3 h-5 w-5" />
          Properties
        </NavLink>

        {role === "admin" && (
          <NavLink to="/users" className={linkClass}>
            <Users className="mr-3 h-5 w-5" />
            Users
          </NavLink>
        )}

        <NavLink to="/settings" className={linkClass}>
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
