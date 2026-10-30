import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Building2,
  Clock3,
  ClipboardList,
  Wrench,
  CircleCheck,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import PublicLayout, { DemoCTA } from "../components/PublicLayout";
import { faqs } from "../content/site";
export default function Landing() {
  return (
    <PublicLayout>
      <section className="wrap hero-section">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Property maintenance, thoughtfully
            organized
          </p>
          <h1>
            Good homes.
            <br />
            Fewer loose ends<span className="text-teal-700">.</span>
          </h1>
          <p className="hero-description">
            Give every repair a clear next step. Bring requests, people and
            progress together in a workspace built for the everyday work of
            property care.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/demo" className="btn btn-primary btn-large">
              Explore RentFlow <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/features" className="btn btn-secondary btn-large">
              See how it works <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="hero-footnote">
            <Check size={14} aria-hidden="true" /> No signup. Four roles. Your
            own fictional workspace.
          </p>
        </div>
        <div
          className="hero-visual"
          aria-label="Illustrative RentFlow maintenance workspace"
        >
          <div className="visual-topline">
            <span className="flex gap-1.5">
              <i />
              <i />
              <i />
            </span>
            <span>rentflow / workspace preview</span>
            <span className="preview-pill">Illustrative data</span>
          </div>
          <div className="workspace-preview">
            <aside aria-hidden="true">
              <span className="preview-logo">r.</span>
              <ClipboardList size={18} />
              <Building2 size={18} />
              <Wrench size={18} />
            </aside>
            <div className="preview-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="preview-eyebrow">
                    PALM COURT · FICTIONAL PROPERTY
                  </p>
                  <h2>Maintenance overview</h2>
                </div>
                <span className="preview-add">
                  <Plus size={16} />
                </span>
              </div>
              <div className="preview-metrics">
                {[
                  ["08", "Requests"],
                  ["05", "Open"],
                  ["02", "Overdue"],
                ].map(([n, t]) => (
                  <div key={t}>
                    <span>{n}</span>
                    <p>{t}</p>
                  </div>
                ))}
              </div>
              <div className="preview-queue-head">
                <span>Repair queue</span>
                <SlidersHorizontal size={14} />
              </div>
              {[
                ["Kitchen sink leak", "Unit A-101", "High", "Submitted"],
                [
                  "Bathroom tap replacement",
                  "Unit A-202",
                  "Medium",
                  "In progress",
                ],
                ["Water heater inspection", "Unit A-101", "Medium", "Resolved"],
              ].map(([title, unit, priority, status], i) => (
                <div className="preview-row" key={title}>
                  <span className={`preview-request-icon preview-icon-${i}`}>
                    <Wrench size={15} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>
                      {unit} · {priority} priority
                    </p>
                  </div>
                  <span className={`preview-status preview-status-${i}`}>
                    {status}
                  </span>
                </div>
              ))}
              <div className="preview-update">
                <CircleCheck size={17} />
                <span>Repair resolved. Ready for tenant review.</span>
              </div>
            </div>
          </div>
          <div className="preview-caption">
            <span className="status-dot" /> From first report to a job well
            done.
          </div>
        </div>
      </section>
      <section className="principles-strip">
        <div className="wrap">
          {[
            ["01", "A place for every request"],
            ["02", "A person behind every repair"],
            ["03", "A record of what happened"],
          ].map(([n, text]) => (
            <p key={n}>
              <span>{n}</span>
              {text}
            </p>
          ))}
        </div>
      </section>
      <section className="wrap section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE WORKFLOW</p>
            <h2>
              From “something’s broken”
              <br />
              to “all taken care of.”
            </h2>
          </div>
          <p>
            Keep the details that matter close to the work. Explore a complete
            repair lifecycle in the interactive demo.
          </p>
        </div>
        <div className="workflow-grid">
          {[
            [
              ClipboardList,
              "01 / Report",
              "A better first report.",
              "Capture the unit, issue and priority so the team has the context to get started.",
              "/tenant-portal",
              "Explore the tenant experience",
            ],
            [
              Wrench,
              "02 / Coordinate",
              "Keep the work moving.",
              "Review incoming requests, assign the right person and keep updates in one timeline.",
              "/property-managers",
              "See the manager workflow",
            ],
            [
              CircleCheck,
              "03 / Resolve",
              "Finish with confidence.",
              "Record the resolution, review the repair and close the loop. Reopen it when more work is needed.",
              "/features",
              "Follow the full lifecycle",
            ],
          ].map(([Icon, n, title, text, to, link]) => (
            <article key={n} className="workflow-card">
              <div className="flex items-center justify-between">
                <span className="feature-icon">
                  <Icon size={23} />
                </span>
                <span className="small-label">{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link to={to}>
                {link} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="role-section">
        <div className="wrap role-layout">
          <div>
            <p className="eyebrow">SHARED WORK. DIFFERENT PERSPECTIVES.</p>
            <h2>
              Everyone sees
              <br />
              their next step.
            </h2>
            <p className="section-description">
              Try four focused views in one disposable demo. Switch perspectives
              and see how a repair moves between the people involved.
            </p>
            <Link className="text-link" to="/demo">
              Choose your demo role <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="role-list">
            {[
              [
                "Owner / Administrator",
                "The portfolio perspective. Organization settings, reporting and an audit trail.",
              ],
              [
                "Property Manager",
                "The coordination desk. Review issues, assign work and verify progress.",
              ],
              [
                "Tenant",
                "The home perspective. Report issues, follow updates and confirm repairs.",
              ],
              [
                "Contractor / Technician",
                "The workbench. See assigned jobs, report blockers and record resolution.",
              ],
            ].map(([title, text], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap reporting-section">
        <div
          className="report-illustration"
          aria-label="Illustrative active contractor workload"
        >
          <div className="flex items-center justify-between">
            <h3>Workload, at a glance</h3>
            <Clock3 size={19} />
          </div>
          <p>Fictional demo · Active assignments</p>
          {[
            ["Esi Plumbing & Repairs", 3, 100],
            ["Bright Electrical", 1, 33],
          ].map(([name, count, width]) => (
            <div className="workload-row" key={name}>
              <div>
                <span>{name}</span>
                <strong>{count}</strong>
              </div>
              <div className="workload-track">
                <span style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
          <div className="report-note">
            <span className="status-dot" /> Illustrative figures. Demo reports
            use your workspace data.
          </div>
        </div>
        <div>
          <p className="eyebrow">VISIBILITY WITHOUT THE NOISE</p>
          <h2>
            Know where
            <br />
            attention is needed.
          </h2>
          <p className="section-description">
            Review open repairs, overdue work and contractor workload. Explore
            scoped reports as a manager or see the whole fictional portfolio as
            an owner.
          </p>
          <Link to="/reporting" className="text-link">
            Explore reports & analytics <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="wrap faq-section">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>Before you step inside.</h2>
          <Link to="/faq" className="text-link">
            All questions <ArrowRight size={16} />
          </Link>
        </div>
        <div className="faq-list">
          {faqs.slice(0, 4).map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={17} aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <DemoCTA />
    </PublicLayout>
  );
}
