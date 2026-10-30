import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Download,
  BookOpen,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const {
    students,
    courses,
    records,
    getStudentStats,
    getAllCoursesSummary,
  } = useAttendance();

  const [activeCourseId, setActiveCourseId] = useState<string>('all');

  const courseSummaries = getAllCoursesSummary();

  // Aggregate metrics
  const totalStudents = students.length;
  let totalAtRisk = 0;
  let totalPresentCount = 0;
  let totalAbsentCount = 0;
  let totalLateCount = 0;
  let totalExcusedCount = 0;

  students.forEach((s) => {
    const stats = getStudentStats(s.id, activeCourseId === 'all' ? undefined : activeCourseId);
    if (stats.isAtRisk) totalAtRisk++;
  });

  const filteredRecords = activeCourseId === 'all'
    ? records
    : records.filter((r) => r.courseId === activeCourseId);

  filteredRecords.forEach((r) => {
    if (r.status === 'present') totalPresentCount++;
    else if (r.status === 'absent') totalAbsentCount++;
    else if (r.status === 'late') totalLateCount++;
    else if (r.status === 'excused') totalExcusedCount++;
  });

  const totalLogs = filteredRecords.length;
  const overallRate =
    totalLogs > 0
      ? Math.round(((totalPresentCount + totalLateCount * 0.8 + totalExcusedCount) / totalLogs) * 100)
      : 0;

  // Identify at-risk students
  const atRiskList = students
    .map((s) => ({
      student: s,
      stats: getStudentStats(s.id, activeCourseId === 'all' ? undefined : activeCourseId),
    }))
    .filter((item) => item.stats.isAtRisk)
    .sort((a, b) => a.stats.rate - b.stats.rate);

  // Group attendance by date for trend
  const dateMap: Record<string, { present: number; total: number }> = {};
  filteredRecords.forEach((r) => {
    if (!dateMap[r.date]) {
      dateMap[r.date] = { present: 0, total: 0 };
    }
    dateMap[r.date].total++;
    if (r.status === 'present' || r.status === 'excused') {
      dateMap[r.date].present++;
    } else if (r.status === 'late') {
      dateMap[r.date].present += 0.8;
    }
  });

  const trendData = Object.keys(dateMap)
    .sort()
    .slice(-8)
    .map((date) => ({
      date,
      rate: Math.round((dateMap[date].present / dateMap[date].total) * 100),
      total: dateMap[date].total,
    }));

  return (
    <div className="space-y-6">
      {/* Header and Course Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Attendance Analytics & Compliance Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor institutional 75% mandatory attendance threshold across semester courses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeCourseId}
            onChange={(e) => setActiveCourseId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Departments & Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI 4-Card Strip (Single-elevation, tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Average */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Attendance</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {overallRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {overallRate >= 75 ? '+3% vs Prev Term' : 'Below norm'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {totalLogs} logged attendances
          </div>
        </div>

        {/* Card 2: Total Enrolled */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">Active roster</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Divided across Section A & B
          </div>
        </div>

        {/* Card 3: At-Risk Students */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>At-Risk Students</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {totalAtRisk}
            </span>
            <span className="text-xs text-rose-600 font-medium">
              &lt; 75% Attendance
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Requires exam hall warning notice
          </div>
        </div>

        {/* Card 4: Lecture Sessions */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Lecture Sessions</span>
            <Calendar className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {Object.keys(dateMap).length}
            </span>
            <span className="text-xs text-slate-500">Delivered</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Term week 4 of 16 completed
          </div>
        </div>
      </div>

      {/* Two Column Section: Trend Visualization + At-Risk Student Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Lecture Session Attendance Rate Trend
                </h3>
                <p className="text-xs text-slate-500">
                  Daily presence rate per scheduled class session
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
                  &ge; 75% Safe
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                  &lt; 75% Low
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 pt-4 pb-2 flex items-end justify-between gap-3 border-b border-slate-200">
              {trendData.map((item) => {
                const heightPercent = Math.max(15, item.rate);
                const isLow = item.rate < 75;

                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[11px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.rate}%
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-sm h-36 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isLow ? 'bg-rose-500' : 'bg-indigo-600 group-hover:bg-indigo-700'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Target institution benchmark: 75.0% threshold</span>
            <span className="font-mono text-slate-600">Updated: Today at 09:30 AM</span>
          </div>
        </div>

        {/* At-Risk Warning Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Defaulters List
              </h3>
              <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                {atRiskList.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Students falling below the 75% attendance threshold risk debarment from final semester examinations.
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {atRiskList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No students currently at risk. All attendances are above 75%.
                </div>
              ) : (
                atRiskList.map(({ student, stats }) => (
                  <div
                    key={student.id}
                    className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {student.rollNumber} · {student.section}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-rose-600">
                        {stats.rate}%
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {stats.absent} missed
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => alert('Automated attendance warning notification sent to registered student emails and academic counselors.')}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors text-center"
            >
              Send Attendance Warning Notice
            </button>
          </div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            Department Course Performance Comparison
          </h3>
          <span className="text-xs text-slate-500">Spring 2026 Term</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Course Code</th>
                <th className="px-4 py-3">Course Name</th>
                <th className="px-4 py-3 text-center">Classes Conducted</th>
                <th className="px-4 py-3 text-center">Enrolled</th>
                <th className="px-4 py-3 text-center">Defaulters (&lt;75%)</th>
                <th className="px-4 py-3 text-right">Average Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseSummaries.map((summary) => (
                <tr key={summary.courseId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-slate-900">
                    {summary.courseCode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {summary.courseName}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {summary.totalClasses}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {summary.enrolledStudentsCount}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {summary.atRiskCount > 0 ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                        {summary.atRiskCount} students
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {summary.averageRate}%
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
