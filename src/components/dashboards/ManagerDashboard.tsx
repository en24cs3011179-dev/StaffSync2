import React, { useState } from 'react';
import { User, AttendanceRecord, LeaveRequest, TrainingProgram } from '../../types';
import {
  Users,
  CheckCircle2,
  CalendarDays,
  GraduationCap,
  Check,
  X,
  MessageSquare,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface ManagerDashboardProps {
  currentUser: User;
  users: User[];
  todayAttendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  trainings: TrainingProgram[];
  onNavigateTab: (tab: string) => void;
  onReviewLeave: (leaveId: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentUser,
  users,
  todayAttendance,
  leaves,
  trainings,
  onNavigateTab,
  onReviewLeave,
}) => {
  const [reviewRemark, setReviewRemark] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  // Filter team members managed by this manager
  const teamMembers = users.filter((u) => u.managerId === currentUser.id || u.department === currentUser.department);
  const teamMemberIds = teamMembers.map((m) => m.employeeId);

  // Team attendance today
  const teamTodayAtt = todayAttendance.filter((a) => teamMemberIds.includes(a.employeeId));

  // Team pending leaves
  const teamPendingLeaves = leaves.filter(
    (l) => teamMemberIds.includes(l.employeeId) && l.status === 'Pending'
  );

  const teamTrainings = trainings.filter((t) =>
    t.enrolledEmployeeIds.some((id) => teamMemberIds.includes(id))
  );

  const handleAction = (leaveId: string, status: 'Approved' | 'Rejected') => {
    onReviewLeave(leaveId, status, reviewRemark || (status === 'Approved' ? 'Approved by Team Lead' : 'Rejected due to sprint milestones'));
    setSelectedLeaveId(null);
    setReviewRemark('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span>Engineering Leadership Portal</span>
            <span>·</span>
            <span>Department Lead</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Managing <span className="font-semibold text-slate-700">{teamMembers.length} team members</span> across the {currentUser.department} department.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('leaves')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Manage All Team Leaves</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Direct Team</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {teamMembers.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{currentUser.department} Division</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
            {teamTodayAtt.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Checked in & working</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Approvals</span>
            <CalendarDays className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
            {teamPendingLeaves.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Team leave requests</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Programs</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {teamTrainings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Skill development modules</div>
        </div>
      </div>

      {/* Main Row: Team Member Roster & Pending Review Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Team Leaves for Approval (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Review Team Leave Requests</h3>
              <p className="text-xs text-slate-500">Authorize or reject time off requests with remarks</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {teamPendingLeaves.length} pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {teamPendingLeaves.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No pending leave requests from your team members.
              </div>
            ) : (
              teamPendingLeaves.map((req) => (
                <div key={req.id} className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {req.avatar ? (
                        <img
                          src={req.avatar}
                          alt={req.employeeName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {req.employeeName.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900">{req.employeeName}</div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          <span className="font-semibold">{req.leaveType} Leave</span> · {req.startDate} to {req.endDate}
                          <span className="ml-1 text-slate-500 font-mono">({req.totalDays} business days)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Actions & Remarks */}
                  {selectedLeaveId === req.id ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Reviewer Feedback / Decision Notes:
                      </label>
                      <input
                        type="text"
                        value={reviewRemark}
                        onChange={(e) => setReviewRemark(e.target.value)}
                        placeholder="e.g. Approved. Sprint tasks have been re-assigned."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setSelectedLeaveId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'Rejected')}
                          className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'Approved')}
                          className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs"
                        >
                          Confirm Approval
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedLeaveId(req.id);
                          setReviewRemark('Approved. Team deliverables are covered.');
                        }}
                        className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Leave</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeaveId(req.id);
                          setReviewRemark('Cannot approve due to critical release milestone.');
                        }}
                        className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Team Directory & Attendance Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Team Presence Today</h3>
              <p className="text-xs text-slate-500">Live operational status of direct reports</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 pt-2 flex-1">
            {teamMembers.map((member) => {
              const att = teamTodayAtt.find((a) => a.employeeId === member.employeeId);
              return (
                <div key={member.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {member.name.substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">{member.name}</div>
                      <div className="text-[11px] text-slate-500">{member.designation}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    {att ? (
                      <div>
                        <div className="font-semibold text-emerald-700">
                          {att.status} ({att.workType})
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          In: {att.clockIn}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">Not clocked in</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
