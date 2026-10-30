import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PublicLayout, { DemoCTA } from "../components/PublicLayout";
import { faqs, productPages } from "../content/site";
export function ProductPage({ path }) {
  const page = productPages[path];
  return (
    <PublicLayout>
      <div className="wrap">
        <header className="product-hero">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.heading}</h1>
          <p>{page.intro}</p>
          <Link to="/demo" className="btn btn-primary btn-large">
            Explore this in the demo <ArrowUpRight size={18} />
          </Link>
        </header>
        <div className="product-sections">
          {page.sections.map(([label, title, text]) => (
            <section key={label} className="product-detail">
              <p className="eyebrow">{label}</p>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </section>
          ))}
          <p className="availability-note">
            The four-role demo showcases these workflows with fictional records.
            The existing customer workspace currently supports administrator and
            manager accounts. Extended production roles, invitations and secure
            uploads are still in development.{" "}
            <Link to="/faq" className="underline">
              Read about availability
            </Link>
            .
          </p>
        </div>
      </div>
      <DemoCTA />
    </PublicLayout>
  );
}
export function FAQ() {
  return (
    <PublicLayout>
      <div className="wrap">
        <header className="product-hero">
          <p className="eyebrow">A little more context</p>
          <h1>Your questions, answered.</h1>
          <p>
            How the demo works, what you can explore and where the product
            stands today.
          </p>
        </header>
        <div className="faq-list mx-auto mb-20 max-w-3xl">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <DemoCTA />
    </PublicLayout>
  );
}
export function Contact() {
  return (
    <PublicLayout>
      <div className="wrap">
        <header className="product-hero">
          <p className="eyebrow">Let’s talk maintenance</p>
          <h1>
            Bring your workflow.
            <br />
            We’re listening.
          </h1>
          <p>
            RentFlow is an evolving product. Share what your team needs, ask
            about the current build or help improve the experience.
          </p>
        </header>
        <div className="contact-grid">
          <article className="surface">
            <h2>Product questions & feedback</h2>
            <p>
              Start a conversation with the maintainer through the project’s
              issue tracker. Describe your workflow and what you’d like RentFlow
              to help you do.
            </p>
            <a
              className="btn btn-primary"
              href="https://github.com/KwesitheDev/RentFlow-Maintenance/issues/new"
            >
              Contact through GitHub <ArrowUpRight size={16} />
            </a>
          </article>
          <article className="surface">
            <h2>Prefer to explore first?</h2>
            <p>
              Try the demo as an owner, manager, tenant or contractor. No
              account or personal information is required to enter.
            </p>
            <Link className="btn btn-secondary" to="/demo">
              Open the interactive demo <ArrowUpRight size={16} />
            </Link>
          </article>
        </div>
        <p className="availability-note mb-16">
          GitHub issues are public. Please do not post passwords, private tenant
          details, customer records or security-sensitive information there.
          This page does not collect form submissions.
        </p>
      </div>
    </PublicLayout>
  );
}
export function NotFound() {
  return (
    <PublicLayout>
      <div className="wrap product-hero">
        <p className="eyebrow">Page not found</p>
        <h1>This door doesn’t open.</h1>
        <p>
          The page may have moved, or the address may be incomplete. Head back
          to the product or explore the demo.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to RentFlow
        </Link>{" "}
        <Link to="/demo" className="btn btn-secondary">
          Explore demo
        </Link>
      </div>
    </PublicLayout>
  );
}
