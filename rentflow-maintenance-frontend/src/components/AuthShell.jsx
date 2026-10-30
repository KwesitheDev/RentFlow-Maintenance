import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Brand from "./Brand";
export default function AuthShell({
  children,
  title,
  subtitle,
  eyebrow,
  footer,
}) {
  return (
    <div className="auth-shell grid min-h-dvh lg:grid-cols-[.9fr_1.1fr]">
      <aside className="auth-story hidden lg:flex">
        <Brand light />
        <div>
          <p className="eyebrow !text-[#aac6a5]">
            The everyday work of property care
          </p>
          <h2>
            A little more clarity.
            <br />A lot fewer loose ends.
          </h2>
          <p>
            Keep requests, responsibilities and repair updates together. Pick up
            where your team left off.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 text-sm text-white"
            to="/demo"
          >
            Take a look around the demo <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="auth-story-bottom">
          <CheckCircle2 size={17} />
          <span>Good homes start with well-organized care.</span>
        </div>
      </aside>
      <main className="flex min-h-dvh items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <Brand />
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mb-3 mt-4 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mb-8 text-sm leading-7 text-slate-500">{subtitle}</p>
          <div>{children}</div>
          {footer && (
            <div className="mt-7 border-t border-slate-200 pt-6 text-sm text-slate-500">
              {footer}
            </div>
          )}
          <Link
            to="/"
            className="mt-8 inline-block text-xs text-slate-500 hover:text-teal-800"
          >
            ← Back to RentFlow
          </Link>
        </div>
      </main>
    </div>
  );
}
