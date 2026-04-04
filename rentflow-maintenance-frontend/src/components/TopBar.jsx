import React from "react";
import { User } from "lucide-react";

export default function TopBar({ user }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {user?.role === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
