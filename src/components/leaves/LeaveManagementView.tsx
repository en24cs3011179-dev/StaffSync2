import React, { useState } from 'react';
import { User, LeaveRequest, LeaveType, LeaveStatus, EmployeeDetails } from '../../types';
import {
  CalendarDays,
  Plus,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface LeaveManagementViewProps {
  currentUser: User;
  leaves: LeaveRequest[];
  employeeDetails: EmployeeDetails;
  onApplyLeave: (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => { success: boolean; error?: string };
  onReviewLeave: (leaveId: string, status: LeaveStatus, remarks?: string) => void;
  isApplyModalOpen: boolean;
  onSetApplyModalOpen: (open: boolean) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  currentUser,
  leaves,
  employeeDetails,
  onApplyLeave,
  onReviewLeave,
  isApplyModalOpen,
  onSetApplyModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Form fields
  const [formType, setFormType] = useState<LeaveType>('Casual');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState('');

  // Review Modal state
  const [reviewingReq, setReviewingReq] = useState<LeaveRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Auto calculate business days
  const calculateDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const s = new Date(startStr);
    const e = new Date(endStr);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;

    let days = 0;
    const cur = new Date(s);
    while (cur <= e) {
      const d = cur.getDay();
      if (d !== 0 && d !== 6) days++;
      cur.setDate(cur.getDate() + 1);
    }
    return days === 0 ? 1 : days;
  };

  const calculatedDays = calculateDays(formStart, formEnd);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formStart || !formEnd || !formReason.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const res = onApplyLeave({
      leaveType: formType,
      startDate: formStart,
      endDate: formEnd,
      reason: formReason.trim(),
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to submit leave request.');
    } else {
      onSetApplyModalOpen(false);
      setFormStart('');
      setFormEnd('');
      setFormReason('');
    }
  };

  const handleReviewAction = (status: LeaveStatus) => {
    if (!reviewingReq) return;
    onReviewLeave(reviewingReq.id, status, reviewRemarks);
    setReviewingReq(null);
    setReviewRemarks('');
  };

  // Filter requests
  const visibleLeaves = leaves.filter((l) => {
    if (currentUser.role === 'employee' && l.employeeId !== currentUser.employeeId) {
      return false;
    }
    if (activeTab === 'All') return true;
    return l.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {currentUser.role === 'employee' ? 'Leave Requests & Quotas' : 'Organization Leave Management & Approvals'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submit time-off requests, monitor quota entitlements, and process review decisions.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            onSetApplyModalOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500">Casual Leave</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {employeeDetails.leaveBalance.casual}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">days left</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500">Sick Leave</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {employeeDetails.leaveBalance.sick}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">days left</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500">Earned Leave</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1 font-mono tabular-nums">
            {employeeDetails.leaveBalance.earned}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">days left</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500">Maternity / Paternity</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {employeeDetails.leaveBalance.maternity}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">days entitlement</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500">Unpaid Allowance</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {employeeDetails.leaveBalance.unpaid}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">days cap</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-medium">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab} Requests
          </button>
        ))}
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Working Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Reviewer & Notes</th>
                <th className="py-3 px-4 text-right">Status</th>
                {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
                  <th className="py-3 px-4 text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleLeaves.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No leave requests found in this view.
                  </td>
                </tr>
              ) : (
                visibleLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {l.leaveId}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{l.employeeName}</div>
                      <div className="text-[11px] text-slate-500">{l.department}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {l.leaveType}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                      {l.startDate} → {l.endDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {l.totalDays} day{l.totalDays > 1 ? 's' : ''}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {l.reviewerName ? (
                        <div>
                          <span className="font-medium text-slate-700">{l.reviewerName}: </span>
                          <span>{l.reviewRemarks || l.rejectionReason}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting review</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          l.status === 'Approved'
                            ? 'text-emerald-700'
                            : l.status === 'Pending'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
                      <td className="py-3 px-4 text-right">
                        {l.status === 'Pending' ? (
                          <button
                            onClick={() => {
                              setReviewingReq(l);
                              setReviewRemarks('');
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Resolved</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Apply for Time Off</h3>
              <button
                onClick={() => onSetApplyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as LeaveType)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Casual">Casual Leave ({employeeDetails.leaveBalance.casual} available)</option>
                  <option value="Sick">Sick Leave ({employeeDetails.leaveBalance.sick} available)</option>
                  <option value="Earned">Earned Leave ({employeeDetails.leaveBalance.earned} available)</option>
                  <option value="Maternity">Maternity/Paternity ({employeeDetails.leaveBalance.maternity} available)</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {calculatedDays > 0 && (
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900 font-medium flex items-center justify-between">
                  <span>Calculated Business Days:</span>
                  <span className="font-mono font-bold">{calculatedDays} day{calculatedDays > 1 ? 's' : ''}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Absence</label>
                <textarea
                  required
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Provide brief context for your manager and HR..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onSetApplyModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal for Manager / HR */}
      {reviewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Review Leave Request: {reviewingReq.leaveId}</h3>
              <button
                onClick={() => setReviewingReq(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div><span className="font-semibold text-slate-700">Applicant:</span> {reviewingReq.employeeName} ({reviewingReq.department})</div>
                <div><span className="font-semibold text-slate-700">Type:</span> {reviewingReq.leaveType} Leave</div>
                <div><span className="font-semibold text-slate-700">Dates:</span> {reviewingReq.startDate} to {reviewingReq.endDate} ({reviewingReq.totalDays} business days)</div>
                <div className="pt-1 text-slate-600 italic">"{reviewingReq.reason}"</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Decision Notes / Reason:
                </label>
                <textarea
                  rows={2}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Approved. Coverage plan in place."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingReq(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('Rejected')}
                  className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('Approved')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Approve Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
