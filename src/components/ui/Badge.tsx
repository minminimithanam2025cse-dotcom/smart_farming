import React from 'react';

type Variant = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'amber';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<Variant, string> = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  red: 'bg-rose-100 text-rose-800 border-rose-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  blue: 'bg-sky-100 text-sky-800 border-sky-200',
  gray: 'bg-stone-100 text-stone-700 border-stone-200',
};

const dotStyles: Record<Variant, string> = {
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  amber: 'bg-amber-500',
  blue: 'bg-sky-500',
  gray: 'bg-stone-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  className = '',
  dot = false,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;
