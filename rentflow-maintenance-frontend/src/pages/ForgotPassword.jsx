import React from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
export default function ForgotPassword() {
  return (
    <AuthShell
      eyebrow="Account help"
      title="Let’s get you back in."
      subtitle="Contact your property or organization administrator for help recovering access to your existing account."
      footer={
        <p>
          Remembered your password?{" "}
          <Link className="font-semibold text-teal-800" to="/login">
            Back to sign in
          </Link>
        </p>
      }
    >
      <section className="surface space-y-4 p-6">
        <h2 className="font-semibold">Before you contact your team</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">
          <li>
            Check that you are using the email address associated with your
            account.
          </li>
          <li>Check your password manager and keyboard’s Caps Lock setting.</li>
          <li>
            Never share your password or a recovery code in public project
            issues.
          </li>
        </ul>
        <p className="border-t border-slate-200 pt-4 text-xs leading-6 text-slate-500">
          Self-service email recovery is not currently available. This page does
          not request or expose account recovery secrets.
        </p>
      </section>
      <Link to="/demo" className="text-link mt-6">
        Looking for the demo? Step inside →
      </Link>
    </AuthShell>
  );
}
