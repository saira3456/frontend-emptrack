// User roles
export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

// User/Authentication
export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  joinDate?: string;
}

// Employee
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  manager?: string;
  projects?: string[];
}

// Department
export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  manager: string;
  budget: number;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  budget: number;
  department: string;
}

// Attendance
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  leaveType?: 'sick' | 'vacation' | 'personal' | 'other';
}

// Salary
export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

// Leave Request
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  appliedDate: string;
}

// Activity/Log
export interface Activity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
