import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar, {
  workspaceLinks,
  WorkspaceNavigation,
} from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);
  const links = workspaceLinks(user?.role);
  return (
    <div className="flex h-dvh overflow-hidden bg-[#f4f6f3]">
      <a href="#workspace-main" className="skip-link">
        Skip to workspace
      </a>
      <Sidebar role={user?.role} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          user={user}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
        />
        {menuOpen && (
          <div id="workspace-mobile-menu" className="mobile-app-menu">
            <WorkspaceNavigation
              role={user?.role}
              onNavigate={() => setMenuOpen(false)}
            />
            <button
              className="sidebar-link"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        )}
        <main
          id="workspace-main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto"
        >
          <div className="app-content">
            <Outlet />
          </div>
        </main>
        <nav
          aria-label="Mobile workspace navigation"
          className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid border-t border-slate-200 bg-white md:hidden"
          style={{
            gridTemplateColumns: `repeat(${links.length},minmax(0,1fr))`,
          }}
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[9px] font-medium ${isActive ? "bg-teal-50 text-teal-800" : "text-slate-500"}`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>
                {label === "People & access"
                  ? "People"
                  : label === "Account settings"
                    ? "Settings"
                    : label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
