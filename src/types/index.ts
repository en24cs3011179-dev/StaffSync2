export type UserRole = 'hr' | 'manager' | 'employee';

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
export type WorkType = 'Office' | 'Remote' | 'Hybrid';

export type LeaveType = 'Casual' | 'Sick' | 'Earned' | 'Maternity' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type AnnouncementCategory = 'General' | 'Policy' | 'Holiday' | 'Urgent';
export type PriorityLevel = 'Low' | 'Medium' | 'High';

export type TrainingCategory = 'Technical' | 'Compliance' | 'Leadership' | 'Soft Skills';
export type TrainingStatus = 'Upcoming' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatar: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  managerId?: string;
  managerName?: string;
}

export interface EmployeeDetails {
  id: string; // matches User.id
  employeeId: string;
  personalInfo: {
    dob: string;
    gender: string;
    bloodGroup: string;
    address: string;
    emergencyContact: {
      name: string;
      relation: string;
      phone: string;
    };
  };
  compensation: {
    baseSalary: number;
    currency: string;
    bankName: string;
    accountNumber: string;
  };
  skills: string[];
  leaveBalance: {
    casual: number;
    sick: number;
    earned: number;
    maternity: number;
    unpaid: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:MM:SS
  clockOut?: string; // HH:MM:SS
  workingHours: number;
  status: AttendanceStatus;
  workType: WorkType;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  leaveId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewerName?: string;
  reviewRemarks?: string;
  rejectionReason?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  content: string;
  targetRole: 'All' | 'Employee' | 'Manager' | 'HR';
  priority: PriorityLevel;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
}

export interface TrainingProgram {
  id: string;
  title: string;
  category: TrainingCategory;
  instructor: string;
  durationHours: number;
  scheduleDate: string;
  maxParticipants: number;
  enrolledEmployeeIds: string[];
  status: TrainingStatus;
  description: string;
  learningOutcomes: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'announcement' | 'training' | 'system';
  isRead: boolean;
  createdAt: string;
  linkToTab?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}
