import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Archive, 
  BarChart3, 
  Settings, 
  LifeBuoy,
  ChevronRight,
  GraduationCap,
  Users,
  Network
} from 'lucide-react';

import Logo from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'capture', label: 'Knowledge Capture', icon: BrainCircuit },
    { id: 'expertise', label: 'Expertise Portal', icon: Users },
    { id: 'archive', label: 'Decision Archive', icon: Archive },
    { id: 'strategy', label: 'Strategy Map', icon: Network },
    { id: 'training', label: 'Successor Training', icon: GraduationCap },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 font-sans">
      {/* Brand Header */}
      <div>
        <Logo />

        {/* Primary Navigation links */}
        <nav className="p-4 space-y-1">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`${item.id}-tab-btn`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Profile Panel */}
      <div>
        <div className="p-4 border-t border-slate-100 space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${
                  isActive ? 'text-brand-600' : 'text-slate-400'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
              alt="Admin Sarah J."
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-semibold text-slate-900 truncate">
              Sarah J.
            </span>
            <span className="block text-[10px] text-slate-500 truncate">
              Admin | Operations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
