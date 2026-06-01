import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80";

const metrics = [
  { label: "Open requests", value: "42" },
  { label: "Avg. response", value: "2.4h" },
  { label: "Properties tracked", value: "18" },
];

const features = [
  {
    icon: ClipboardList,
    title: "Structured request intake",
    text: "Capture tenant, property, issue, priority, status, and assignment details without spreadsheet drift.",
  },
  {
    icon: ShieldCheck,
    title: "Role-protected controls",
    text: "Managers can run maintenance workflows while admin-only user management stays gated.",
  },
  {
    icon: Clock3,
    title: "Operational visibility",
    text: "See pending, in-progress, and resolved work from the first screen your team opens.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <section
        className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.76), rgba(15, 23, 42, 0.28)), url(${heroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-950/20">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="text-2xl font-semibold tracking-normal">
              RentFlow
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn bg-white text-slate-950 hover:bg-slate-100"
            >
              Get started
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Role-aware maintenance operations
            </div>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-white md:text-6xl">
              RentFlow Maintenance
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              A professional maintenance command center for property teams to
              log tenant issues, prioritize repairs, assign work, and protect
              admin workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3"
              >
                Start tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="btn border border-white/25 bg-white/10 px-5 py-3 text-white hover:bg-white/15"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white p-4 text-slate-950 shadow-2xl shadow-slate-950/40">
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
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["High", "Kitchen sink leaking", "Oak Street A-204", "red"],
                ["Medium", "Door lock sticking", "Maple Heights B-401", "amber"],
                ["Low", "Paint touch-up", "Pine View C-102", "emerald"],
              ].map(([priority, issue, property, color]) => (
                <div
                  key={issue}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{issue}</p>
                      <p className="truncate text-sm text-slate-500">
                        {property}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                      color === "red"
                        ? "bg-red-50 text-red-700"
                        : color === "amber"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-800">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Team assignments</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 text-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Resolved history</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-blue-700">
            Built for property maintenance
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">
            Everything your team needs after a tenant reports a problem.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
