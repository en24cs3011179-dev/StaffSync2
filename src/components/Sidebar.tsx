import React from 'react';
import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Megaphone,
  GraduationCap,
  BarChart3,
  CheckSquare,
  LogOut,
  RotateCcw,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onResetData: () => void;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onResetData,
  onLogout,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['hr', 'manager', 'employee'],
    },
    {
      id: 'employees',
      label: currentUser.role === 'manager' ? 'My Team' : 'Employee Directory',
      icon: Users,
      roles: ['hr', 'manager'],
    },
    {
      id: 'attendance',
      label: currentUser.role === 'employee' ? 'My Attendance' : 'Attendance Logs',
      icon: Clock,
      roles: ['hr', 'manager', 'employee'],
    },
    {
      id: 'leaves',
      label: currentUser.role === 'employee' ? 'Leave Requests' : 'Leave Approvals',
      icon: CalendarDays,
      roles: ['hr', 'manager', 'employee'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      roles: ['hr', 'manager', 'employee'],
    },
    {
      id: 'trainings',
      label: 'Training Hub',
      icon: GraduationCap,
      roles: ['hr', 'manager', 'employee'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['hr', 'manager'],
    },
    {
      id: 'tests',
      label: 'System Tests & Audit',
      icon: CheckSquare,
      roles: ['hr', 'manager', 'employee'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight leading-none">
              KoreHR
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 tracking-wide">
              Enterprise HRM
            </div>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          v2.4
        </span>
      </div>

      {/* Role Pill Indicator */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="text-[11px] text-slate-400 font-medium">Logged In As</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
          <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.id === 'tests' && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                  CLI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions & Reset */}
      <div className="p-3 border-t border-slate-800 space-y-1 bg-slate-950/30">
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
          title="Reset database to fresh mock seed data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Demo Seed Data</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch</span>
        </button>
      </div>
    </aside>
  );
};
