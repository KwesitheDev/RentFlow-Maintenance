import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { axiosWithAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosWithAuth.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.resetToken) setResetToken(res.data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create reset code");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosWithAuth.post("/auth/reset-password", {
        email,
        resetToken,
        newPassword,
      });
      setMessage(`${res.data.message}. You can now sign in.`);
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-lg border-slate-200 p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create a reset code, then set a new account password.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={requestCode} className="space-y-4">
          <Input
            label="Account email"
            name="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button type="submit" disabled={loading} className="btn btn-secondary w-full">
            {loading ? "Creating code..." : "Create reset code"}
          </button>
        </form>

        <div className="my-6 border-t border-slate-200" />

        <form onSubmit={resetPassword} className="space-y-4">
          <Input
            label="Reset code"
            name="resetToken"
            value={resetToken}
            required
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Paste your reset code"
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            value={newPassword}
            required
            minLength={6}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Updating password..." : "Update password"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            Codes expire in 15 minutes
          </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
