import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowUpRight, Search, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
export default function Properties() {
  const { axiosWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRequests((await axiosWithAuth.get("/requests")).data);
    } catch (e) {
      setError("We couldn’t load property activity. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [axiosWithAuth]);
  useEffect(() => {
    load();
  }, [load]);
  const properties = useMemo(() => {
    const map = new Map();
    for (const r of requests) {
      if (!map.has(r.property))
        map.set(r.property, {
          name: r.property,
          total: 0,
          active: 0,
          resolved: 0,
        });
      const p = map.get(r.property);
      p.total++;
      if (r.status === "resolved") p.resolved++;
      else p.active++;
    }
    return [...map.values()].sort((a, b) => b.active - a.active);
  }, [requests]);
  const visible = properties.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <header className="page-heading">
        <div>
          <p className="eyebrow mb-3">Your portfolio</p>
          <h1>Properties</h1>
          <p>
            A view of the places behind the requests, organized by maintenance
            activity.
          </p>
        </div>
        <Link className="btn btn-primary" to="/app/requests?new=1">
          Log a repair <ArrowUpRight size={16} />
        </Link>
      </header>
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-4">
        <p className="text-sm font-medium">
          {loading
            ? "Loading properties…"
            : `${properties.length} properties in your request history`}
        </p>
        <label className="relative">
          <span className="sr-only">Search properties</span>
          <Search
            size={16}
            className="absolute left-3 top-3.5 text-slate-500"
          />
          <input
            className="input !pl-9"
            placeholder="Find a property"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {error ? (
        <div role="alert" className="surface p-6">
          <p className="mb-4 text-sm text-red-800">{error}</p>
          <button className="btn btn-secondary" onClick={load}>
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      ) : loading ? (
        <p role="status" className="py-12 text-center text-sm text-slate-500">
          Loading property activity…
        </p>
      ) : !visible.length ? (
        <div className="surface">
          <EmptyState
            title={
              query
                ? "No matching properties"
                : "Your properties will appear here"
            }
            description={
              query
                ? "Try another property name."
                : "Properties are summarized from actual maintenance requests. Create your first request to add property activity."
            }
          >
            {query ? (
              <button
                className="btn btn-secondary"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            ) : (
              <Link className="btn btn-primary" to="/app/requests?new=1">
                Create a request
              </Link>
            )}
          </EmptyState>
        </div>
      ) : (
        <section
          aria-label="Property activity"
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((p) => (
            <article key={p.name} className="surface p-6">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2e6] text-[#68845d]">
                <Building2 size={22} />
              </span>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mb-6 mt-1 text-xs text-slate-500">
                Maintenance activity summary
              </p>
              <dl className="mb-6 grid grid-cols-3 gap-3 border-y border-slate-100 py-4">
                {[
                  ["Total", p.total],
                  ["Active", p.active],
                  ["Resolved", p.resolved],
                ].map(([label, n]) => (
                  <div key={label}>
                    <dt className="text-[10px] text-slate-500">{label}</dt>
                    <dd className="mt-1 text-xl font-semibold">{n}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to={`/app/requests?property=${encodeURIComponent(p.name)}`}
                className="text-link !text-xs"
              >
                View maintenance <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </section>
      )}
      <p className="text-xs leading-6 text-slate-500">
        This view reflects up to 500 recent requests. It does not represent a
        complete unit inventory. Explore property and unit management in the{" "}
        <Link to="/demo" className="text-teal-800 underline">
          fictional demo
        </Link>
        .
      </p>
    </div>
  );
}
