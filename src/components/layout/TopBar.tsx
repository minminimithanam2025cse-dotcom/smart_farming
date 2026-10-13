import React from 'react';
import { Menu, Bell, Sprout } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatusIndicator from '../ui/StatusIndicator';

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title }) => {
  const { backendOnline, demoMode } = useApp();

  return (
    <header className="h-16 bg-white border-b border-stone-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && <h2 className="text-base font-semibold text-stone-800 hidden sm:block">{title}</h2>}
      </div>

      <div className="flex items-center gap-3">
        {demoMode && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Demo Mode Active
          </span>
        )}

        <div className="h-4 w-px bg-stone-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <StatusIndicator online={backendOnline} label={backendOnline ? 'Connected' : 'Disconnected'} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
