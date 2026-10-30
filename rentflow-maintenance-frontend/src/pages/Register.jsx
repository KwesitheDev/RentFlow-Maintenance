import React from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
export default function Register() {
  return (
    <AuthShell
      eyebrow="Customer access"
      title="Let’s find the right way in."
      subtitle="Public account creation is currently closed. If your team already uses RentFlow, ask your administrator to arrange access."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-teal-800" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="surface p-6">
        <h2 className="font-semibold">Want to see how it works?</h2>
        <p className="mb-5 mt-2 text-sm leading-7 text-slate-500">
          Explore every demo role without creating an account or supplying
          personal information.
        </p>
        <Link className="btn btn-primary" to="/demo">
          Explore the demo
        </Link>
      </div>
      <Link className="text-link mt-6" to="/contact">
        Discuss your workflow →
      </Link>
    </AuthShell>
  );
}
