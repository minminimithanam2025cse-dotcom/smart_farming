import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  showTooltip?: boolean;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  className = '',
}) => {
  return (
    <span
      title="This data is simulated for demonstration purposes. Connect real sensors/models for live data."
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300 cursor-help ${className}`}
    >
      <AlertCircle className="w-3 h-3 text-amber-600" />
      Demo Data
    </span>
  );
};

export default DemoBadge;
