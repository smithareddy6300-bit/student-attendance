import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import { AttendanceStatus } from '../../types/attendance';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ShieldAlert,
  Search,
  Save,
  Users,
  Filter,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const RollCallSheet: React.FC = () => {
  const {
    students,
    courses,
    records,
    selectedCourseId,
    setSelectedCourseId,
    selectedDate,
    setSelectedDate,
    saveBatchAttendance,
    getStudentStats,
  } = useAttendance();

  const { currentUser } = useAuth();

  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'All' | 'Section A' | 'Section B'>('All');

  // Local state for the current roll call session
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; notes: string }>
  >({});

  // Filter students enrolled in current course
  const enrolledStudents = students.filter(
    (s) => s.courseId === selectedCourseId || (!s.courseId && selectedCourseId === 'c-cs101')
  );

  // Initialize attendanceMap whenever selectedCourseId or selectedDate changes
  useEffect(() => {
    const initialMap: Record<string, { status: AttendanceStatus; notes: string }> = {};

    enrolledStudents.forEach((student) => {
      // Find if an existing record already exists for this student on this date & course
      const existing = records.find(
        (r) =>
          r.studentId === student.id &&
          r.courseId === selectedCourseId &&
          r.date === selectedDate
      );

      if (existing) {
        initialMap[student.id] = {
          status: existing.status,
          notes: existing.notes || '',
        };
      } else {
        // Default to 'present' so teacher can just toggle exceptions
        initialMap[student.id] = {
          status: 'present',
          notes: '',
        };
      }
    });

    setAttendanceMap(initialMap);
  }, [selectedCourseId, selectedDate, records.length, enrolledStudents.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
    enrolledStudents.forEach((student) => {
      updated[student.id] = {
        status,
        notes: attendanceMap[student.id]?.notes || '',
      };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const entriesToSave = enrolledStudents.map((student) => {
      const studentState = attendanceMap[student.id] || { status: 'present', notes: '' };
      return {
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        courseId: selectedCourseId,
        date: selectedDate,
        timeSlot,
        status: studentState.status,
        markedBy: currentUser?.name || 'Instructor',
        notes: studentState.notes,
      };
    });

    saveBatchAttendance(entriesToSave);
  };

  // Filtered student list for table
  const displayedStudents = enrolledStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = sectionFilter === 'All' || student.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  // Calculate live counts
  const total = enrolledStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  Object.values(attendanceMap).forEach((item) => {
    if (item.status === 'present') presentCount++;
    else if (item.status === 'absent') absentCount++;
    else if (item.status === 'late') lateCount++;
    else if (item.status === 'excused') excusedCount++;
  });

  const currentRate = total > 0 ? Math.round(((presentCount + lateCount * 0.8 + excusedCount) / total) * 100) : 0;
  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      {/* Session Controls Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Course / Subject
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code}: {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attendance Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lecture Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM (Morning Lecture)</option>
              <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM (Midday Session)</option>
              <option value="01:30 PM - 03:00 PM">01:30 PM - 03:00 PM (Afternoon Lecture)</option>
              <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM (Lab / Tutorial)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Class Section
            </label>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['All', 'Section A', 'Section B'] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectionFilter(sec)}
                  className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors ${
                    sectionFilter === sec
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sec === 'All' ? 'All' : sec.replace('Section ', 'Sec ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Attendance Metric Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-xs">
            <span className="text-slate-600">
              Enrolled: <strong className="text-slate-900 font-mono">{total}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-emerald-700">
              Present: <strong className="font-mono text-emerald-800">{presentCount}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-rose-700">
              Absent: <strong className="font-mono text-rose-800">{absentCount}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-amber-700">
              Late: <strong className="font-mono text-amber-800">{lateCount}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-blue-700">
              Excused: <strong className="font-mono text-blue-800">{excusedCount}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-indigo-700 font-medium">
              Rate: <strong className="font-mono text-indigo-900">{currentRate}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAll('present')}
              className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
            >
              All Absent
            </button>
            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Roll Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Marking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search & Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Attendance Sheet ({currentCourse?.code} - {selectedDate})
            </h3>
            <span className="text-xs text-slate-500">· {displayedStudents.length} Students</span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll No.</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Overall Standing</th>
                <th className="px-4 py-3 text-center">Mark Status</th>
                <th className="px-4 py-3">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">No students found matching your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing search filters or selecting another course</p>
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student) => {
                  const currentMark = attendanceMap[student.id]?.status || 'present';
                  const currentNote = attendanceMap[student.id]?.notes || '';
                  const cumulativeStats = getStudentStats(student.id, selectedCourseId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Roll Number */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-slate-800 font-medium">
                          {student.rollNumber}
                        </span>
                      </td>

                      {/* Student info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{student.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {student.section} · {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cumulative rate */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-semibold ${
                              cumulativeStats.isAtRisk ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {cumulativeStats.rate}%
                          </span>
                          {cumulativeStats.isAtRisk ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              At Risk (&lt;75%)
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              ({cumulativeStats.present + cumulativeStats.excused}/{cumulativeStats.total} attended)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Selector Segmented Control */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              currentMark === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                            title="Mark Present"
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              currentMark === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                            title="Mark Absent"
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              currentMark === 'late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                            title="Mark Late"
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              currentMark === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700'
                            }`}
                            title="Mark Excused"
                          >
                            Excused
                          </button>
                        </div>
                      </td>

                      {/* Notes / Remarks */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Optional remarks (e.g. flu, bus delay)"
                          value={currentNote}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          className="w-full text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Save bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Attendance marks are automatically saved to your browser database.
          </p>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
