import React, { useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import { Bell, Shield, User } from "lucide-react";

const Settings = () => {
  const { user, axiosWithAuth, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setUpdating(true);

    try {
      const res = await axiosWithAuth.put("/auth/profile", profile);
      updateUser(res.data.user);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setChangingPassword(true);

    try {
      await axiosWithAuth.post("/auth/change-password", passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profile, password, and notification preferences.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User size={20} />
            <span className="font-semibold text-lg">Profile Information</span>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <Input
              type="text"
              name="name"
              label="Full Name"
              value={profile.name}
              required
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              type="email"
              name="email"
              label="Email"
              value={profile.email}
              required
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <button className="btn btn-primary" type="submit" disabled={updating}>
              {updating ? "Updating..." : "Update profile"}
            </button>
          </form>
        </Card>

        <Card className="border-slate-200 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Shield size={20} />
            <span className="font-semibold text-lg">Account & Security</span>
          </div>
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-800 mb-2">Role</p>
            <span
              className={`inline-block rounded-md border px-3 py-1 text-sm font-medium ${
                user?.role === "admin"
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              {user?.role === "admin" ? "Administrator" : "Manager"}
            </span>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              label="Current password"
              value={passwordForm.currentPassword}
              required
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
            <Input
              type="password"
              name="newPassword"
              label="New password"
              value={passwordForm.newPassword}
              required
              minLength={6}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={changingPassword}
            >
              {changingPassword ? "Changing..." : "Change password"}
            </button>
          </form>
        </Card>
      </div>

      <Card className="border-slate-200 p-6 shadow-sm">
        <div className="flex gap-2 items-center">
          <Bell size={20} />
          <span className="font-semibold text-lg">Notifications</span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input type="checkbox" className="h-4 w-4" defaultChecked />
            <span className="text-sm text-gray-700">Email request updates</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm text-gray-700">Urgent request alerts</span>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
