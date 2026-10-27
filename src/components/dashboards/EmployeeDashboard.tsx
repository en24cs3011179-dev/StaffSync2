import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, LeaveRequest, TrainingProgram, Announcement, EmployeeDetails, WorkType } from '../../types';
import {
  Clock,
  CalendarDays,
  GraduationCap,
  Megaphone,
  LogIn,
  LogOut,
  MapPin,
  ArrowRight,
  PlusCircle,
  FileText,
} from 'lucide-react';

interface EmployeeDashboardProps {
  currentUser: User;
  employeeDetails: EmployeeDetails;
  todayAttendance?: AttendanceRecord;
  myAttendance: AttendanceRecord[];
  myLeaves: LeaveRequest[];
  trainings: TrainingProgram[];
  announcements: Announcement[];
  onClockIn: (workType: WorkType) => void;
  onClockOut: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenApplyLeave: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  employeeDetails,
  todayAttendance,
  myAttendance,
  myLeaves,
  trainings,
  announcements,
  onClockIn,
  onClockOut,
  onNavigateTab,
  onOpenApplyLeave,
}) => {
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType>('Office');
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Enrolled trainings
  const enrolledTrainings = trainings.filter((t) =>
    t.enrolledEmployeeIds.includes(currentUser.employeeId)
  );

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome & Persona Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {currentUser.name.substring(0, 2)}
            </div>
          )}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Employee Self-Service Portal
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Hello, {currentUser.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{currentUser.designation}</span>
              <span>·</span>
              <span>{currentUser.department}</span>
              <span>·</span>
              <span className="font-mono text-slate-600">{currentUser.employeeId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApplyLeave}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* Primary Row: Attendance Clock Widget + Leave Balance Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Punch Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Time Clock</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                {currentTimeStr}
              </span>
            </div>

            {/* Status Indicator */}
            <div className="py-4 text-center">
              <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
                Current Status
              </div>
              <div className="text-2xl font-extrabold mt-1 text-slate-900 flex items-center justify-center gap-2">
                {todayAttendance ? (
                  todayAttendance.clockOut ? (
                    <span className="text-slate-600">Shift Completed</span>
                  ) : (
                    <span className="text-emerald-600">Currently Clocked In</span>
                  )
                ) : (
                  <span className="text-amber-600">Not Clocked In</span>
                )}
              </div>

              {todayAttendance && (
                <div className="mt-2 inline-flex items-center gap-4 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <span>In: {todayAttendance.clockIn}</span>
                  {todayAttendance.clockOut && <span>Out: {todayAttendance.clockOut}</span>}
                  <span>Hours: {todayAttendance.workingHours}h</span>
                </div>
              )}
            </div>

            {/* Work Mode Selector if not clocked in */}
            {!todayAttendance && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Work Location:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWorkType('Office')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      selectedWorkType === 'Office'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Office</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWorkType('Remote')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      selectedWorkType === 'Remote'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Remote / Home</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            {!todayAttendance ? (
              <button
                onClick={() => onClockIn(selectedWorkType)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In ({selectedWorkType})</span>
              </button>
            ) : !todayAttendance.clockOut ? (
              <button
                onClick={onClockOut}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Clock Out for Day</span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs text-slate-500 font-medium">
                You have completed your work shift for today.
              </div>
            )}
          </div>
        </div>

        {/* Leave Balances Quota Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Leave Balance Quotas</h3>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Leave History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Casual Leave</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                  {employeeDetails.leaveBalance.casual}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">days remaining</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Sick Leave</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                  {employeeDetails.leaveBalance.sick}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">days remaining</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Earned Leave</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1 font-mono tabular-nums">
                  {employeeDetails.leaveBalance.earned}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">paid annual days</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Unpaid Allowance</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                  {employeeDetails.leaveBalance.unpaid}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">days ceiling</div>
              </div>
            </div>

            {/* Quick overview of latest leave requests */}
            <div className="pt-5">
              <div className="text-xs font-semibold text-slate-700 mb-2">Recent Leave Requests</div>
              <div className="space-y-2">
                {myLeaves.slice(0, 2).map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{l.leaveType} Leave</span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-600">{l.startDate} to {l.endDate}</span>
                      <span className="text-slate-400 font-mono text-[11px] ml-1">({l.totalDays}d)</span>
                    </div>
                    <span
                      className={`font-semibold text-xs ${
                        l.status === 'Approved'
                          ? 'text-emerald-700'
                          : l.status === 'Pending'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Enrolled Trainings & Company Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enrolled Training Modules (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Enrolled Training Modules</h3>
            </div>
            <button
              onClick={() => onNavigateTab('trainings')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 pt-1 flex-1">
            {enrolledTrainings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                You are not enrolled in any upcoming training programs.
              </div>
            ) : (
              enrolledTrainings.map((trn) => (
                <div key={trn.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{trn.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Instructor: {trn.instructor} · {trn.durationHours} Hours
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Schedule: {trn.scheduleDate}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 shrink-0">
                    {trn.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Company Announcements (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Company Announcements</h3>
            </div>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
            >
              <span>All News</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 pt-1 flex-1">
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} className="py-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{anc.title}</div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {anc.publishedAt}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {anc.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
