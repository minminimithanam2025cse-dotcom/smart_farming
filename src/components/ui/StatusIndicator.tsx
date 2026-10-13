import React from 'react';

interface StatusIndicatorProps {
  online: boolean;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  online,
  label,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <span
        className={`w-2 h-2 rounded-full ${
          online ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500'
        }`}
      />
      {label && (
        <span className={online ? 'text-emerald-700' : 'text-rose-600'}>
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
