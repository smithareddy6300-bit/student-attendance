import { User, Student, Course, AttendanceRecord, LeaveRequest, ActiveSession } from '../types/attendance';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-faculty-1',
    name: 'Prof. Sarah Jenkins',
    email: 'teacher@school.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    teachingCourses: ['c-cs101', 'c-cs204'],
  },
  {
    id: 'u-faculty-2',
    name: 'Dr. Robert Miller',
    email: 'robert.miller@school.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Applied Mathematics',
    teachingCourses: ['c-mth201'],
  },
  {
    id: 'u-student-1',
    name: 'Emma Watson',
    email: 'student@school.edu',
    role: 'student',
    rollNumber: 'CS2026-001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    enrolledCourses: ['c-cs101', 'c-cs204', 'c-mth201', 'c-phy102'],
  },
  {
    id: 'u-student-2',
    name: 'Alex Rivera',
    email: 'student2@school.edu',
    role: 'student',
    rollNumber: 'CS2026-002',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    enrolledCourses: ['c-cs101', 'c-cs204', 'c-mth201'],
  },
  {
    id: 'u-admin-1',
    name: 'Dean Arthur Pendelton',
    email: 'admin@school.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Academic Affairs',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-cs101',
    code: 'CS101',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    semester: 'Semester 4',
    credits: 4,
    instructorId: 'u-faculty-1',
    instructorName: 'Prof. Sarah Jenkins',
    schedule: [
      { day: 'Monday', time: '09:00 AM - 10:30 AM', room: 'Hall 302' },
      { day: 'Wednesday', time: '09:00 AM - 10:30 AM', room: 'Hall 302' },
      { day: 'Friday', time: '11:00 AM - 12:30 PM', room: 'Lab 4B' },
    ],
  },
  {
    id: 'c-cs204',
    code: 'CS204',
    name: 'Cloud Computing & Distributed Systems',
    department: 'Computer Science',
    semester: 'Semester 4',
    credits: 3,
    instructorId: 'u-faculty-1',
    instructorName: 'Prof. Sarah Jenkins',
    schedule: [
      { day: 'Tuesday', time: '11:00 AM - 12:30 PM', room: 'Hall 105' },
      { day: 'Thursday', time: '11:00 AM - 12:30 PM', room: 'Hall 105' },
    ],
  },
  {
    id: 'c-mth201',
    code: 'MTH201',
    name: 'Probability & Linear Algebra',
    department: 'Applied Mathematics',
    semester: 'Semester 4',
    credits: 4,
    instructorId: 'u-faculty-2',
    instructorName: 'Dr. Robert Miller',
    schedule: [
      { day: 'Monday', time: '01:30 PM - 03:00 PM', room: 'Hall 201' },
      { day: 'Wednesday', time: '01:30 PM - 03:00 PM', room: 'Hall 201' },
    ],
  },
  {
    id: 'c-phy102',
    code: 'PHY102',
    name: 'Applied Electromagnetism & Quantum Basics',
    department: 'Physics',
    semester: 'Semester 4',
    credits: 3,
    instructorId: 'u-faculty-1',
    instructorName: 'Prof. Sarah Jenkins',
    schedule: [
      { day: 'Tuesday', time: '02:00 PM - 03:30 PM', room: 'Science Lab A' },
      { day: 'Friday', time: '02:00 PM - 03:30 PM', room: 'Hall 108' },
    ],
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    rollNumber: 'CS2026-001',
    name: 'Emma Watson',
    email: 'student@school.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 345-6789',
    parentPhone: '+1 (555) 345-6700',
    gender: 'Female',
    dob: '2004-05-14',
    bloodGroup: 'O+',
    admissionYear: '2024',
  },
  {
    id: 's-2',
    rollNumber: 'CS2026-002',
    name: 'Alex Rivera',
    email: 'student2@school.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 678-9012',
    parentPhone: '+1 (555) 678-9000',
    gender: 'Male',
    dob: '2004-08-22',
    bloodGroup: 'B+',
    admissionYear: '2024',
  },
  {
    id: 's-3',
    rollNumber: 'CS2026-003',
    name: 'Liam Chen',
    email: 'liam.chen@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 234-8901',
    parentPhone: '+1 (555) 234-8900',
    gender: 'Male',
    dob: '2004-03-10',
    bloodGroup: 'A+',
    admissionYear: '2024',
  },
  {
    id: 's-4',
    rollNumber: 'CS2026-004',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@student.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 456-7812',
    parentPhone: '+1 (555) 456-7800',
    gender: 'Female',
    dob: '2004-11-29',
    bloodGroup: 'AB+',
    admissionYear: '2024',
  },
  {
    id: 's-5',
    rollNumber: 'CS2026-005',
    name: 'Marcus Brody',
    email: 'marcus.b@student.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 567-8901',
    parentPhone: '+1 (555) 567-8900',
    gender: 'Male',
    dob: '2004-01-18',
    bloodGroup: 'O-',
    admissionYear: '2024',
  },
  {
    id: 's-6',
    rollNumber: 'CS2026-006',
    name: 'Chloe Kim',
    email: 'chloe.kim@student.edu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 789-0123',
    parentPhone: '+1 (555) 789-0100',
    gender: 'Female',
    dob: '2004-07-04',
    bloodGroup: 'A-',
    admissionYear: '2024',
  },
  {
    id: 's-7',
    rollNumber: 'CS2026-007',
    name: 'Jordan Hayes',
    email: 'jordan.h@student.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section B',
    contactPhone: '+1 (555) 890-1234',
    parentPhone: '+1 (555) 890-1200',
    gender: 'Male',
    dob: '2003-12-15',
    bloodGroup: 'B-',
    admissionYear: '2024',
  },
  {
    id: 's-8',
    rollNumber: 'CS2026-008',
    name: 'Zara Patel',
    email: 'zara.patel@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section B',
    contactPhone: '+1 (555) 901-2345',
    parentPhone: '+1 (555) 901-2300',
    gender: 'Female',
    dob: '2004-09-08',
    bloodGroup: 'O+',
    admissionYear: '2024',
  },
  {
    id: 's-9',
    rollNumber: 'CS2026-009',
    name: 'Devon Vance',
    email: 'devon.v@student.edu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section B',
    contactPhone: '+1 (555) 912-3456',
    parentPhone: '+1 (555) 912-3400',
    gender: 'Male',
    dob: '2004-06-30',
    bloodGroup: 'A+',
    admissionYear: '2024',
  },
  {
    id: 's-10',
    rollNumber: 'CS2026-010',
    name: 'Maya Lin',
    email: 'maya.lin@student.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section B',
    contactPhone: '+1 (555) 923-4567',
    parentPhone: '+1 (555) 923-4500',
    gender: 'Female',
    dob: '2004-04-12',
    bloodGroup: 'B+',
    admissionYear: '2024',
  },
  {
    id: 's-11',
    rollNumber: 'CS2026-011',
    name: 'Tyler Johnson',
    email: 'tyler.j@student.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section B',
    contactPhone: '+1 (555) 934-5678',
    parentPhone: '+1 (555) 934-5600',
    gender: 'Male',
    dob: '2003-10-25',
    bloodGroup: 'O+',
    admissionYear: '2024',
  },
  {
    id: 's-12',
    rollNumber: 'CS2026-012',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.m@student.edu',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    semester: 'Semester 4',
    section: 'Section A',
    contactPhone: '+1 (555) 945-6789',
    parentPhone: '+1 (555) 945-6700',
    gender: 'Female',
    dob: '2004-02-19',
    bloodGroup: 'AB-',
    admissionYear: '2024',
  },
];

// Helper to generate past dates
const generateHistoricalRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = [
    '2026-10-06',
    '2026-10-08',
    '2026-10-10',
    '2026-10-13',
    '2026-10-15',
    '2026-10-17',
    '2026-10-20',
    '2026-10-22',
    '2026-10-24',
    '2026-10-27',
  ];

  INITIAL_STUDENTS.forEach((student, index) => {
    dates.forEach((date, dateIdx) => {
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      let notes = '';

      if (student.rollNumber === 'CS2026-002') {
        // Alex Rivera: ~60% attendance (At-Risk)
        if (dateIdx % 3 === 0) {
          status = 'absent';
          notes = 'Unexcused absence';
        } else if (dateIdx === 7) {
          status = 'late';
          notes = 'Joined 20 mins late';
        }
      } else if (student.rollNumber === 'CS2026-005') {
        // Marcus Brody: ~70% attendance
        if (dateIdx === 2 || dateIdx === 5 || dateIdx === 8) {
          status = 'absent';
          notes = 'Absent - flu reported';
        }
      } else if (student.rollNumber === 'CS2026-001') {
        // Emma Watson: 90% attendance
        if (dateIdx === 4) {
          status = 'excused';
          notes = 'Medical certificate submitted';
        }
      } else {
        const hash = (index * 7 + dateIdx * 13) % 10;
        if (hash === 0) {
          status = 'absent';
        } else if (hash === 1) {
          status = 'late';
          notes = 'Traffic delay';
        } else if (hash === 2 && dateIdx === 6) {
          status = 'excused';
          notes = 'Varsity athletic match';
        }
      }

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        courseId: 'c-cs101',
        date,
        timeSlot: '09:00 AM - 10:30 AM',
        status,
        markedBy: 'Prof. Sarah Jenkins',
        notes: notes || undefined,
        timestamp: `${date}T09:15:00.000Z`,
      });
    });
  });

  return records;
};

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = generateHistoricalRecords();

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-1',
    studentId: 's-1',
    studentName: 'Emma Watson',
    rollNumber: 'CS2026-001',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    reason: 'Medical appointment for dental surgery. Doctor note submitted.',
    status: 'approved',
    submittedAt: '2026-10-14T18:30:00Z',
    reviewedBy: 'Prof. Sarah Jenkins',
    reviewedAt: '2026-10-15T08:00:00Z',
    adminRemark: 'Approved with medical slip. Excused attendance granted.',
  },
  {
    id: 'lr-2',
    studentId: 's-2',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2026-002',
    courseId: 'c-cs101',
    courseName: 'Data Structures & Algorithms',
    startDate: '2026-10-30',
    endDate: '2026-10-31',
    reason: 'Attending regional Hackathon representing University Robotics Club.',
    status: 'pending',
    submittedAt: '2026-10-28T14:15:00Z',
  },
  {
    id: 'lr-3',
    studentId: 's-4',
    studentName: 'Sophia Rodriguez',
    rollNumber: 'CS2026-004',
    courseId: 'c-cs204',
    courseName: 'Cloud Computing & Distributed Systems',
    startDate: '2026-11-02',
    endDate: '2026-11-03',
    reason: 'Family wedding event out of state.',
    status: 'pending',
    submittedAt: '2026-10-29T10:00:00Z',
  },
];

export const INITIAL_ACTIVE_SESSION: ActiveSession = {
  id: 'ses-today',
  courseId: 'c-cs101',
  courseName: 'Data Structures & Algorithms',
  date: '2026-10-30',
  timeSlot: '09:00 AM - 10:30 AM',
  room: 'Hall 302',
  pin: '7482',
  expiresAt: '2026-10-30T10:45:00Z',
  active: true,
  checkedInStudentIds: ['s-3', 's-4', 's-5'],
};
