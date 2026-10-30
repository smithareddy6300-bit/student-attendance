import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LogOut,
  User,
  RefreshCw,
  ChevronDown,
  UserCheck,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onResetData }) => {
  const { currentUser, logout, openLoginModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Strict Top Bar Contract: 4-5 single line nav links
  const teacherLinks = [
    { id: 'rollcall', label: 'Roll Call' },
    { id: 'students', label: 'Students' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'live-session', label: 'PIN Session' },
    { id: 'leaves', label: 'Leave Requests' },
  ];

  const studentLinks = [
    { id: 'dashboard', label: 'My Attendance' },
    { id: 'student-checkin', label: 'Check In' },
    { id: 'student-leaves', label: 'Apply Leave' },
    { id: 'schedule', label: 'Timetable' },
  ];

  const activeLinks = isTeacher ? teacherLinks : studentLinks;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <button
              onClick={() => onSelectTab(isTeacher ? 'rollcall' : 'dashboard')}
              className="text-base font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
            >
              Student Attendance Tracker
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {activeLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 cursor-pointer ${
                    isActive ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action / Account & Logout Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {currentUser.role === 'teacher' ? 'Faculty' : currentUser.role}
                      {currentUser.rollNumber ? ` · ${currentUser.rollNumber}` : ''}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {currentUser.role === 'teacher' ? 'Faculty Account' : 'Student Account'}
                        </span>
                        {currentUser.department && (
                          <span className="text-[10px] text-slate-500 truncate">
                            · {currentUser.department}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          openLoginModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Switch Account / Role</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onResetData();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                      >
                        <RefreshCw className="w-4 h-4 text-slate-400" />
                        <span>Reset Sample Data</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-4 border-t border-slate-100 text-xs font-medium text-slate-600 no-scrollbar">
          {activeLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`whitespace-nowrap px-2 py-1 rounded transition-colors ${
                currentTab === link.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
