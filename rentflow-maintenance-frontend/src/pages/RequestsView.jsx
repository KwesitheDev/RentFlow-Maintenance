import React, { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";

const initialForm = {
  tenantName: "",
  property: "",
  issueDescription: "",
  priority: "medium",
  status: "pending",
  assignedTo: "",
};

const priorityRank = { high: 3, medium: 2, low: 1 };
const statusRank = { pending: 3, inProgress: 2, resolved: 1 };

export default function RequestsView() {
  const { axiosWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const fetchRequests = async () => {
    setError("");
    try {
      const res = await axiosWithAuth.get("/requests");
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "priority") {
        aVal = priorityRank[aVal];
        bVal = priorityRank[bVal];
      }

      if (sortConfig.key === "status") {
        aVal = statusRank[aVal];
        bVal = statusRank[bVal];
      }

      if (sortConfig.key === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [requests, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await axiosWithAuth.post("/requests", form);
      setRequests((prev) => [res.data, ...prev]);
      setForm(initialForm);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (request, status) => {
    try {
      const res = await axiosWithAuth.put(`/requests/${request._id}`, {
        ...request,
        status,
      });
      setRequests((prev) =>
        prev.map((item) => (item._id === request._id ? res.data : item)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update request");
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return (
      <span className={`rounded-md border px-2 py-1 text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Wrench className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Maintenance Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, sort, assign, and progress repair work.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={fetchRequests} className="btn btn-secondary inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">New maintenance request</h2>
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label="Tenant name"
                name="tenantName"
                value={form.tenantName}
                required
                onChange={handleChange}
              />
              <Input
                label="Property"
                name="property"
                value={form.property}
                required
                onChange={handleChange}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Issue description"
                  name="issueDescription"
                  value={form.issueDescription}
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="input mt-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Input
                label="Assigned to"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="Optional"
              />
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? "Creating..." : "Create request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                {[
                  ["tenantName", "Tenant"],
                  ["property", "Property"],
                  ["issueDescription", "Issue"],
                  ["priority", "Priority"],
                  ["status", "Status"],
                  ["assignedTo", "Assigned To"],
                  ["createdAt", "Date Created"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer whitespace-nowrap px-5 py-3 hover:bg-slate-100"
                  >
                    {label} {getArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sortedRequests.map((req) => (
                <tr key={req._id} className="text-sm hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                    {req.tenantName}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{req.property}</td>
                  <td className="min-w-64 px-5 py-4 text-slate-600">
                    {req.issueDescription}
                  </td>
                  <td className="px-5 py-4">{getPriorityBadge(req.priority)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req, e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="inProgress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {req.assignedTo || "Unassigned"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
