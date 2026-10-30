import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { Student } from '../../types/attendance';
import {
  Users,
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  BookOpen,
} from 'lucide-react';

export const StudentRoster: React.FC = () => {
  const {
    students,
    courses,
    records,
    getStudentStats,
    addStudent,
    deleteStudent,
  } = useAttendance();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'at-risk' | 'good'>('all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'c-cs101');
  const [newSection, setNewSection] = useState('Section A');
  const [newPhone, setNewPhone] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [newDob, setNewDob] = useState('2004-06-15');
  const [newBlood, setNewBlood] = useState('O+');

  // Filtering
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesCourse = courseFilter === 'all' || student.courseId === courseFilter;

    const stats = getStudentStats(student.id, student.courseId);
    let matchesStatus = true;
    if (statusFilter === 'at-risk') matchesStatus = stats.isAtRisk;
    if (statusFilter === 'good') matchesStatus = !stats.isAtRisk;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRoll.trim()) return;

    const targetCourse = courses.find((c) => c.id === newCourseId);

    addStudent({
      rollNumber: newRoll.trim(),
      name: newName.trim(),
      email: newEmail.trim() || `${newRoll.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      courseId: newCourseId,
      courseName: targetCourse?.name || 'Computer Science',
      semester: 'Semester 4',
      section: newSection,
      contactPhone: newPhone.trim() || '+1 (555) 000-0000',
      parentPhone: newParentPhone.trim() || '+1 (555) 000-0001',
      gender: newGender,
      dob: newDob,
      bloodGroup: newBlood,
      admissionYear: '2024',
    });

    // Reset
    setNewRoll('');
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewParentPhone('');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Name',
      'Email',
      'Course',
      'Section',
      'Total Classes',
      'Present',
      'Absent',
      'Late',
      'Excused',
      'Attendance Rate (%)',
      'Eligibility Status',
    ];

    const rows = filteredStudents.map((student) => {
      const stats = getStudentStats(student.id, student.courseId);
      return [
        `"${student.rollNumber}"`,
        `"${student.name}"`,
        `"${student.email}"`,
        `"${student.courseName}"`,
        `"${student.section}"`,
        stats.total,
        stats.present,
        stats.absent,
        stats.late,
        stats.excused,
        `${stats.rate}%`,
        stats.isAtRisk ? 'At Risk (<75%)' : 'Eligible (>=75%)',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Attendance_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Student Detail modal records
  const modalStudentRecords = selectedStudentForModal
    ? records.filter((r) => r.studentId === selectedStudentForModal.id)
    : [];

  const modalStudentStats = selectedStudentForModal
    ? getStudentStats(selectedStudentForModal.id, selectedStudentForModal.courseId)
    : null;

  return (
    <div className="space-y-6">
      {/* Controls & Metrics Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('good')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'good' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Good (&ge;75%)
            </button>
            <button
              onClick={() => setStatusFilter('at-risk')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'at-risk' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              At Risk (&lt;75%)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Course & Section</th>
                <th className="px-4 py-3 text-center">Attendance %</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No students matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const stats = getStudentStats(student.id, student.courseId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-800 font-medium">
                        {student.rollNumber}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{student.name}</div>
                            <div className="text-[11px] text-slate-500">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-800 font-medium">{student.courseName}</div>
                        <div className="text-[11px] text-slate-500">{student.section} · {student.semester}</div>
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-block text-center">
                          <span
                            className={`font-mono font-bold text-sm ${
                              stats.isAtRisk ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {stats.rate}%
                          </span>
                          <div className="text-[10px] text-slate-500">
                            {stats.present + stats.excused} of {stats.total} classes
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {stats.isAtRisk ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            At Risk (&lt;75%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Eligible
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForModal(student)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="View Detailed Attendance Record"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${student.name} (${student.rollNumber})?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Remove Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details & Historical Attendance Modal */}
      {selectedStudentForModal && modalStudentStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForModal.avatar}
                  alt={selectedStudentForModal.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudentForModal.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedStudentForModal.rollNumber} · {selectedStudentForModal.section}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Stats Strip */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Attendance Rate
                  </div>
                  <div
                    className={`text-xl font-bold font-mono mt-1 ${
                      modalStudentStats.isAtRisk ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {modalStudentStats.rate}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {modalStudentStats.isAtRisk ? 'Below 75% norm' : 'Meets criteria'}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <div className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold">
                    Present
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                    {modalStudentStats.present}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Lectures</div>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100">
                  <div className="text-[10px] text-rose-800 uppercase tracking-wider font-semibold">
                    Absent
                  </div>
                  <div className="text-xl font-bold font-mono text-rose-700 mt-1">
                    {modalStudentStats.absent}
                  </div>
                  <div className="text-[10px] text-rose-600 mt-0.5">Missed</div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-blue-800 uppercase tracking-wider font-semibold">
                    Excused / Late
                  </div>
                  <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                    {modalStudentStats.excused + modalStudentStats.late}
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">Approved / Late</div>
                </div>
              </div>

              {/* Student Basic Information & Contact Info */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2.5">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider pb-1.5 border-b border-slate-200/70">
                  Student Basic Details & Bio
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-slate-700">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Gender</span>
                    <span className="font-semibold text-slate-900">{selectedStudentForModal.gender || 'Not specified'}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Date of Birth</span>
                    <span className="font-mono font-medium text-slate-900">{selectedStudentForModal.dob || '2004-05-14'}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Blood Group</span>
                    <span className="font-semibold text-rose-700">{selectedStudentForModal.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Admission Year</span>
                    <span className="font-mono font-medium text-slate-900">{selectedStudentForModal.admissionYear || '2024'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                    <span className="font-medium text-slate-800">{selectedStudentForModal.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Student Phone
                    </span>
                    <span className="font-mono text-slate-800">{selectedStudentForModal.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Parent / Guardian Contact
                    </span>
                    <span className="font-mono text-slate-800">{selectedStudentForModal.parentPhone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Past Class Session Logs ({modalStudentRecords.length})
                </h4>
                <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {modalStudentRecords.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No attendance sessions recorded yet for this student.
                    </div>
                  ) : (
                    modalStudentRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3 flex items-center justify-between text-xs hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-medium text-slate-800">
                            {rec.date}
                          </span>
                          <span className="text-slate-500">{rec.timeSlot}</span>
                          {rec.notes && (
                            <span className="text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {rec.notes}
                            </span>
                          )}
                        </div>
                        <div>
                          {rec.status === 'present' && (
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Present
                            </span>
                          )}
                          {rec.status === 'absent' && (
                            <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                              Absent
                            </span>
                          )}
                          {rec.status === 'late' && (
                            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Late
                            </span>
                          )}
                          {rec.status === 'excused' && (
                            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              Excused
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Add New Student
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS2026-175"
                    value={newRoll}
                    onChange={(e) => setNewRoll(e.target.value)}
                    className="w-full font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section
                  </label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enrolled Course
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. david.m@student.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full font-mono text-[11px] px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newBlood}
                    onChange={(e) => setNewBlood(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0001"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full font-mono px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
