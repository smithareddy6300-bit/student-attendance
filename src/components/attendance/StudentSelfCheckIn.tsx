import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  BookOpen,
} from 'lucide-react';

export const StudentSelfCheckIn: React.FC = () => {
  const { activeSession, checkInWithPin } = useAttendance();
  const { currentUser } = useAuth();

  const [pinInput, setPinInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const studentId = currentUser?.id === 'u-student-2' ? 's-2' : 's-1'; // Map to sample student ID
  const isAlreadyCheckedIn = activeSession?.checkedInStudentIds.includes(studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    const res = checkInWithPin(pinInput.trim(), studentId);
    setResult(res);
    if (res.success) {
      setPinInput('');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Lecture Self Check-In</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Enter the 4-digit numeric code displayed on your lecturer's classroom screen to register your attendance.
          </p>
        </div>

        {activeSession && activeSession.active ? (
          <div className="space-y-5">
            {/* Active Class Info Box */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live Session:</span>
                <span className="font-semibold text-slate-900">{activeSession.courseName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Classroom:</span>
                <span className="font-mono text-slate-800">{activeSession.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="text-slate-800">{activeSession.timeSlot}</span>
              </div>
            </div>

            {isAlreadyCheckedIn ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Attendance Recorded</h4>
                <p className="text-xs text-emerald-700">
                  You are marked <strong>Present</strong> for this lecture session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
                    Enter 4-Digit PIN
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 7482"
                      className="w-48 text-center font-mono text-3xl font-bold tracking-widest px-4 py-2 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl focus:outline-none bg-slate-50"
                      autoFocus
                    />
                  </div>
                </div>

                {result && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      result.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{result.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pinInput.length !== 4}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-xs"
                >
                  Verify Attendance
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No active lecture session</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your instructor has not opened a check-in PIN code yet for this hour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
