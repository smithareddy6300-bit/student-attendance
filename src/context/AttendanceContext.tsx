import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Course,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  ActiveSession,
} from '../types/attendance';
import {
  INITIAL_STUDENTS,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ACTIVE_SESSION,
} from '../data/mockData';

interface StudentStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number; // percentage 0-100
  isAtRisk: boolean; // < 75%
}

interface CourseSummary {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  averageRate: number;
  enrolledStudentsCount: number;
  atRiskCount: number;
}

interface AttendanceContextType {
  students: Student[];
  courses: Course[];
  records: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  activeSession: ActiveSession | null;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  // Actions
  saveBatchAttendance: (newRecords: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    courseId: string;
    date: string;
    timeSlot: string;
    status: AttendanceStatus;
    markedBy: string;
    notes?: string;
  }[]) => void;
  updateAttendanceStatus: (recordId: string, status: AttendanceStatus, notes?: string) => void;
  addStudent: (studentData: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  submitLeaveRequest: (request: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    courseId: string;
    courseName: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => void;
  reviewLeaveRequest: (
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerName: string,
    remark?: string
  ) => void;
  startSession: (courseId: string, timeSlot: string, room: string) => ActiveSession;
  endSession: () => void;
  checkInWithPin: (pin: string, studentId: string) => { success: boolean; message: string };
  getStudentStats: (studentId: string, courseId?: string) => StudentStats;
  getCourseSummary: (courseId: string) => CourseSummary;
  getAllCoursesSummary: () => CourseSummary[];
  resetToDefaultData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'sat_students_v1',
  COURSES: 'sat_courses_v1',
  RECORDS: 'sat_records_v1',
  LEAVE: 'sat_leave_v1',
  SESSION: 'sat_session_v1',
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COURSES);
      return stored ? JSON.parse(stored) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return stored ? JSON.parse(stored) : INITIAL_ATTENDANCE_RECORDS;
    } catch {
      return INITIAL_ATTENDANCE_RECORDS;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEAVE);
      return stored ? JSON.parse(stored) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVE_SESSION;
    } catch {
      return INITIAL_ACTIVE_SESSION;
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>('c-cs101');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVE, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [activeSession]);

  const saveBatchAttendance = (
    newEntries: {
      studentId: string;
      studentName: string;
      rollNumber: string;
      courseId: string;
      date: string;
      timeSlot: string;
      status: AttendanceStatus;
      markedBy: string;
      notes?: string;
    }[]
  ) => {
    setRecords((prev) => {
      const updated = [...prev];
      newEntries.forEach((entry) => {
        const existingIdx = updated.findIndex(
          (r) =>
            r.studentId === entry.studentId &&
            r.courseId === entry.courseId &&
            r.date === entry.date
        );

        const newRec: AttendanceRecord = {
          id: existingIdx >= 0 ? updated[existingIdx].id : `att-${entry.studentId}-${entry.date}`,
          studentId: entry.studentId,
          studentName: entry.studentName,
          rollNumber: entry.rollNumber,
          courseId: entry.courseId,
          date: entry.date,
          timeSlot: entry.timeSlot,
          status: entry.status,
          markedBy: entry.markedBy,
          notes: entry.notes,
          timestamp: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = newRec;
        } else {
          updated.push(newRec);
        }
      });
      return updated;
    });

    showToast(`Saved attendance for ${newEntries.length} students on ${newEntries[0]?.date || 'selected date'}`);
  };

  const updateAttendanceStatus = (recordId: string, status: AttendanceStatus, notes?: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, status, notes: notes !== undefined ? notes : r.notes } : r
      )
    );
    showToast('Record updated successfully');
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const id = `s-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id,
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Added student ${newStudent.name} (${newStudent.rollNumber})`);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    showToast(`Updated profile for ${updatedStudent.name}`);
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setRecords((prev) => prev.filter((r) => r.studentId !== studentId));
    showToast(`Removed student ${student?.name || ''}`);
  };

  const submitLeaveRequest = (request: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    courseId: string;
    courseName: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      ...request,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
    showToast('Leave application submitted for faculty review');
  };

  const reviewLeaveRequest = (
    requestId: string,
    status: 'approved' | 'rejected',
    reviewerName: string,
    remark?: string
  ) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => {
        if (lr.id === requestId) {
          return {
            ...lr,
            status,
            reviewedBy: reviewerName,
            reviewedAt: new Date().toISOString(),
            adminRemark: remark || (status === 'approved' ? 'Leave approved by faculty' : 'Declined'),
          };
        }
        return lr;
      })
    );

    // If approved, automatically update attendance record for that date as 'excused'
    const req = leaveRequests.find((r) => r.id === requestId);
    if (req && status === 'approved') {
      const existing = records.find(
        (r) => r.studentId === req.studentId && r.courseId === req.courseId && r.date === req.startDate
      );
      if (existing) {
        updateAttendanceStatus(existing.id, 'excused', `Approved leave: ${req.reason}`);
      } else {
        setRecords((prev) => [
          ...prev,
          {
            id: `att-${req.studentId}-${req.startDate}`,
            studentId: req.studentId,
            studentName: req.studentName,
            rollNumber: req.rollNumber,
            courseId: req.courseId,
            date: req.startDate,
            timeSlot: '09:00 AM - 10:30 AM',
            status: 'excused',
            markedBy: reviewerName,
            notes: `Approved leave: ${req.reason}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }

    showToast(`Leave request marked as ${status}`);
  };

  const startSession = (courseId: string, timeSlot: string, room: string): ActiveSession => {
    const targetCourse = courses.find((c) => c.id === courseId);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const newSession: ActiveSession = {
      id: `ses-${Date.now()}`,
      courseId,
      courseName: targetCourse?.name || 'Class Lecture',
      date: new Date().toISOString().split('T')[0],
      timeSlot,
      room,
      pin,
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      active: true,
      checkedInStudentIds: [],
    };
    setActiveSession(newSession);
    showToast(`Generated check-in PIN ${pin} for ${newSession.courseName}`);
    return newSession;
  };

  const endSession = () => {
    if (activeSession) {
      setActiveSession((prev) => (prev ? { ...prev, active: false } : null));
      showToast('Live check-in session ended');
    }
  };

  const checkInWithPin = (
    pin: string,
    studentId: string
  ): { success: boolean; message: string } => {
    if (!activeSession || !activeSession.active) {
      return { success: false, message: 'No active lecture session is currently open for check-in.' };
    }

    if (activeSession.pin !== pin.trim()) {
      return { success: false, message: 'Invalid lecture PIN. Please check the screen or ask instructor.' };
    }

    if (activeSession.checkedInStudentIds.includes(studentId)) {
      return { success: false, message: 'You have already checked into this lecture.' };
    }

    // Add student to checked in list
    setActiveSession((prev) =>
      prev ? { ...prev, checkedInStudentIds: [...prev.checkedInStudentIds, studentId] } : null
    );

    const student = students.find((s) => s.id === studentId);
    if (student) {
      saveBatchAttendance([
        {
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          courseId: activeSession.courseId,
          date: activeSession.date,
          timeSlot: activeSession.timeSlot,
          status: 'present',
          markedBy: 'Self Check-in (PIN)',
          notes: 'Verified attendance via lecture PIN code',
        },
      ]);
    }

    return { success: true, message: 'Attendance successfully marked as Present!' };
  };

  const getStudentStats = (studentId: string, courseId?: string): StudentStats => {
    const studentRecords = records.filter(
      (r) => r.studentId === studentId && (!courseId || r.courseId === courseId)
    );

    const total = studentRecords.length;
    if (total === 0) {
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 100, isAtRisk: false };
    }

    const present = studentRecords.filter((r) => r.status === 'present').length;
    const absent = studentRecords.filter((r) => r.status === 'absent').length;
    const late = studentRecords.filter((r) => r.status === 'late').length;
    const excused = studentRecords.filter((r) => r.status === 'excused').length;

    // Weight: Present = 1, Late = 0.8, Excused = 1, Absent = 0
    const weightedPresent = present + late * 0.8 + excused;
    const rate = Math.round((weightedPresent / total) * 100);

    return {
      total,
      present,
      absent,
      late,
      excused,
      rate,
      isAtRisk: rate < 75,
    };
  };

  const getCourseSummary = (courseId: string): CourseSummary => {
    const targetCourse = courses.find((c) => c.id === courseId);
    const courseRecords = records.filter((r) => r.courseId === courseId);
    const uniqueDates = Array.from(new Set(courseRecords.map((r) => r.date)));
    const enrolledStudents = students.filter(
      (s) => s.courseId === courseId || (!s.courseId && courseId === 'c-cs101')
    );

    let totalPercentageSum = 0;
    let atRiskCount = 0;

    enrolledStudents.forEach((student) => {
      const stats = getStudentStats(student.id, courseId);
      totalPercentageSum += stats.rate;
      if (stats.isAtRisk) {
        atRiskCount++;
      }
    });

    const averageRate =
      enrolledStudents.length > 0 ? Math.round(totalPercentageSum / enrolledStudents.length) : 0;

    return {
      courseId,
      courseName: targetCourse?.name || 'Course',
      courseCode: targetCourse?.code || 'CRS',
      totalClasses: uniqueDates.length,
      averageRate,
      enrolledStudentsCount: enrolledStudents.length,
      atRiskCount,
    };
  };

  const getAllCoursesSummary = (): CourseSummary[] => {
    return courses.map((c) => getCourseSummary(c.id));
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setCourses(INITIAL_COURSES);
    setRecords(INITIAL_ATTENDANCE_RECORDS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setActiveSession(INITIAL_ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.LEAVE);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    showToast('Reset system to default sample data');
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        courses,
        records,
        leaveRequests,
        activeSession,
        selectedCourseId,
        setSelectedCourseId,
        selectedDate,
        setSelectedDate,
        saveBatchAttendance,
        updateAttendanceStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        submitLeaveRequest,
        reviewLeaveRequest,
        startSession,
        endSession,
        checkInWithPin,
        getStudentStats,
        getCourseSummary,
        getAllCoursesSummary,
        resetToDefaultData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
