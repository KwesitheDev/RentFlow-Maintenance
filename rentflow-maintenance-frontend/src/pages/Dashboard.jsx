import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const links = [
    { to: "/app/home", label: "Home", icon: LayoutDashboard },
    { to: "/app/requests", label: "Requests", icon: Wrench },
    { to: "/app/properties", label: "Properties", icon: Building2 },
    ...(user?.role === "admin"
      ? [{ to: "/app/users", label: "Users", icon: Users }]
      : []),
    { to: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role={user?.role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 md:pb-6">
          <Outlet />
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid border-t border-slate-200 bg-white md:hidden"
          style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium ${
                  isActive ? "text-blue-700" : "text-slate-500"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
