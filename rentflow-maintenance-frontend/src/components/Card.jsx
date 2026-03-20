import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
    border rounded-lg p-4 bg-white shadow-sm
    ${className} border-gray-300 hover:shadow-lg
    `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
