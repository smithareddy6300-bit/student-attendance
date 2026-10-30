export type Role = 'teacher' | 'student' | 'admin';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  rollNumber?: string;
  enrolledCourses?: string[];
  teachingCourses?: string[];
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  avatar: string;
  courseId: string;
  courseName: string;
  semester: string;
  section: string;
  contactPhone: string;
  parentPhone?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  admissionYear?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  instructorId: string;
  instructorName: string;
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    time: string;
    room: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
  timestamp: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminRemark?: string;
}

export interface ActiveSession {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  timeSlot: string;
  room: string;
  pin: string;
  expiresAt: string;
  active: boolean;
  checkedInStudentIds: string[];
}

export interface CourseStats {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  averageAttendanceRate: number;
  totalEnrolled: number;
  atRiskCount: number;
}
