import React from 'react';
import { User, AttendanceRecord, LeaveRequest, EmployeeDetails } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Calendar,
  Clock,
  DollarSign,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';

interface ReportsViewProps {
  currentUser: User;
  users: User[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
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
  };
  getEmployeeDetails: (userId: string) => EmployeeDetails;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  users,
  attendance,
  leaves,
  analytics,
  getEmployeeDetails,
}) => {
  // Aggregate compensation
  const totalPayroll = users.reduce((acc, u) => {
    const details = getEmployeeDetails(u.id);
    return acc + (details.compensation?.baseSalary || 120000);
  }, 0);

  const avgSalary = Math.round(totalPayroll / Math.max(1, users.length));

  // Leave breakdown by type
  const leavesByType: Record<string, number> = {};
  leaves.forEach((l) => {
    leavesByType[l.leaveType] = (leavesByType[l.leaveType] || 0) + l.totalDays;
  });

  const exportComprehensiveReport = () => {
    const headers = ['Metric / Category', 'Value', 'Unit / Details'];
    const rows = [
      ['Total Active Headcount', analytics.totalEmployees.toString(), 'FTE Employees'],
      ['Attendance Compliance Rate', `${analytics.attendanceRate}%`, 'Benchmark >= 90%'],
      ['Daily Average Work Duration', `${analytics.avgHours} hours`, 'Per checked-in member'],
      ['Remote Workforce Share', `${analytics.remoteToday} staff`, 'Today active remote'],
      ['Approved Leaves This Cycle', analytics.approvedLeaves.toString(), 'Requests'],
      ['Pending Leave Queue', analytics.pendingLeaves.toString(), 'Action needed'],
      ['Total Annual Payroll Volume', `$${totalPayroll.toLocaleString()}`, 'USD Gross Base'],
      ['Average Employee Compensation', `$${avgSalary.toLocaleString()}`, 'USD Mean Base'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `korehr_executive_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Workforce Intelligence & Executive Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated headcount metrics, compensation summaries, attendance compliance, and leave trends.
          </p>
        </div>

        <button
          onClick={exportComprehensiveReport}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Executive Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Annual Payroll Gross</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            ${(totalPayroll / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total annualized base</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Average Compensation</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            ${(avgSalary / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Market competitive</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Attendance Rate</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {analytics.attendanceRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Compliance index</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Leave Requests Total</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {leaves.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {analytics.approvedLeaves} approved · {analytics.pendingLeaves} pending
          </div>
        </div>
      </div>

      {/* Grid: Department Allocation & Leave Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Headcount Allocation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Department Workforce Distribution</h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">{analytics.totalEmployees} FTEs</span>
          </div>

          <div className="pt-4 space-y-4">
            {Object.entries(analytics.deptCount).map(([dept, count]) => {
              const pct = Math.round((count / Math.max(1, analytics.totalEmployees)) * 100);
              return (
                <div key={dept}>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{dept}</span>
                    <span className="font-mono tabular-nums text-slate-500">{count} members ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Utilization Breakdown by Type */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Leave Days Utilization by Type</h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">Total Days</span>
          </div>

          <div className="pt-4 space-y-4">
            {Object.entries(leavesByType).map(([type, days]) => {
              const totalDaysAll = Object.values(leavesByType).reduce((a, b) => a + b, 0);
              const pct = totalDaysAll > 0 ? Math.round((days / totalDaysAll) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{type} Leave</span>
                    <span className="font-mono tabular-nums text-slate-500">{days} days taken ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
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
