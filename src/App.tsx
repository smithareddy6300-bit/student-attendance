/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Navbar } from './components/layout/Navbar';
import { Toast } from './components/layout/Toast';
import { LoginModal } from './components/auth/LoginModal';
import { RollCallSheet } from './components/attendance/RollCallSheet';
import { StudentRoster } from './components/attendance/StudentRoster';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { LiveSessionCheckIn } from './components/attendance/LiveSessionCheckIn';
import { StudentSelfCheckIn } from './components/attendance/StudentSelfCheckIn';
import { StudentDashboard } from './components/attendance/StudentDashboard';
import { LeaveManagement } from './components/attendance/LeaveManagement';
import { ScheduleView } from './components/attendance/ScheduleView';
import {
  GraduationCap,
  LogIn,
  CheckCircle,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

function AttendanceAppContent() {
  const { currentUser, isLoginModalOpen, openLoginModal, closeLoginModal, switchUser, availableUsers } = useAuth();
  const { resetToDefaultData } = useAttendance();

  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>(isTeacher ? 'rollcall' : 'dashboard');

  // Sync tab when user changes role
  useEffect(() => {
    if (currentUser?.role === 'student') {
      setCurrentTab('dashboard');
    } else if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
      if (['dashboard', 'student-checkin', 'student-leaves'].includes(currentTab)) {
        setCurrentTab('rollcall');
      }
    }
  }, [currentUser?.role]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onResetData={resetToDefaultData}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If user logged out completely */}
        {!currentUser ? (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Student Attendance Tracker
              </h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                Digital roll call, live classroom PIN check-in, 75% attendance threshold compliance, and leave management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto text-left">
              <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Basic Login Details
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Default password for all accounts: <strong className="font-mono text-slate-800">password123</strong>
                  </p>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Quick Access
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Student 1: Emma Watson */}
                <button
                  onClick={() => switchUser('u-student-1')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[2].avatar}
                      alt={availableUsers[2].name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {availableUsers[2].name}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Student
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {availableUsers[2].email} · Roll: {availableUsers[2].rollNumber}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Student 2: Alex Rivera (At Risk) */}
                <button
                  onClick={() => switchUser('u-student-2')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[3].avatar}
                      alt={availableUsers[3].name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {availableUsers[3].name}
                        </span>
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Student (60% At Risk)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {availableUsers[3].email} · Roll: {availableUsers[3].rollNumber}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Faculty: Prof. Sarah Jenkins */}
                <button
                  onClick={() => switchUser('u-faculty-1')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={availableUsers[0].avatar}
                      alt={availableUsers[0].name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {availableUsers[0].name}
                        </span>
                        <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                          Teacher / Faculty
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {availableUsers[0].email} · HOD Computer Science
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Custom credentials?</span>
                <button
                  onClick={openLoginModal}
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Enter Roll No or Email
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Faculty & Admin Views */}
            {isTeacher ? (
              <>
                {currentTab === 'rollcall' && <RollCallSheet />}
                {currentTab === 'students' && <StudentRoster />}
                {currentTab === 'analytics' && <AnalyticsDashboard />}
                {currentTab === 'live-session' && <LiveSessionCheckIn />}
                {currentTab === 'leaves' && <LeaveManagement />}
              </>
            ) : (
              /* Student Views */
              <>
                {currentTab === 'dashboard' && (
                  <StudentDashboard onNavigateToCheckIn={() => setCurrentTab('student-checkin')} />
                )}
                {currentTab === 'student-checkin' && <StudentSelfCheckIn />}
                {currentTab === 'student-leaves' && (
                  <StudentDashboard onNavigateToCheckIn={() => setCurrentTab('student-checkin')} />
                )}
                {currentTab === 'schedule' && <ScheduleView />}
              </>
            )}
          </>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Student Attendance Tracker · University Academic Management</span>
          <span>Mandatory 75% Examination Eligibility Policy</span>
        </div>
      </footer>

      {/* Floating Feedback Toast */}
      <Toast />

      {/* Login & Switch Profile Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <AttendanceAppContent />
      </AttendanceProvider>
    </AuthProvider>
  );
}
