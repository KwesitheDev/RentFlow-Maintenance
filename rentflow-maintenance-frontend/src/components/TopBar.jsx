import React from "react";
import { Menu, User } from "lucide-react";

export default function TopBar({ user }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center">
        <button className="mr-3 rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          {user?.role === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
