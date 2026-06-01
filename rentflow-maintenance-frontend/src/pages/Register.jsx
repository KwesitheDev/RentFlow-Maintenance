import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Wrench } from "lucide-react";
import Card from "../components/Card";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-10">
      <Link to="/" className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Wrench className="h-5 w-5" />
        </span>
        <span className="text-3xl font-semibold text-slate-950">RentFlow</span>
      </Link>

      <Card className="w-full max-w-md border-slate-200 p-6 shadow-xl sm:p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">
            The first workspace user becomes admin; later signups become managers.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
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

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
