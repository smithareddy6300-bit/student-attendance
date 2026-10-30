import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  MessageSquare,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { leaveRequests, reviewLeaveRequest } = useAttendance();
  const { currentUser } = useAuth();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [remarkInput, setRemarkInput] = useState<Record<string, string>>({});

  const filteredRequests = leaveRequests.filter((lr) => {
    if (filter === 'all') return true;
    return lr.status === filter;
  });

  const pendingCount = leaveRequests.filter((lr) => lr.status === 'pending').length;

  const handleApprove = (id: string) => {
    reviewLeaveRequest(
      id,
      'approved',
      currentUser?.name || 'Faculty Member',
      remarkInput[id] || 'Leave granted with documented excuse'
    );
  };

  const handleReject = (id: string) => {
    reviewLeaveRequest(
      id,
      'rejected',
      currentUser?.name || 'Faculty Member',
      remarkInput[id] || 'Insufficient documentation provided'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            Absence & Medical Leave Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review student absence applications. Approving will automatically grant 'Excused' attendance status.
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({leaveRequests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'pending'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'approved'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'rejected'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Declined
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No leave requests found</h4>
            <p className="text-xs text-slate-400 mt-1">
              There are no student leave applications matching the "{filter}" filter.
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      {request.studentName}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {request.rollNumber}
                    </span>
                    <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {request.courseName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>
                      Duration: <strong className="font-mono text-slate-800">{request.startDate}</strong> to <strong className="font-mono text-slate-800">{request.endDate}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Submitted on {new Date(request.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {request.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Review
                    </span>
                  )}
                  {request.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Approved · Excused
                    </span>
                  )}
                  {request.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Declined
                    </span>
                  )}
                </div>
              </div>

              {/* Student's reason */}
              <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Student Reason:
                </span>
                <p className="text-slate-800">{request.reason}</p>
              </div>

              {/* Action Area */}
              {request.status === 'pending' ? (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Optional feedback remark for student (e.g. Medical slip confirmed)"
                      value={remarkInput[request.id] || ''}
                      onChange={(e) =>
                        setRemarkInput({ ...remarkInput, [request.id]: e.target.value })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                    >
                      Approve & Grant Excused
                    </button>
                  </div>
                </div>
              ) : (
                request.adminRemark && (
                  <div className="mt-3 text-[11px] text-slate-500">
                    Reviewed by <strong>{request.reviewedBy}</strong>: "{request.adminRemark}"
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
