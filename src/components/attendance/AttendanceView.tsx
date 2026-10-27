import React, { useState } from 'react';
import { User, AttendanceRecord, WorkType } from '../../types';
import {
  Clock,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  LogIn,
  LogOut,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

interface AttendanceViewProps {
  currentUser: User;
  attendance: AttendanceRecord[];
  todayAttendance?: AttendanceRecord;
  onClockIn: (workType: WorkType) => void;
  onClockOut: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  attendance,
  todayAttendance,
  onClockIn,
  onClockOut,
}) => {
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType>('Office');

  const filtered = attendance.filter((a) => {
    // If regular employee, only show their own logs unless HR or manager
    if (currentUser.role === 'employee' && a.employeeId !== currentUser.employeeId) {
      return false;
    }
    const matchesDept = filterDept === 'All' || a.department === filterDept;
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchesQuery =
      a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.date.includes(searchQuery);

    return matchesDept && matchesStatus && matchesQuery;
  });

  const exportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Work Mode', 'Status', 'Notes'];
    const rows = filtered.map((a) => [
      `"${a.employeeId}"`,
      `"${a.employeeName}"`,
      `"${a.department}"`,
      `"${a.date}"`,
      `"${a.clockIn}"`,
      `"${a.clockOut || ''}"`,
      `"${a.workingHours}"`,
      `"${a.workType}"`,
      `"${a.status}"`,
      `"${a.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `korehr_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {currentUser.role === 'employee' ? 'My Attendance & Punch Records' : 'Organization Attendance & Time Logs'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric & web timestamp logging with automated hours calculation and shift analytics.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Logs to CSV</span>
        </button>
      </div>

      {/* Clock In / Out Banner if not yet clocked out */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Personal Time Punch ({currentUser.name})
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {todayAttendance ? (
                todayAttendance.clockOut ? (
                  <span>Shift finished for today. Total logged: {todayAttendance.workingHours}h.</span>
                ) : (
                  <span>Active since {todayAttendance.clockIn} ({todayAttendance.workType} mode)</span>
                )
              ) : (
                <span>No punch recorded for today. Please punch in to begin tracking hours.</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!todayAttendance ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value as WorkType)}
                className="px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="Office">Office Building</option>
                <option value="Remote">Remote / VPN</option>
                <option value="Hybrid">Hybrid Site</option>
              </select>
              <button
                onClick={() => onClockIn(selectedWorkType)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In Now</span>
              </button>
            </div>
          ) : !todayAttendance.clockOut ? (
            <button
              onClick={onClockOut}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Clock Out for Day</span>
            </button>
          ) : (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Day Completed
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or date (YYYY-MM-DD)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentUser.role !== 'employee' && (
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance & Legal">Finance & Legal</option>
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Punch In</th>
                <th className="py-3 px-4">Punch Out</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Work Location</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No attendance records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 tabular-nums">
                      {r.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.employeeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.department}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                      {r.clockIn}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {r.clockOut || 'Active'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold tabular-nums text-slate-900">
                      {r.workingHours}h
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{r.workType}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          r.status === 'Present'
                            ? 'text-emerald-700'
                            : r.status === 'Late'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
