import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";
import AuthShell from "../components/AuthShell";
import Input from "../components/Input";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, axiosWithAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosWithAuth.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/app/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="New workspace"
      title="Create your account"
      subtitle="The first workspace user becomes admin. Later signups start as managers and can be promoted by an admin."
      footer={
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      }
    >
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full name"
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            required
            onChange={handleChange}
            inputClassName="h-11"
          />

          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            required
            onChange={handleChange}
            inputClassName="h-11"
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            required
            minLength={6}
            onChange={handleChange}
            inputClassName="h-11"
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary flex w-full items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {!loading && <UserPlus className="h-4 w-4" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
    </AuthShell>
  );
}
