import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || "https://rentflow-maintenance-backend.onrender.com/api"}/demo`,
  timeout: 65000,
});
const roles = {
  admin: [
    "Owner / Administrator",
    "Organization settings, portfolio reporting and audit history.",
  ],
  manager: [
    "Property Manager",
    "Triage requests, assign contractors and verify completed repairs for Palm Court.",
  ],
  tenant: [
    "Tenant",
    "Report issues in your unit, track updates and confirm or reopen repairs.",
  ],
  contractor: [
    "Contractor / Technician",
    "View assigned jobs, report blockers and record resolution details.",
  ],
};
const transitions = {
  submitted: ["reviewed", "cancelled"],
  reviewed: ["assigned", "cancelled"],
  assigned: ["inProgress", "onHold"],
  inProgress: ["resolved", "onHold"],
  onHold: ["inProgress", "cancelled"],
  resolved: ["closed", "reopened"],
  closed: ["reopened"],
  reopened: ["reviewed", "inProgress"],
};
const label = (s) =>
  s === "inProgress" ? "In progress" : s.charAt(0).toUpperCase() + s.slice(1);
export default function Demo() {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("rentflow-demo"),
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    if (!token) return;
    let active = true;
    api
      .get("/workspace", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (active) setData(r.data);
      })
      .catch((e) => {
        if (active) {
          setError(
            e.response?.data?.message ||
              "Demo server unavailable. Please retry.",
          );
          if (e.response?.status === 401) {
            sessionStorage.removeItem("rentflow-demo");
            setToken(null);
            setData(null);
          }
        }
      });
    return () => {
      active = false;
    };
  }, [token]);
  async function action(fn) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      if (token) {
        const r = await api.get("/workspace", { headers });
        setData(r.data);
      }
      setNotice("Saved successfully.");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Cannot reach the demo server. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function launch(role) {
    await action(async () => {
      const r = await api.post("/sessions", { role });
      sessionStorage.setItem("rentflow-demo", r.data.token);
      setToken(r.data.token);
    });
  }
  const manage = data && ["admin", "manager"].includes(data.role);
  const current = data?.requests.find((r) => r.id === selected);
  async function update(r, payload) {
    await action(() =>
      api.patch(
        `/requests/${r.id}`,
        { version: r.version, ...payload },
        { headers },
      ),
    );
  }
  function exportReport() {
    const rows = [
      ["Reference", "Title", "Status", "Priority", "Created"],
      ...data.requests.map((r) => [
        r.reference,
        r.title,
        r.status,
        r.priority,
        r.createdAt,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value)
                .replace(/^[=+@\-\t\r]/, "'$&")
                .replaceAll('"', '""')}"`,
          )
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "rentflow-demo-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  const inputClass =
    "w-full rounded border border-slate-300 bg-white p-3 text-slate-900";
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-blue-700">
            RentFlow
          </Link>
          <h1 className="text-2xl font-semibold">
            Explore the maintenance demo
          </h1>
          <Link to="/login">Customer sign in</Link>
        </header>
        <p className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          Fictional data · Private disposable workspace · Expires after one
          hour. Switch roles to follow the same repair from submission through
          closure. External invitations, email, uploads and production access
          are disabled.
        </p>
        {error && (
          <p
            role="alert"
            className="rounded border border-red-300 bg-red-50 p-4"
          >
            {error}
          </p>
        )}
        {notice && <p role="status">{notice}</p>}
        {!token ? (
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              Choose your perspective. No signup required.
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(roles).map(([role, [name, description]]) => (
                <article
                  className="rounded-xl border bg-white p-6 shadow-sm"
                  key={role}
                >
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="my-4 text-slate-600">{description}</p>
                  <button
                    disabled={busy}
                    className="btn btn-primary"
                    onClick={() => launch(role)}
                  >
                    {busy ? "Starting demo…" : `Launch ${name} demo`}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : !data ? (
          <div>
            <p role="status">
              Loading your demo workspace… A sleeping server may take a minute
              to start.
            </p>
            {error && (
              <button
                className="btn border"
                onClick={() => {
                  sessionStorage.removeItem("rentflow-demo");
                  setToken(null);
                  setError("");
                }}
              >
                Choose a new workspace
              </button>
            )}
          </div>
        ) : (
          <>
            <section className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
              <div className="mr-auto">
                <h2 className="font-semibold">{data.organization.name}</h2>
                <p>
                  {data.actor.name} · Expires{" "}
                  {new Date(data.expiresAt).toLocaleTimeString()}
                </p>
              </div>
              <label>
                Perspective
                <select
                  aria-label="Demo role"
                  className={inputClass}
                  disabled={busy}
                  value={data.role}
                  onChange={(e) => {
                    setSelected(null);
                    action(() =>
                      api.post("/role", { role: e.target.value }, { headers }),
                    );
                  }}
                >
                  {Object.entries(roles).map(([key, [name]]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn border"
                disabled={busy}
                onClick={() => {
                  setSelected(null);
                  action(() => api.post("/reset", {}, { headers }));
                }}
              >
                Reset workspace
              </button>
              <button
                className="btn border"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await api.delete("/session", { headers });
                  } catch (_) {
                    /* local exit also works after expiry */
                  }
                  sessionStorage.removeItem("rentflow-demo");
                  setToken(null);
                  setData(null);
                  setSelected(null);
                  setBusy(false);
                }}
              >
                Exit demo
              </button>
            </section>
            <p>{roles[data.role][1]}</p>
            <p className="text-sm text-slate-600">
              Lifecycle guide: Tenant submits → Manager reviews and assigns →
              Contractor starts and resolves → Tenant confirms closure. Switch
              perspectives above after each step.
            </p>
            {manage && (
              <section
                aria-label="Operational report"
                className="rounded-xl border bg-white p-5"
              >
                <h2 className="text-xl font-semibold">
                  Operational report · Your permitted properties
                </h2>
                <dl className="my-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                  {Object.entries(data.report)
                    .filter(([, value]) => typeof value === "number")
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt>{label(key).replace(/([A-Z])/g, " $1")}</dt>
                        <dd className="text-2xl font-bold">
                          {key === "completionRate"
                            ? `${(value * 100).toFixed(0)}%`
                            : value.toFixed(1).replace(".0", "")}
                        </dd>
                      </div>
                    ))}
                </dl>
                <p className="text-sm">
                  Completion rate: closed / non-cancelled requests. Resolution
                  hours: mean creation-to-resolution duration for currently
                  resolved or closed requests. Overdue: active requests past
                  their due date.
                </p>
                <div className="my-3 grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold">By priority</h3>
                    {Object.entries(data.report.byPriority).map(
                      ([p, count]) => (
                        <p key={p}>
                          {label(p)}: {count}
                        </p>
                      ),
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">By property</h3>
                    {data.report.byProperty.map((p) => (
                      <p key={p.name}>
                        {p.name}: {p.count}
                      </p>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Active contractor workload
                    </h3>
                    {data.report.workload.map((p) => (
                      <p key={p.name}>
                        {p.name}: {p.count}
                      </p>
                    ))}
                  </div>
                </div>
                <button className="btn border" onClick={exportReport}>
                  Export visible requests (CSV)
                </button>{" "}
                <button className="btn border" onClick={() => window.print()}>
                  Print report
                </button>
              </section>
            )}
            {data.role === "admin" && (
              <form
                className="rounded-xl border bg-white p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = new FormData(e.currentTarget).get("name");
                  action(() =>
                    api.post("/organization", { name }, { headers }),
                  );
                }}
              >
                <label>
                  Organization display name
                  <input
                    className={inputClass}
                    name="name"
                    required
                    minLength={3}
                    maxLength={100}
                    defaultValue={data.organization.name}
                  />
                </label>
                <button className="btn border mt-3" disabled={busy}>
                  Save organization
                </button>
                <p className="mt-2 text-sm">
                  Account creation, permission changes and invitations are
                  restricted in this public demo.
                </p>
              </form>
            )}
            <section className="rounded-xl border bg-white p-5">
              <h2 className="text-xl font-semibold">Properties & units</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {data.properties.map((p) => (
                  <article key={p.id} className="rounded border p-3">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p>
                      {data.units
                        .filter((u) => u.property === p.id)
                        .map((u) => u.name)
                        .join(", ")}
                    </p>
                  </article>
                ))}
              </div>
              {manage && (
                <p className="mt-3 text-sm">
                  Team:{" "}
                  {data.people.map((p) => `${p.name} (${p.role})`).join(" · ")}
                </p>
              )}
              {manage && (
                <form
                  className="mt-4 grid gap-3 md:grid-cols-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const payload = Object.fromEntries(new FormData(form));
                    action(async () => {
                      await api.post("/properties", payload, { headers });
                      form.reset();
                    });
                  }}
                >
                  <label>
                    New property name
                    <input
                      className={inputClass}
                      name="name"
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Initial unit
                    <input
                      className={inputClass}
                      name="unitName"
                      required
                      maxLength={40}
                    />
                  </label>
                  <button className="btn border" disabled={busy}>
                    Create property & unit
                  </button>
                </form>
              )}
            </section>
            {(manage || data.role === "tenant") && (
              <section className="rounded-xl border bg-white p-5">
                <h2 className="mb-4 text-xl font-semibold">
                  Submit a maintenance request
                </h2>
                <form
                  className="grid gap-3 md:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const payload = Object.fromEntries(new FormData(form));
                    action(async () => {
                      const r = await api.post("/requests", payload, {
                        headers,
                      });
                      form.reset();
                      setSelected(r.data.id);
                    });
                  }}
                >
                  <label>
                    Unit
                    <select className={inputClass} name="unit" required>
                      {data.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {
                            data.properties.find((p) => p.id === u.property)
                              ?.name
                          }{" "}
                          · {u.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Category
                    <select className={inputClass} name="category">
                      {["Plumbing", "Electrical", "General repair"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title
                    <input
                      className={inputClass}
                      name="title"
                      required
                      minLength={3}
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Priority
                    <select className={inputClass} name="priority">
                      {["low", "medium", "high"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="md:col-span-2">
                    Description
                    <textarea
                      className={inputClass}
                      name="description"
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                  </label>
                  <button className="btn btn-primary" disabled={busy}>
                    Submit request
                  </button>
                </form>
              </section>
            )}
            <section className="rounded-xl border bg-white p-5">
              <h2 className="mb-4 text-xl font-semibold">
                {data.role === "contractor"
                  ? "Assigned work"
                  : data.role === "tenant"
                    ? "My requests"
                    : "Maintenance queue"}
              </h2>
              <div className="mb-4 flex flex-wrap gap-3">
                <label>
                  Search
                  <input
                    className={inputClass}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  Status
                  <select
                    className={inputClass}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    {Object.keys(transitions).map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      {[
                        "Reference / issue",
                        "Priority",
                        "Status",
                        "Due",
                        "Details",
                      ].map((s) => (
                        <th className="p-3" key={s}>
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests
                      .filter(
                        (r) =>
                          (!statusFilter || r.status === statusFilter) &&
                          `${r.reference} ${r.title}`
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                      )
                      .map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="p-3">
                            {r.reference}
                            <br />
                            {r.title}
                          </td>
                          <td className="p-3">{r.priority}</td>
                          <td className="p-3">{label(r.status)}</td>
                          <td className="p-3">
                            {new Date(r.dueAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <button
                              className="text-blue-700 underline"
                              onClick={() => setSelected(r.id)}
                            >
                              Open {r.reference}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {data.requests.length === 0 && (
                  <p>No requests available for this perspective.</p>
                )}
              </div>
            </section>
            {current && (
              <section
                aria-label="Request details"
                className="rounded-xl border border-blue-300 bg-white p-5"
              >
                <h2 className="text-xl font-semibold">
                  {current.reference} · {current.title}
                </h2>
                <p className="my-2">{current.description}</p>
                <p>
                  {label(current.status)} · {current.category} · Assigned:{" "}
                  {data.people.find((p) => p.id === current.assignedTo)?.name ||
                    "Unassigned"}
                </p>
                {current.resolution && (
                  <p className="my-2">Resolution: {current.resolution}</p>
                )}
                {manage &&
                  ["reviewed", "assigned", "inProgress", "onHold"].includes(
                    current.status,
                  ) && (
                    <form
                      className="my-4 flex flex-wrap gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const assignedTo = new FormData(e.currentTarget).get(
                          "assignedTo",
                        );
                        update(current, {
                          assignedTo,
                          ...(current.status === "reviewed"
                            ? { status: "assigned" }
                            : {}),
                        });
                      }}
                    >
                      <label>
                        Assign contractor
                        <select className={inputClass} name="assignedTo">
                          {data.people
                            .filter((p) => p.role === "contractor")
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <button className="btn border" disabled={busy}>
                        Assign work
                      </button>
                    </form>
                  )}
                <form
                  key={`${current.id}-${current.version}`}
                  className="my-4 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fields = Object.fromEntries(
                      new FormData(e.currentTarget),
                    );
                    const payload = {};
                    if (fields.status) payload.status = fields.status;
                    if (fields.note) {
                      payload.note = fields.note;
                      payload.internal = fields.internal === "on";
                    }
                    if (fields.status === "resolved")
                      payload.resolution = fields.resolution;
                    update(current, payload);
                  }}
                >
                  <label>
                    Update status
                    <select className={inputClass} name="status">
                      <option value="">Keep current status</option>
                      {(transitions[current.status] || [])
                        .filter(
                          (s) =>
                            s !== "assigned" &&
                            (manage ||
                              (data.role === "tenant"
                                ? ["closed", "reopened"]
                                : ["inProgress", "onHold", "resolved"]
                              ).includes(s)),
                        )
                        .map((s) => (
                          <option key={s} value={s}>
                            {label(s)}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Resolution details (required to resolve)
                    <textarea
                      name="resolution"
                      maxLength={2000}
                      className={inputClass}
                    />
                  </label>
                  <label>
                    Update / comment
                    <textarea
                      name="note"
                      maxLength={2000}
                      className={inputClass}
                    />
                  </label>
                  {manage && (
                    <label>
                      <input name="internal" type="checkbox" /> Internal note
                      (hidden from tenant and contractor)
                    </label>
                  )}
                  <button disabled={busy} className="btn btn-primary">
                    Save update
                  </button>
                </form>
                <h3 className="font-semibold">Activity history</h3>
                <ol className="mt-3 space-y-3">
                  {current.activity.map((a, i) => (
                    <li className="border-l-2 pl-3" key={i}>
                      <time>{new Date(a.at).toLocaleString()}</time> · {a.actor}
                      <p>
                        {a.text}
                        {a.internal ? " (internal)" : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <section className="rounded-xl border bg-white p-5">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button
                className="btn border my-3"
                disabled={busy}
                onClick={() =>
                  action(() => api.post("/notifications/read", {}, { headers }))
                }
              >
                Mark all read
              </button>
              {data.notifications.length ? (
                <ul className="space-y-2">
                  {data.notifications
                    .slice(-20)
                    .reverse()
                    .map((n) => (
                      <li key={n.id}>
                        {n.read ? "Read" : "New"} · {n.text} ·{" "}
                        {new Date(n.at).toLocaleString()}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>Updates from your workflow will appear here.</p>
              )}
            </section>
            {data.role === "admin" && (
              <section className="rounded-xl border bg-white p-5">
                <h2 className="text-xl font-semibold">
                  Organization audit trail
                </h2>
                <ul>
                  {data.audit
                    .slice(-20)
                    .reverse()
                    .map((a, i) => (
                      <li key={i}>
                        {a.at} · {a.actor} · {a.text}
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
