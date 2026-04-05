import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
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
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-50 to-white px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-sans tracking-tight">
          <span
            className="text-transparent font-semibold bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #A78BFA, #C4B5FD)",
            }}
          >
            Rent
          </span>
          <span
            className="text-transparent font-bold bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #7F00FF, #C084FC, #A78BFA)",
            }}
          >
            Flow
          </span>
        </h2>
        <p className="text-gray-600 mt-2">Maintenance Request Tracker</p>
      </div>

      {/* Card */}
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-lg rounded-2xl bg-white mb-10">
        <div className=" mb-3">
          <h2 className="text-2xl  font-semibold text-gray-900">
            Create account
          </h2>
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
            onChange={handleChange}
          />

          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="●●●●●●●●"
            value={form.password}
            onChange={handleChange}
          />

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
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
