import React from 'react';
import { User } from '../types';
import { Bell, ShieldCheck, CheckCircle2, ChevronDown, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: 'hr' | 'manager' | 'employee') => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenAuthModal: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  onOpenNotifications,
  unreadCount,
  onOpenAuthModal,
  activeTab,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const getBreadcrumbTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview & Metrics';
      case 'employees':
        return 'Personnel Directory';
      case 'attendance':
        return 'Attendance & Time Logs';
      case 'leaves':
        return 'Leave Management';
      case 'announcements':
        return 'Company Announcements';
      case 'trainings':
        return 'Professional Development';
      case 'reports':
        return 'Analytics & Reports';
      case 'tests':
        return 'System Test & Verification Console';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 shrink-0 sticky top-0 z-20">
      {/* Zone 1: Context Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs uppercase font-medium tracking-wider text-slate-600">
          {currentUser.role === 'hr' ? 'HR Portal' : currentUser.role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
        </span>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <h1 className="text-sm font-semibold text-slate-900 truncate">
          {getBreadcrumbTitle(activeTab)}
        </h1>
      </div>

      {/* Zone 2: Organization live context banner */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>Role-Based Access Control</span>
        </div>
        <span aria-hidden="true">·</span>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Healthy</span>
        </div>
      </div>

      {/* Zone 3: Controls (Notifications, Role Quick Switcher, User Profile) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            title="Switch demo persona or role"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="capitalize">{currentUser.role} View</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-30"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role Persona
              </div>
              <button
                onClick={() => {
                  onRoleSwitch('hr');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentUser.role === 'hr' ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                }`}
              >
                <div>
                  <div className="text-slate-900">HR Personnel</div>
                  <div className="text-[11px] text-slate-600">Elena Vance (Head of People)</div>
                </div>
                {currentUser.role === 'hr' && <span className="text-slate-900 text-xs font-bold">✓</span>}
              </button>

              <button
                onClick={() => {
                  onRoleSwitch('manager');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentUser.role === 'manager' ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                }`}
              >
                <div>
                  <div className="text-slate-900">Team Manager</div>
                  <div className="text-[11px] text-slate-600">Marcus Sterling (VP Eng)</div>
                </div>
                {currentUser.role === 'manager' && <span className="text-slate-900 text-xs font-bold">✓</span>}
              </button>

              <button
                onClick={() => {
                  onRoleSwitch('employee');
                  setRoleMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentUser.role === 'employee' ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                }`}
              >
                <div>
                  <div className="text-slate-900">Employee</div>
                  <div className="text-[11px] text-slate-600">Sophia Chen (Senior Dev)</div>
                </div>
                {currentUser.role === 'employee' && <span className="text-slate-900 text-xs font-bold">✓</span>}
              </button>

              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setRoleMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Sign In with Credentials / JWT...
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">{currentUser.designation}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
