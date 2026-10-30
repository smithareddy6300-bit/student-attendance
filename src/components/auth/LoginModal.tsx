import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/attendance';
import {
  GraduationCap,
  LogIn,
  UserCheck,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  KeyRound,
  User,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, switchUser, availableUsers, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide a valid Email or Student Roll Number.');
      return;
    }
    const success = login(identifier.trim(), role);
    if (success) {
      setError(null);
      onClose();
    }
  };

  const fillAndLogin = (userEmailOrRoll: string, userRole: Role) => {
    login(userEmailOrRoll, userRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentUser ? 'Switch User Account' : 'Student Attendance Tracker Login'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentUser
                  ? `Currently signed in as ${currentUser.name} (${currentUser.role})`
                  : 'Use basic demo login credentials or enter your Roll No / Email'}
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Basic Login Details Cheat Sheet Box */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              Basic Login Details (Click to Sign In Instantly)
            </span>
            <span className="text-[10px] text-indigo-600 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Quick Button: Student */}
            <button
              type="button"
              onClick={() => fillAndLogin('student@school.edu', 'student')}
              className="flex flex-col text-left p-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
            >
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Student Details</span>
              <span className="text-xs font-semibold text-slate-900 truncate">student@school.edu</span>
              <span className="text-[10px] text-slate-500 font-mono">Roll: CS2026-001</span>
            </button>

            {/* Quick Button: Faculty */}
            <button
              type="button"
              onClick={() => fillAndLogin('teacher@school.edu', 'teacher')}
              className="flex flex-col text-left p-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
            >
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Teacher Details</span>
              <span className="text-xs font-semibold text-slate-900 truncate">teacher@school.edu</span>
              <span className="text-[10px] text-slate-500 font-mono">Prof. Sarah Jenkins</span>
            </button>

            {/* Quick Button: Admin */}
            <button
              type="button"
              onClick={() => fillAndLogin('admin@school.edu', 'admin')}
              className="flex flex-col text-left p-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
            >
              <span className="text-[10px] font-bold text-purple-700 uppercase">Admin Details</span>
              <span className="text-xs font-semibold text-slate-900 truncate">admin@school.edu</span>
              <span className="text-[10px] text-slate-500 font-mono">Dean Academic</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-3">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'quick'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1-Click User Profiles
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Enter Roll No or Email
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'quick' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 mb-2">
                Select an account to view student attendance records or teacher roll call:
              </p>

              <div className="space-y-2.5">
                {/* Student 1 (Emma Watson - Basic Details) */}
                <button
                  onClick={() => {
                    switchUser('u-student-1');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[2].avatar}
                      alt={availableUsers[2].name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                          {availableUsers[2].name}
                        </span>
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                          Student · Roll: {availableUsers[2].rollNumber}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          90% Eligible
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Login: <strong>{availableUsers[2].email}</strong> · Computer Science (Semester 4)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Student 2 (Alex Rivera - At-Risk Basic Details) */}
                <button
                  onClick={() => {
                    switchUser('u-student-2');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[3].avatar}
                      alt={availableUsers[3].name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800">
                          {availableUsers[3].name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          Student · Roll: {availableUsers[3].rollNumber}
                        </span>
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                          60% At Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Login: <strong>{availableUsers[3].email}</strong> · Computer Science
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Faculty: Prof. Sarah Jenkins */}
                <button
                  onClick={() => {
                    switchUser('u-faculty-1');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[0].avatar}
                      alt={availableUsers[0].name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                          {availableUsers[0].name}
                        </span>
                        <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded">
                          Faculty / Teacher
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Login: <strong>{availableUsers[0].email}</strong> · Data Structures & Cloud Systems
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address or Student Roll Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. student@school.edu or CS2026-001"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tip: Enter <strong>student@school.edu</strong> or <strong>CS2026-001</strong> for student login, or <strong>teacher@school.edu</strong> for faculty
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      role === 'student'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      role === 'teacher'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Teacher / Faculty
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Student Attendance Tracker</span>
          <span>Basic Details & Fast Authentication</span>
        </div>
      </div>
    </div>
  );
};
