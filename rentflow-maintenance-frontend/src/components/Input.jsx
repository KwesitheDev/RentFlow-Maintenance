import React, { useId } from "react";
export default function Input({
  label,
  id,
  name,
  type = "text",
  className = "",
  inputClassName = "",
  labelClassName = "",
  hint,
  error,
  ...props
}) {
  const generated = useId();
  const fieldId = id || generated;
  const descId = `${fieldId}-description`;
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`mb-2 block text-sm font-medium text-slate-700 ${labelClassName}`}
        >
          {label}
          {props.required && (
            <span aria-hidden="true" className="ml-1 text-slate-500">
              *
            </span>
          )}
        </label>
      )}
      <input
        {...props}
        id={fieldId}
        name={name}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={hint || error ? descId : props["aria-describedby"]}
        className={`input ${inputClassName}`}
      />
      {(hint || error) && (
        <p
          id={descId}
          className={`mt-2 text-xs leading-5 ${error ? "text-red-700" : "text-slate-500"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
