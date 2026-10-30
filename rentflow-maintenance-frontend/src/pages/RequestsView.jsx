import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  ArrowDownUp,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
const initial = {
  tenantName: "",
  property: "",
  issueDescription: "",
  priority: "medium",
  status: "pending",
  assignedTo: "",
};
const date = (value) =>
  value && !Number.isNaN(Date.parse(value))
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export default function RequestsView() {
  const { axiosWithAuth } = useAuth();
  const [params, setParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(params.has("new"));
  const [selected, setSelected] = useState(params.get("request"));
  const [form, setForm] = useState(initial);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState(params.get("priority") || "");
  const [property, setProperty] = useState(params.get("property") || "");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "createdAt", direction: "desc" });
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRequests((await axiosWithAuth.get("/requests")).data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t load requests. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [axiosWithAuth]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [search, status, priority, property]);
  const filtered = useMemo(
    () =>
      requests
        .filter(
          (r) =>
            (!status || r.status === status) &&
            (!priority || r.priority === priority) &&
            (!property || r.property === property) &&
            `${r.tenantName} ${r.property} ${r.issueDescription} ${r.assignedTo}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          const rank = { high: 3, medium: 2, low: 1 };
          const value = (r) =>
            sort.key === "priority"
              ? rank[r.priority]
              : sort.key === "createdAt"
                ? Date.parse(r.createdAt) || 0
                : String(r[sort.key] || "").toLowerCase();
          const av = value(a),
            bv = value(b);
          return (
            (av < bv ? -1 : av > bv ? 1 : 0) *
            (sort.direction === "asc" ? 1 : -1)
          );
        }),
    [requests, search, status, priority, property, sort],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const current = requests.find((r) => r._id === selected);
  const close = () => {
    setSelected(null);
    setShowForm(false);
    setError("");
    setParams({}, { replace: true });
  };
  const update = async (request, payload) => {
    setUpdating(request._id);
    setError("");
    setSuccess("");
    try {
      const r = await axiosWithAuth.put(`/requests/${request._id}`, payload);
      setRequests((prev) =>
        prev.map((item) => (item._id === request._id ? r.data : item)),
      );
      setSuccess("Request updated.");
      return true;
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t save the update. Your changes are still here.",
      );
      return false;
    } finally {
      setUpdating("");
    }
  };
  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const r = await axiosWithAuth.post("/requests", form);
      setRequests((prev) => [r.data, ...prev]);
      setForm(initial);
      setShowForm(false);
      setSelected(r.data._id);
      setSuccess("Request created. You can track it in the maintenance queue.");
      setParams({}, { replace: true });
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t create the request. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setProperty("");
  };
  const feedback = error && (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
    >
      {error}
    </p>
  );
  return (
    <div className="space-y-6">
      <header className="page-heading">
        <div>
          <p className="eyebrow mb-3">Operations</p>
          <h1>Maintenance requests</h1>
          <p>Every issue, its owner and the next step. Keep the work moving.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            disabled={loading || !!updating}
            aria-label="Refresh requests"
            onClick={load}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
          >
            <Plus size={16} />
            New request
          </button>
        </div>
      </header>
      {!showForm && !current && feedback}
      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {success}
        </p>
      )}
      <section aria-label="Request filters" className="surface p-4">
        <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="text-xs font-medium text-slate-500">
            Search requests
            <span className="relative mt-2 block">
              <Search
                size={16}
                className="absolute left-3 top-3.5 text-slate-500"
                aria-hidden="true"
              />
              <input
                className="input !pl-9"
                placeholder="Issue, tenant, property or assignee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
          </label>
          <label className="text-xs font-medium text-slate-500">
            Status
            <select
              className="input mt-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>
          <label className="text-xs font-medium text-slate-500">
            Priority
            <select
              className="input mt-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All priorities</option>
              {["high", "medium", "low"].map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-500">
            Property
            <select
              className="input mt-2"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            >
              <option value="">All properties</option>
              {[...new Set(requests.map((r) => r.property))].sort().map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section
        className="surface overflow-hidden"
        aria-label="Maintenance queue"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold">
            Request queue{" "}
            <span className="ml-2 text-xs font-normal text-slate-500">
              {loading ? "Loading…" : `${filtered.length} results`}
            </span>
          </h2>
          {(search || status || priority || property) && (
            <button
              className="text-xs font-medium text-teal-800 underline"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>
        {loading ? (
          <p role="status" className="p-10 text-center text-sm text-slate-500">
            Loading requests…
          </p>
        ) : error && !requests.length ? (
          <EmptyState
            title="Your queue couldn’t load"
            description="Check your connection and try again."
          >
            <button className="btn btn-secondary" onClick={load}>
              Retry connection
            </button>
          </EmptyState>
        ) : !filtered.length ? (
          <EmptyState
            title={
              requests.length
                ? "No matching requests"
                : "A clear queue, ready for work"
            }
            description={
              requests.length
                ? "Try another search or clear the filters to see more repairs."
                : "Create a request with the issue details, property and priority."
            }
          >
            {requests.length ? (
              <button className="btn btn-secondary" onClick={resetFilters}>
                Clear filters
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create your first request
              </button>
            )}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <caption className="sr-only">
                  Maintenance requests. Open a request to view details or update
                  its assignment.
                </caption>
                <thead className="border-b border-slate-100 bg-[#f7f9f4] text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    {[
                      ["issueDescription", "Request"],
                      ["property", "Property / tenant"],
                      ["priority", "Priority"],
                      ["status", "Status"],
                      ["assignedTo", "Assignee"],
                      ["createdAt", "Created"],
                    ].map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={
                          sort.key === key
                            ? sort.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className="px-5 py-4"
                      >
                        <button
                          className="flex items-center gap-2 text-left"
                          onClick={() =>
                            setSort({
                              key,
                              direction:
                                sort.key === key && sort.direction === "asc"
                                  ? "desc"
                                  : "asc",
                            })
                          }
                        >
                          {label}
                          <ArrowDownUp size={12} aria-hidden="true" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r) => (
                    <tr key={r._id} className="hover:bg-[#f8faf5]">
                      <td className="max-w-xs px-5 py-5">
                        <button
                          className="line-clamp-2 text-left text-sm font-medium text-teal-900 hover:underline"
                          onClick={() => {
                            setError("");
                            setSuccess("");
                            setSelected(r._id);
                          }}
                        >
                          {r.issueDescription}
                        </button>
                      </td>
                      <td className="px-5 py-5">
                        <p className="text-xs">{r.property}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {r.tenantName}
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge status={r.priority} />
                      </td>
                      <td className="px-5 py-5">
                        <select
                          aria-label={`Status for ${r.issueDescription}`}
                          className="min-h-11 rounded-lg border border-slate-200 bg-white px-2 text-xs"
                          disabled={!!updating}
                          value={r.status}
                          onChange={(e) =>
                            update(r, { status: e.target.value })
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="inProgress">In progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-5 py-5 text-xs text-slate-500">
                        {r.assignedTo || "Unassigned"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-xs text-slate-500">
                        {date(r.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
              <span>
                {(currentPage - 1) * 12 + 1}–
                {Math.min(currentPage * 12, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-3">
                <button
                  className="icon-button !h-9 !w-9"
                  disabled={currentPage === 1}
                  aria-label="Previous request page"
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  className="icon-button !h-9 !w-9"
                  disabled={currentPage >= pageCount}
                  aria-label="Next request page"
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      <p className="text-xs text-slate-500">
        Showing up to 500 recent requests. Search and filters apply to this
        loaded queue.
      </p>
      {showForm && (
        <Modal
          title="New maintenance request"
          description="Add the details your team needs to get started. Fields marked * are required."
          onClose={close}
          busy={saving}
        >
          {feedback}
          <form onSubmit={create} className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["tenantName", "Tenant name"],
              ["property", "Property"],
            ].map(([name, label]) => (
              <Input
                key={name}
                name={name}
                label={label}
                required
                maxLength={200}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
            ))}
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Issue description *
              <textarea
                className="input mt-2 min-h-28"
                name="issueDescription"
                required
                maxLength={2000}
                placeholder="What needs repairing? Include the location and any useful details."
                value={form.issueDescription}
                onChange={(e) =>
                  setForm({ ...form, issueDescription: e.target.value })
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Priority
              <select
                className="input mt-2"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {["low", "medium", "high"].map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Assigned to"
              name="assignedTo"
              maxLength={200}
              hint="Leave blank if the request needs triage."
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            />
            <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={saving}
                onClick={close}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Creating…" : "Create request"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {current && (
        <Modal
          title="Request details"
          description={`${current.property} · ${current.tenantName} · Created ${date(current.createdAt)}`}
          onClose={close}
          busy={!!updating}
        >
          {feedback}
          <p className="mb-4 whitespace-pre-wrap text-sm leading-7">
            {current.issueDescription}
          </p>
          <div className="mb-6 flex gap-2">
            <StatusBadge status={current.status} />
            <StatusBadge status={current.priority} />
          </div>
          <form
            key={
              current._id +
              current.updatedAt +
              current.status +
              (current.notes?.length || 0)
            }
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const fields = Object.fromEntries(new FormData(e.currentTarget));
              const payload = {
                assignedTo: fields.assignedTo,
                priority: fields.priority,
              };
              if (fields.note.trim())
                payload.notes = [...(current.notes || []), fields.note.trim()];
              if (await update(current, payload)) setSelected(null);
            }}
          >
            <Input
              name="assignedTo"
              label="Responsible person"
              maxLength={200}
              defaultValue={current.assignedTo}
              placeholder="Assign a team member"
            />
            <label className="text-sm font-medium">
              Priority
              <select
                name="priority"
                className="input mt-2"
                defaultValue={current.priority}
              >
                {["low", "medium", "high"].map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Add a note
              <textarea
                className="input mt-2 min-h-24"
                name="note"
                maxLength={2000}
                placeholder="Add context or a progress update"
              />
            </label>
            <button
              className="btn btn-primary justify-self-end"
              disabled={!!updating}
            >
              {updating ? "Saving…" : "Save changes"}
            </button>
          </form>
          <h3 className="mb-3 mt-7 text-sm font-semibold">Request notes</h3>
          {current.notes?.length ? (
            <ol className="space-y-3">
              {current.notes.map((note, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm leading-6"
                >
                  {note}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-500">
              No notes yet. Updates help your team keep the context.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
