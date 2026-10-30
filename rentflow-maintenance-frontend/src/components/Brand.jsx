import React from "react";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
export default function Brand({ light = false }) {
  return (
    <Link
      to="/"
      aria-label="RentFlow home"
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <span className="brand-mark">
        <Wrench size={20} strokeWidth={2.3} aria-hidden="true" />
      </span>
      <span>
        rentflow<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
