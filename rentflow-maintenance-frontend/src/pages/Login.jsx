import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { LogIn } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, axiosWithAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosWithAuth.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
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
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-lg rounded-2xl bg-white ">
        <div className=" mb-3">
          <h2 className="font-semibold text-lg text-gray-900">Sign In</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="●●●●●●●●"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create Account
          </Link>
        </p>
      </Card>
      {/* {Demo Credentials} */}
      <Card className="mt-6 w-full max-w-md text-blue-500 bg-gradient-to-bl from-indigo-50 to-white p-4 rounded-lg shadow-sm">
        <p className="mb-1 text-sm text-indigo-500">Demo Credentials:</p>
        <p className="text-sm font-medium">
          Admin:{" "}
          <span className="font-mono text-xs">
            {" "}
            <span className="font-semibold">email:</span> admin@rentflow
          </span>
          {"  "}
          <span className="font-mono text-xs">
            <span className="font-semibold">/ password:</span> admin123
          </span>
          <br />
          <span className="">Manager:</span>{" "}
          <span className="font-mono text-xs">
            <span className="font-semibold">email:</span> manager@rentflow
          </span>
          <span className=" ml-1 text-xs">
            <span className="font-semibold">/ password:</span> manager123
          </span>
        </p>
      </Card>
    </div>
  );
}
