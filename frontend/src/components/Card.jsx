import React from 'react';

/**
 * Card Component
 * Reusable card container with styling
 */
const Card = ({
  title,
  subtitle,
  children,
  actions,
  className = '',
  headerClassName = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200
        ${hoverable ? 'hover:shadow-lg hover:border-blue-300 transition-all' : 'shadow-md'}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {actions && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
