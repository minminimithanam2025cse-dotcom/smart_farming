import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  loading = false,
}) => {
  return (
    <div className={`bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-stone-900 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
            <div className="h-8 bg-stone-100 rounded" />
          </div>
        ) : (
          children
        )}
      </div>
      {footer && <div className="px-5 py-3 bg-stone-50/60 border-t border-stone-100 text-xs text-stone-500">{footer}</div>}
    </div>
  );
};

export default Card;
