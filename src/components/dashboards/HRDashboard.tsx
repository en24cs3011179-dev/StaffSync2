import React from 'react';
import { User, AttendanceRecord, LeaveRequest, Announcement } from '../../types';
import {
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Megaphone,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface HRDashboardProps {
  currentUser: User;
  analytics: {
    totalEmployees: number;
    presentToday: number;
    lateToday: number;
    remoteToday: number;
    pendingLeaves: number;
    approvedLeaves: number;
    deptCount: Record<string, number>;
    avgHours: string;
    attendanceRate: number;
    activeTrainings: number;
  };
  todayAttendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  announcements: Announcement[];
  onNavigateTab: (tab: string) => void;
  onReviewLeave: (leaveId: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  currentUser,
  analytics,
  todayAttendance,
  leaves,
  announcements,
  onNavigateTab,
  onReviewLeave,
}) => {
  const pendingLeavesList = leaves.filter((l) => l.status === 'Pending').slice(0, 4);
  const pinnedAnnouncements = announcements.filter((a) => a.isPinned || a.priority === 'High');

  return (
    <div className="space-y-6">
      {/* Welcome & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span>Executive HR Administration</span>
            <span>·</span>
            <span>Head of People Portal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organization workforce health, attendance compliance, and leave operations are currently nominal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('employees')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={() => onNavigateTab('announcements')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.totalEmployees}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">100% active roster</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Present Today</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.presentToday + analytics.lateToday}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {analytics.remoteToday} remote · {analytics.presentToday + analytics.lateToday - analytics.remoteToday} in-office
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Attendance Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.attendanceRate}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Above 90% benchmark</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Leaves</span>
            <CalendarDays className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
            {analytics.pendingLeaves}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Trainings</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.activeTrainings}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Programs active</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Avg Work Hours</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.avgHours}h
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Per clocked member</div>
        </div>
      </div>

      {/* Urgent Announcements Banner if any */}
      {pinnedAnnouncements.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <span>Priority Announcement:</span>
                <span className="font-semibold">{pinnedAnnouncements[0].title}</span>
              </div>
              <p className="text-xs text-amber-800 line-clamp-1 mt-0.5">
                {pinnedAnnouncements[0].content}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('announcements')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 shrink-0 self-start sm:self-center"
          >
            <span>View Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Pending Approvals & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Leave Approvals Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Approvals Queue</h3>
              <p className="text-xs text-slate-500">Employee requests awaiting HR/manager clearance</p>
            </div>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {pendingLeavesList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                All leave requests have been reviewed and resolved.
              </div>
            ) : (
              pendingLeavesList.map((req) => (
                <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {req.avatar ? (
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 mt-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                        {req.employeeName.substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{req.employeeName}</span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-slate-500">{req.department}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-800">{req.leaveType} Leave</span>: {req.startDate} to {req.endDate} ({req.totalDays} day{req.totalDays > 1 ? 's' : ''})
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 italic">
                        "{req.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onReviewLeave(req.id, 'Approved', 'Approved by HR Director')}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onReviewLeave(req.id, 'Rejected', 'Rejected by HR Director')}
                      className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Department Headcount Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Roster</h3>
              <p className="text-xs text-slate-500">Personnel allocation across units</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-4 flex-1">
            {Object.entries(analytics.deptCount).map(([dept, count]) => {
              const pct = Math.round((count / Math.max(1, analytics.totalEmployees)) * 100);
              return (
                <div key={dept}>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{dept}</span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {count} member{count > 1 ? 's' : ''} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Realtime Presence Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Real-Time Presence Feed</h3>
            <p className="text-xs text-slate-500">Live timestamped employee check-ins and locations</p>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full Attendance Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Clock In</th>
                <th className="py-2.5 px-3">Clock Out</th>
                <th className="py-2.5 px-3">Work Mode</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {rec.employeeName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{rec.department}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700">
                    {rec.clockIn}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">
                    {rec.clockOut || 'Active In-Progress'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {rec.workType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-semibold ${
                        rec.status === 'Present'
                          ? 'text-emerald-700'
                          : rec.status === 'Late'
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
