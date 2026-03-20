import React from "react";

const Input = ({
  label,
  placeholder,
  type,
  name,
  value,
  className = "",
  inputClassName = "",
  labelClassName = "",
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-900 ${labelClassName}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        {...props}
        className={`
          mt-2
          w-full py-2 px-3 border rounded-md 
          focus:outline-none focus:border-transparent
          focus:ring-2 focus:ring-blue-600 
          border-none bg-gray-200 transition duration-300
          ${inputClassName}
          `}
      />
    </div>
  );
};

export default Input;
