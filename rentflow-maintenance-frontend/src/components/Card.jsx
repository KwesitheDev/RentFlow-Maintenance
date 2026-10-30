import React from "react";
export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`surface p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
