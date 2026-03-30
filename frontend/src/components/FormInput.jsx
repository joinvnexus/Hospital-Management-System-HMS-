import React from 'react';

/**
 * FormInput Component
 * Reusable form input field with validation display
 */
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
}) => {
  const hasError = error && error.length > 0;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
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
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200
          ${hasError
            ? 'border-red-500 focus:ring-red-500'
            : success
            ? 'border-green-500 focus:ring-green-500'
            : 'border-gray-300 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />

      {hasError && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {success && !hasError && (
        <p className="mt-1 text-sm text-green-500">✓ {success}</p>
      )}

      {helperText && !hasError && !success && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;
