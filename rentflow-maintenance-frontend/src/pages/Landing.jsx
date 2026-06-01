import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const metrics = [
  { label: "Open requests", value: "42" },
  { label: "Avg. response", value: "2.4h" },
  { label: "Properties tracked", value: "18" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-normal">RentFlow</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link to="/register" className="btn bg-white text-slate-950 hover:bg-slate-100">
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-6 pb-12 pt-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Role-aware maintenance operations
            </div>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-white md:text-6xl">
              RentFlow Maintenance
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              A focused workspace for property teams to capture tenant issues,
              prioritize repairs, assign work, and keep admin controls protected.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary inline-flex items-center gap-2">
                Start tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white p-4 text-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Today</p>
                <h2 className="text-xl font-semibold">Maintenance command</h2>
              </div>
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Live
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["High", "Kitchen sink leaking", "Oak Street A-204"],
                ["Medium", "Door lock sticking", "Maple Heights B-401"],
                ["Low", "Paint touch-up", "Pine View C-102"],
              ].map(([priority, issue, property]) => (
                <div
                  key={issue}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium">{issue}</p>
                      <p className="text-sm text-slate-500">{property}</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold">
                    {priority}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-800">
                <Clock3 className="h-5 w-5" />
                <span className="text-sm font-medium">Timed follow-ups</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 text-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Resolved history</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
