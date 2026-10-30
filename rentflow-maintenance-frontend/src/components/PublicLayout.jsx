import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="public-site">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="public-header">
        <div className="public-nav wrap">
          <Brand />
          <nav aria-label="Main navigation" className="desktop-links">
            {[
              ["/features", "Product"],
              ["/property-managers", "For managers"],
              ["/tenant-portal", "For tenants"],
              ["/reporting", "Reporting"],
            ].map(([to, name]) => (
              <NavLink key={to} to={to}>
                {name}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="sign-in-link">
              Sign in
            </Link>
            <Link to="/demo" className="btn btn-primary">
              Explore demo <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-controls="public-mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="public-mobile-menu"
            aria-label="Mobile navigation"
            className="mobile-public-nav"
          >
            {[
              ["/features", "Product"],
              ["/property-managers", "For managers"],
              ["/tenant-portal", "For tenants"],
              ["/reporting", "Reporting"],
              ["/faq", "FAQ"],
              ["/login", "Sign in"],
            ].map(([to, name]) => (
              <Link onClick={() => setOpen(false)} key={to} to={to}>
                {name}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="public-footer">
        <div className="wrap footer-grid">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              A little more clarity.
              <br />A better way to manage maintenance.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <Link to="/features">Product features</Link>
            <Link to="/property-managers">Property managers</Link>
            <Link to="/tenant-portal">Tenant portal</Link>
            <Link to="/reporting">Reports & analytics</Link>
          </div>
          <div>
            <h2>Get to know RentFlow</h2>
            <Link to="/demo">Interactive demo</Link>
            <Link to="/faq">Frequently asked questions</Link>
            <Link to="/contact">Contact & feedback</Link>
            <a href="https://github.com/KwesitheDev/RentFlow-Maintenance">
              Project on GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <p>
            © {new Date().getFullYear()} RentFlow. Built for the work behind
            better homes.
          </p>
          <p>Demo data is fictional. Customer access is by arrangement.</p>
        </div>
      </footer>
    </div>
  );
}
export function DemoCTA() {
  return (
    <section className="wrap cta-section">
      <div>
        <p className="eyebrow">Take a closer look</p>
        <h2>
          One repair. Four perspectives.
          <br />
          Try the whole journey.
        </h2>
        <p>
          Explore a private workspace with fictional properties and requests.
        </p>
      </div>
      <Link to="/demo" className="btn btn-primary">
        Open the interactive demo <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
