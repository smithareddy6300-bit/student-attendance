import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useAttendance();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-sm font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
