import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Droplets,
  CloudSun,
  Tractor,
  History,
  Activity,
  Bot,
  BarChart3,
  Settings,
  HelpCircle,
  Sprout,
  Languages,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../i18n/translations';
import StatusIndicator from '../ui/StatusIndicator';

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { language, setLanguage, backendOnline } = useApp();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t(language, 'nav.dashboard') },
    { to: '/crop-doctor', icon: Stethoscope, label: t(language, 'nav.cropDoctor') },
    { to: '/irrigation', icon: Droplets, label: t(language, 'nav.irrigation') },
    { to: '/weather', icon: CloudSun, label: t(language, 'nav.weather') },
    { to: '/farms', icon: Tractor, label: t(language, 'nav.farms') },
    { to: '/history', icon: History, label: t(language, 'nav.history') },
    { to: '/sensors', icon: Activity, label: t(language, 'nav.sensors') },
    { to: '/assistant', icon: Bot, label: t(language, 'nav.assistant') },
    { to: '/reports', icon: BarChart3, label: t(language, 'nav.reports') },
    { to: '/settings', icon: Settings, label: t(language, 'nav.settings') },
    { to: '/help', icon: HelpCircle, label: t(language, 'nav.help') },
  ];

  return (
    <aside className="w-64 bg-forest-900 bg-[#163016] text-white flex flex-col h-full border-r border-emerald-950/40 select-none">
      {/* Brand */}
      <div className="p-5 border-b border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">
              AgriMitra AI
            </h1>
            <p className="text-[11px] text-emerald-300 font-medium">
              SIH26180 Smart Farming
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600/90 text-white shadow-sm'
                  : 'text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="p-4 border-t border-emerald-800/40 space-y-3 bg-[#112411]">
        {/* Language selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-200/70 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" /> Language
          </span>
          <div className="flex bg-emerald-950/60 p-0.5 rounded-md border border-emerald-800/50">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                language === 'en'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                language === 'ta'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Backend status */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-emerald-300/70">Backend</span>
          <StatusIndicator
            online={backendOnline}
            label={backendOnline ? 'Online' : 'Offline'}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
