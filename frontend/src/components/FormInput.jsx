import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  helperText,
  min,
  max,
  rows = 4,
  textarea = false,
}) => {
  const hasError = Boolean(error);
  const baseClassName = `
    w-full rounded-2xl border px-4 py-3 text-sm text-slate-900
    shadow-sm transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${hasError
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
      : success
      ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
      : 'border-slate-200 focus:border-sky-400 focus:ring-sky-200'}
    ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-500' : 'bg-white'}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={baseClassName}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          className={baseClassName}
        />
      )}

      {hasError && <p className="mt-1 text-sm text-rose-600">{error}</p>}
      {success && !hasError && <p className="mt-1 text-sm text-emerald-600">OK {success}</p>}
      {helperText && !hasError && !success && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
    </div>
  );
};

export default FormInput;
