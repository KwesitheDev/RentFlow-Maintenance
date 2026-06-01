import React from "react";
import { Link } from "react-router-dom";
import { Building2, ShieldCheck, Wrench } from "lucide-react";

const backgroundImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80";

export default function AuthShell({
  children,
  title,
  subtitle,
  eyebrow,
  footer,
}) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section
          className="relative hidden overflow-hidden bg-slate-950 text-white lg:block"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.62)), url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative z-10 flex min-h-screen flex-col justify-between px-10 py-8">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="text-2xl font-semibold">RentFlow</span>
            </Link>

            <div className="max-w-xl pb-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Secure property operations
              </div>
              <h2 className="text-5xl font-semibold leading-tight">
                Maintenance work, tenants, and teams in one calm workspace.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                Give managers a fast repair desk while keeping user management,
                role access, and account controls locked down for admins.
              </p>
            </div>

            <div className="grid gap-3 pb-3 sm:grid-cols-3">
              {[
                ["Requests", "Prioritized queue"],
                ["Properties", "Activity summary"],
                ["Access", "Admin controls"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/15 bg-white/10 p-4"
                >
                  <p className="text-xs font-semibold uppercase text-slate-300">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mx-auto mb-8 flex w-fit items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="text-3xl font-semibold">RentFlow</span>
            </Link>

            <div className="mb-6">
              {eyebrow && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase text-slate-500 shadow-sm">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  {eyebrow}
                </div>
              )}
              <h1 className="text-3xl font-semibold tracking-normal">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {subtitle}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              {children}
            </div>

            {footer && <div className="mt-6 text-center">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
