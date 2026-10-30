import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { courses } = useAttendance();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Weekly Class Timetable & Lecture Hall Schedule
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic semester class timings and assigned halls for Spring 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          // Find courses scheduled on this day
          const daySessions: {
            courseCode: string;
            courseName: string;
            time: string;
            room: string;
            instructor: string;
          }[] = [];

          courses.forEach((course) => {
            course.schedule.forEach((sch) => {
              if (sch.day === day) {
                daySessions.push({
                  courseCode: course.code,
                  courseName: course.name,
                  time: sch.time,
                  room: sch.room,
                  instructor: course.instructorName,
                });
              }
            });
          });

          // Sort by start time roughly
          daySessions.sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div
              key={day}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider text-center">
                {day}
              </div>

              <div className="p-3 space-y-3 flex-1">
                {daySessions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No scheduled lectures
                  </div>
                ) : (
                  daySessions.map((session, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1.5 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                          {session.courseCode}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {session.room}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {session.courseName}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.time}
                      </div>

                      <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-200/60">
                        {session.instructor}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
