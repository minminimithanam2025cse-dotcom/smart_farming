import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-stone-200 rounded" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm animate-pulse space-y-4">
    <div className="h-4 bg-stone-200 rounded w-1/3" />
    <div className="h-8 bg-stone-200 rounded w-1/2" />
    <div className="h-3 bg-stone-100 rounded w-3/4" />
  </div>
);

export default LoadingSkeleton;
