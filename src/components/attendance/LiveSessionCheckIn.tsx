import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  QrCode,
  KeyRound,
  Users,
  Play,
  Square,
  RefreshCw,
  Clock,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const LiveSessionCheckIn: React.FC = () => {
  const {
    activeSession,
    startSession,
    endSession,
    courses,
    students,
  } = useAttendance();
  const { currentUser } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c-cs101');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
  const [room, setRoom] = useState('Hall 302');
  const [copied, setCopied] = useState(false);

  const handleStart = () => {
    startSession(selectedCourseId, timeSlot, room);
  };

  const handleCopyPin = () => {
    if (activeSession?.pin) {
      navigator.clipboard.writeText(activeSession.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkedInStudents = students.filter((s) =>
    activeSession?.checkedInStudentIds.includes(s.id)
  );

  return (
    <div className="space-y-6">
      {/* Configuration & Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              Live Lecture Check-In (PIN & QR Code)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast a 4-digit lecture attendance code for students to check in from their mobile devices or portals
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSession && activeSession.active ? (
              <button
                onClick={endSession}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Close Check-In Session</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start New Check-In PIN</span>
              </button>
            )}
          </div>
        </div>

        {activeSession && activeSession.active ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-indigo-50/40 p-6 rounded-xl border border-indigo-100">
            {/* PIN Display */}
            <div className="text-center md:border-r md:border-indigo-100 pr-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-800">
                Lecture Access PIN
              </div>
              <div className="my-3 flex items-center justify-center gap-2">
                <span className="font-mono text-5xl font-extrabold tracking-widest text-indigo-900 bg-white px-5 py-2.5 rounded-xl border border-indigo-200 shadow-xs">
                  {activeSession.pin}
                </span>
                <button
                  onClick={handleCopyPin}
                  className="p-2 text-indigo-600 hover:bg-white rounded-lg transition-colors"
                  title="Copy PIN"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-indigo-700">
                {copied ? 'Copied to clipboard!' : 'Display on lecture hall screen'}
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="flex flex-col items-center justify-center md:border-r md:border-indigo-100 pr-4">
              <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-xs">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-28 h-28 text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Top-left corner box */}
                  <rect x="10" y="10" width="24" height="24" rx="2" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" />

                  {/* Top-right corner box */}
                  <rect x="66" y="10" width="24" height="24" rx="2" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" />

                  {/* Bottom-left corner box */}
                  <rect x="10" y="66" width="24" height="24" rx="2" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" />

                  {/* Random pattern data cells */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="18" width="6" height="6" />
                  <rect x="42" y="28" width="6" height="6" />
                  <rect x="42" y="42" width="16" height="16" />
                  <rect x="66" y="42" width="6" height="6" />
                  <rect x="76" y="48" width="8" height="8" />
                  <rect x="12" y="46" width="8" height="6" />
                  <rect x="28" y="46" width="6" height="8" />
                  <rect x="42" y="66" width="6" height="8" />
                  <rect x="54" y="74" width="8" height="6" />
                  <rect x="70" y="66" width="12" height="6" />
                  <rect x="66" y="80" width="16" height="8" />
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-mono">
                Scan with Student App
              </span>
            </div>

            {/* Live Count & Session info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
                <span className="text-slate-500">Course</span>
                <span className="font-semibold text-slate-800">{activeSession.courseName}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
                <span className="text-slate-500">Venue / Room</span>
                <span className="font-mono text-slate-800">{activeSession.room}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
                <span className="text-slate-500">Checked In</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeSession.checkedInStudentIds.length} Students
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Session Status</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Accepting responses
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <KeyRound className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No active check-in session</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Select course parameters below and click Start to generate a temporary lecture PIN code for your students.
            </p>

            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 mb-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Session PIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Real-time Checked In Roster */}
      {activeSession && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Live Checked-In Students ({checkedInStudents.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Auto-syncs to Roll Call records
            </span>
          </div>

          <div className="p-4">
            {checkedInStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Awaiting student submissions... Students can enter PIN <strong>{activeSession.pin}</strong> in their portal to appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {checkedInStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {student.rollNumber}
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
