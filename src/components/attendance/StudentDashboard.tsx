import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
  Send,
  X,
  FileCheck,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export const StudentDashboard: React.FC<{ onNavigateToCheckIn: () => void }> = ({
  onNavigateToCheckIn,
}) => {
  const { currentUser } = useAuth();
  const {
    courses,
    records,
    getStudentStats,
    leaveRequests,
    submitLeaveRequest,
    activeSession,
  } = useAttendance();

  // Find student ID matching currentUser
  const studentId = currentUser?.id === 'u-student-2' ? 's-2' : 's-1';
  const studentName = currentUser?.name || 'Student';
  const studentRoll = currentUser?.rollNumber || 'CS2026-001';

  const overallStats = getStudentStats(studentId);

  // Leave modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedCourseForLeave, setSelectedCourseForLeave] = useState(courses[0]?.id || 'c-cs101');
  const [leaveStartDate, setLeaveStartDate] = useState('2026-11-02');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-11-03');
  const [leaveReason, setLeaveReason] = useState('');

  const myRecords = records
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const myLeaves = leaveRequests.filter((lr) => lr.studentId === studentId);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    const course = courses.find((c) => c.id === selectedCourseForLeave);

    submitLeaveRequest({
      studentId,
      studentName,
      rollNumber: studentRoll,
      courseId: selectedCourseForLeave,
      courseName: course?.name || 'Class Course',
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: leaveReason.trim(),
    });

    setLeaveReason('');
    setIsLeaveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Eligibility Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={studentName}
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{studentName}</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {studentRoll}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bachelor of Technology · Computer Science · Semester 4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Cumulative Rate</div>
            <div
              className={`text-3xl font-extrabold font-mono ${
                overallStats.isAtRisk ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {overallStats.rate}%
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              overallStats.isAtRisk
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {overallStats.isAtRisk ? (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <div>At-Risk Status</div>
                  <div className="text-[10px] font-normal text-rose-700">
                    Need &ge;75% to take exams
                  </div>
                </div>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div>Exam Eligible</div>
                  <div className="text-[10px] font-normal text-emerald-700">
                    Criteria compliant
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student Basic Details Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Student Basic Details</span>
          <span className="text-[11px] font-normal text-slate-500">Academic Year 2024-2028</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Roll Number</span>
            <span className="font-mono font-bold text-slate-900">{studentRoll}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Program</span>
            <span className="font-semibold text-slate-900">B.Tech CS</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Semester</span>
            <span className="font-semibold text-slate-900">Semester 4 (Sec A)</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Blood Group</span>
            <span className="font-bold text-rose-700">{studentId === 's-2' ? 'B+' : 'O+'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Date of Birth</span>
            <span className="font-mono text-slate-900">{studentId === 's-2' ? '2004-08-22' : '2004-05-14'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Login Email</span>
            <span className="font-mono text-[11px] text-slate-800 truncate block">{currentUser?.email || 'student@school.edu'}</span>
          </div>
        </div>
      </div>

      {/* Active PIN Banner if session is currently active */}
      {activeSession && activeSession.active && (
        <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Lecture Check-In Open: {activeSession.courseName}
              </div>
              <div className="text-xs text-indigo-100">
                Session active in {activeSession.room} · Code required
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToCheckIn}
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            Enter 4-Digit PIN Now
          </button>
        </div>
      )}

      {/* Subject-Wise Attendance Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Course-Wise Attendance Breakdown
          </h3>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            Apply for Absence / Medical Leave
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => {
            const courseStats = getStudentStats(studentId, course.id);
            const isRisk = courseStats.isAtRisk;

            return (
              <div
                key={course.id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 mb-1">
                    <span>{course.code}</span>
                    <span
                      className={`text-sm ${
                        isRisk ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {courseStats.rate}%
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {course.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {course.instructorName}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      style={{ width: `${courseStats.rate}%` }}
                      className={`h-full rounded-full ${
                        isRisk ? 'bg-rose-500' : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Present: <strong>{courseStats.present}</strong>
                  </span>
                  <span>
                    Missed: <strong>{courseStats.absent}</strong>
                  </span>
                  <span>
                    Total: <strong>{courseStats.total}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Attendance Logs + Leave Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Recent Lecture Attendance Log
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {myRecords.length} lectures logged
            </span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] sticky top-0">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Course</th>
                  <th className="px-4 py-2.5">Slot</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5">Instructor Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No attendance entries logged yet.
                    </td>
                  </tr>
                ) : (
                  myRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-800 font-medium">
                        {r.date}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">
                        {courses.find((c) => c.id === r.courseId)?.code || 'CS101'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{r.timeSlot}</td>
                      <td className="px-4 py-2.5 text-center">
                        {r.status === 'present' && (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Present
                          </span>
                        )}
                        {r.status === 'absent' && (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Absent
                          </span>
                        )}
                        {r.status === 'late' && (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Late
                          </span>
                        )}
                        {r.status === 'excused' && (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Excused
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">
                        {r.notes || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Leave Requests Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                My Leave Requests
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {myLeaves.length} applied
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {myLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No leave requests submitted.
                </div>
              ) : (
                myLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        {leave.courseName}
                      </span>
                      {leave.status === 'approved' && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Approved (Excused)
                        </span>
                      )}
                      {leave.status === 'pending' && (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Faculty Review
                        </span>
                      )}
                      {leave.status === 'rejected' && (
                        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Declined
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {leave.startDate} to {leave.endDate}
                    </div>
                    <p className="text-[11px] text-slate-700">{leave.reason}</p>
                    {leave.adminRemark && (
                      <p className="text-[10px] text-indigo-700 bg-indigo-50/70 p-1.5 rounded">
                        Note: {leave.adminRemark}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors text-center"
            >
              Submit New Absence Excuse
            </button>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Submit Absence / Leave Request
              </h3>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject / Course
                </label>
                <select
                  value={selectedCourseForLeave}
                  onChange={(e) => setSelectedCourseForLeave(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full font-mono px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full font-mono px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Absence *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Flu symptoms, official university hackathon, medical appointment..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Send Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
