import React from 'react';

const Card = ({
  title,
  subtitle,
  children,
  actions,
  className = '',
  headerClassName = '',
  hoverable = false,
  onClick,
  value,
  icon,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur ${
        hoverable || onClick
          ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl'
          : ''
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className={`border-b border-slate-100 px-6 py-5 ${headerClassName}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {(icon || value !== undefined) && (
              <div className="text-right">
                {icon && <div className="text-sm uppercase tracking-[0.18em] text-slate-500">{icon}</div>}
                {value !== undefined && <div className="text-3xl font-semibold text-slate-900">{value}</div>}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-5">{children}</div>

      {actions && <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">{actions}</div>}
    </div>
  );
};

export default Card;
