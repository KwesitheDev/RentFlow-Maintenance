import React, { useCallback, useEffect, useState } from "react";
import { UserPlus, Trash2, ShieldCheck, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Input from "../components/Input";
import EmptyState from "../components/EmptyState";
export default function UsersView() {
  const { axiosWithAuth, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers((await axiosWithAuth.get("/users")).data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t load your team. Please retry.",
      );
    } finally {
      setLoading(false);
    }
  }, [axiosWithAuth]);
  useEffect(() => {
    load();
  }, [load]);
  const create = async (e) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    setError("");
    try {
      const r = await axiosWithAuth.post("/users", fields);
      setUsers((prev) => [...prev, r.data]);
      setShowForm(false);
      setSuccess(
        "User created. Arrange secure delivery of their access details directly.",
      );
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "We couldn’t create this user. Please check the details.",
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    setDeleting(true);
    setError("");
    try {
      await axiosWithAuth.delete(`/users/${selected._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== selected._id));
      setSelected(null);
      setSuccess(
        "User removed. Their account can no longer access the workspace.",
      );
    } catch (e) {
      setSelected(null);
      setError(
        e.response?.data?.message ||
          "We couldn’t remove this user. Please retry.",
      );
    } finally {
      setDeleting(false);
    }
  };
  const visible = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const feedback = error && (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      {error}
    </p>
  );
  return (
    <div className="space-y-6">
      <header className="page-heading">
        <div>
          <p className="eyebrow mb-3">Administration</p>
          <h1>People & access</h1>
          <p>Manage the people who keep your maintenance workspace running.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
        >
          <UserPlus size={17} />
          Add a user
        </button>
      </header>
      {!showForm && feedback}
      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {success}
        </p>
      )}
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-4">
        <p className="text-sm font-medium">{users.length} workspace members</p>
        <label className="relative">
          <span className="sr-only">Search people</span>
          <Search
            className="absolute left-3 top-3.5 text-slate-500"
            size={16}
          />
          <input
            className="input !pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email or role"
          />
        </label>
      </div>
      <section
        className="surface overflow-hidden"
        aria-label="Workspace members"
      >
        {loading ? (
          <p role="status" className="p-12 text-center text-sm text-slate-500">
            Loading your team…
          </p>
        ) : error && !users.length ? (
          <EmptyState
            title="Your team couldn’t load"
            description="Please check your connection."
          >
            <button className="btn btn-secondary" onClick={load}>
              Try again
            </button>
          </EmptyState>
        ) : !visible.length ? (
          <EmptyState
            title="No people found"
            description="Try another name or add a user to the workspace."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <caption className="sr-only">
                Workspace users and access roles
              </caption>
              <thead className="bg-[#f6f8f2] text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  {["Person", "Email", "Access", "Actions"].map((t) => (
                    <th scope="col" key={t} className="px-6 py-4">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="app-avatar">
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                        <span className="font-medium">
                          {u.name}
                          {u._id === (user?._id || user?.id) && (
                            <span className="ml-2 text-xs text-slate-500">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500">
                      {u.email}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`badge ${u.role === "admin" ? "bg-teal-50 text-teal-800" : "bg-slate-100 text-slate-600"}`}
                      >
                        <ShieldCheck size={13} />
                        {u.role === "admin" ? "Administrator" : "Manager"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        className="icon-button text-red-700"
                        aria-label={`Remove ${u.name}`}
                        disabled={u._id === (user?._id || user?.id)}
                        onClick={() => setSelected(u)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="text-xs leading-6 text-slate-500">
        Administrators manage users. Managers work with maintenance requests.
        Email invitations are not currently configured.
      </p>
      {showForm && (
        <Modal
          title="Add a workspace user"
          description="Create an account for a trusted team member. Access details must be shared securely outside RentFlow."
          onClose={() => setShowForm(false)}
          busy={saving}
        >
          {feedback}
          <form className="mt-4 space-y-4" onSubmit={create}>
            <Input
              name="name"
              label="Full name"
              required
              maxLength={100}
              autoComplete="name"
            />
            <Input
              name="email"
              label="Email address"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
            />
            <Input
              name="password"
              label="Initial password"
              type="password"
              required
              minLength={12}
              autoComplete="new-password"
              hint="Use at least 12 characters and deliver it privately."
            />
            <label className="block text-sm font-medium">
              Role
              <select name="role" className="input mt-2">
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={saving}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Creating…" : "Create user"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <ConfirmModal
        isOpen={!!selected}
        title="Remove workspace access?"
        message={
          <>
            Remove <strong>{selected?.name}</strong> from the workspace? This
            deletes their account and cannot be undone.
          </>
        }
        onCancel={() => setSelected(null)}
        onConfirm={remove}
        loading={deleting}
        confirmText="Remove user"
      />
    </div>
  );
}
