import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  CircleAlert,
  Clock4,
  CircleCheckBig,
  ArrowUpRight,
  Plus,
  ArrowRight,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
const cards = [
  ["total", "All requests", Wrench, "blue"],
  ["pending", "Awaiting attention", CircleAlert, "gray"],
  ["inProgress", "In progress", Clock4, "yellow"],
  ["resolved", "Resolved", CircleCheckBig, "green"],
];
export default function Home() {
  const { axiosWithAuth, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRequests((await axiosWithAuth.get("/requests")).data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t load your overview. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [axiosWithAuth]);
  useEffect(() => {
    load();
  }, [load]);
  const stats = useMemo(
    () =>
      requests.reduce(
        (a, r) => {
          a.total++;
          if (r.status in a) a[r.status]++;
          return a;
        },
        { total: 0, pending: 0, inProgress: 0, resolved: 0 },
      ),
    [requests],
  );
  const active = requests.filter((r) => r.status !== "resolved");
  const high = active.filter((r) => r.priority === "high");
  return (
    <div className="space-y-7">
      <header className="page-heading">
        <div>
          <p className="eyebrow mb-3">Your maintenance desk</p>
          <h1>
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p>Here’s where things stand across your maintenance activity.</p>
        </div>
        <Link className="btn btn-primary" to="/app/requests?new=1">
          <Plus size={17} />
          New request
        </Link>
      </header>
      {error && (
        <div
          role="alert"
          className="surface border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}{" "}
          <button className="ml-3 underline" onClick={load}>
            Try again
          </button>
        </div>
      )}
      <section
        aria-label="Maintenance summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map(([key, title, icon, color]) => (
          <DashboardCard
            key={key}
            title={title}
            icon={icon}
            color={color}
            value={loading ? "—" : error ? "Unavailable" : stats[key]}
          />
        ))}
      </section>
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_.44fr]">
        <section className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold">Recent activity</h2>
            <Link className="text-link !text-xs" to="/app/requests">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          {loading ? (
            <p role="status" className="p-8 text-sm text-slate-500">
              Loading your requests…
            </p>
          ) : error ? (
            <p className="p-8 text-sm text-slate-500">
              Your request history will appear when the connection is restored.
            </p>
          ) : !requests.length ? (
            <EmptyState
              title="Your workspace starts here"
              description="Create your first maintenance request to begin tracking repairs."
            >
              <Link className="btn btn-primary" to="/app/requests?new=1">
                Create a request
              </Link>
            </EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((r) => (
                <li key={r._id}>
                  <Link
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 hover:bg-[#f8faf5]"
                    to={`/app/requests?request=${r._id}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff3e9] text-[#6b865c] sm:flex">
                        <Wrench size={17} />
                      </span>
                      <div>
                        <p className="max-w-md truncate text-sm font-medium">
                          {r.issueDescription}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {r.property} · {r.tenantName}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="space-y-5">
          <section className="surface p-6">
            <span className="small-label">NEXT UP</span>
            <h2 className="mt-3 text-lg font-semibold">
              A little attention goes a long way.
            </h2>
            <p className="mb-5 mt-3 text-xs leading-6 text-slate-500">
              {loading || error
                ? "Your priority queue will appear when requests are available."
                : `${high.length} high-priority ${high.length === 1 ? "repair needs" : "repairs need"} attention. ${active.filter((r) => !r.assignedTo).length} active requests are unassigned.`}
            </p>
            <Link
              to="/app/requests?priority=high"
              className="text-link !text-xs"
            >
              Review priority work <ArrowRight size={14} />
            </Link>
          </section>
          <section className="rounded-xl border border-[#dce5d4] bg-[#eaf0e3] p-6">
            <p className="eyebrow">EXPLORE RENTFLOW</p>
            <h2 className="mt-3 text-lg font-semibold">
              See the other side of a repair.
            </h2>
            <p className="mb-4 mt-2 text-xs leading-6 text-[#66785b]">
              Try the owner, manager, tenant and contractor perspectives in the
              fictional demo.
            </p>
            <Link className="text-link !text-xs" to="/demo">
              Launch the demo <ArrowUpRight size={14} />
            </Link>
          </section>
        </aside>
      </div>
      <p className="text-xs text-slate-500">
        Summary reflects up to 500 recent maintenance requests.
      </p>
    </div>
  );
}
