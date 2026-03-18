// User/Authentication
export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  departmentId?: number;  // Changed from department string
  department?: string;     // Department name for display
  position?: string;
  phone?: string;
  joinDate?: string;
  role?: 'admin' | 'employee';
}

// Employee
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: number;     // Changed from department string
  department?: string;       // Department name (for display)
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  managerId?: number;        // New field
  manager?: string;          // Manager name
  projects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: number;     // Changed from department string
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  password: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;     // Dynamic count from database
  managerId?: number;        // New field
  manager?: string;          // Manager name
  budget: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description: string;
  managerId?: number;
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
  team: string[];            // Employee IDs
  teamMembers?: Employee[];  // Populated team data
  budget: number;
  departmentId?: number;      // New field
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectAssignment {
  // From employee_projects table
  id: number;
  employeeId: number;
  projectId: number;
  role: string;
  hoursAllocated: number;
  hoursWorked: number;
  joinedDate: string;
  assignmentStatus: string;
  
  // From projects table (joined data)
  projectName: string;           // ✅ Add this
  projectDescription: string;    // ✅ Add this (fixes your error!)
  projectStatus: string;         // ✅ Add this
  startDate: string;
  endDate: string;
  budget: number;                // ✅ Add this
  
  // Calculated fields
  teamCount: number;             // ✅ Add this
  progress: number;              // ✅ Add this
}

// Attendance
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'leave' | 'holiday' | 'half-day';
  leaveType?: 'sick' | 'vacation' | 'personal' | 'other';
  overtimeHours?: number;
  createdAt?: string;
}

// Salary
export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;             // Format: YYYY-MM
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate?: string;
  status: 'pending' | 'processed' | 'paid';
  employee?: Employee;
  createdAt?: string;
}

// Leave Request
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approverName?: string;
  appliedDate: string;
  updatedAt?: string;
}

// Activity/Log
export interface Activity {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Dashboard Stats
export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  activeProjects: number;
  monthlyPayroll: number;
  pendingLeaveRequests: number;
  attendanceToday: number;
  departmentStats: {
    departmentId: number;
    departmentName: string;
    employeeCount: number;
  }[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}