import {
  User,
  Employee,
  Department,
  Project,
  AttendanceRecord,
  SalaryRecord,
  LeaveRequest,
  Activity,
} from './types';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@emptrack.com',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
    position: 'System Administrator',
  },
  {
    id: 'user-2',
    email: 'john.doe@emptrack.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Senior Engineer',
  },
  {
    id: 'user-3',
    email: 'jane.smith@emptrack.com',
    name: 'Jane Smith',
    // role: 'hr', // 'hr' is not a valid role type - remove or change to 'employee'
    role: 'employee', // Changed from 'hr' to 'employee'
    department: 'Human Resources',
    position: 'HR Manager',
  },
];

// Mock employees
// First, let's define department mappings
const departmentMap: Record<string, number> = {
  'Engineering': 1,
  'Human Resources': 2,
  'Product': 3,
  'Design': 4,
  'Sales': 5,
};

const managerMap: Record<string, number> = {
  'Sarah Johnson': 4, // emp-4
  'Alex Rivera': 6,   // emp-6
  'James Wilson': 7,  // Would need to be added
  'Lisa Anderson': 8, // Would need to be added
};

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john.doe@emptrack.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Engineer',
    departmentId: departmentMap['Engineering'], // Added
    department: 'Engineering',
    salary: 95000,
    joinDate: '2021-03-15',
    status: 'active',
    managerId: managerMap['Sarah Johnson'], // Added
    manager: 'Sarah Johnson',
    projects: ['proj-1', 'proj-3'],
  },
  {
    id: 'emp-2',
    name: 'Jane Smith',
    email: 'jane.smith@emptrack.com',
    phone: '+1 (555) 234-5678',
    position: 'HR Manager',
    departmentId: departmentMap['Human Resources'], // Added
    department: 'Human Resources',
    salary: 75000,
    joinDate: '2020-06-01',
    status: 'active',
    projects: [],
  },
  {
    id: 'emp-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@emptrack.com',
    phone: '+1 (555) 345-6789',
    position: 'Product Manager',
    departmentId: departmentMap['Product'], // Added
    department: 'Product',
    salary: 85000,
    joinDate: '2019-09-10',
    status: 'active',
    managerId: managerMap['Sarah Johnson'], // Added
    manager: 'Sarah Johnson',
    projects: ['proj-1', 'proj-2'],
  },
  {
    id: 'emp-4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@emptrack.com',
    phone: '+1 (555) 456-7890',
    position: 'Engineering Director',
    departmentId: departmentMap['Engineering'], // Added
    department: 'Engineering',
    salary: 120000,
    joinDate: '2018-01-20',
    status: 'active',
    projects: ['proj-1', 'proj-3'],
  },
  {
    id: 'emp-5',
    name: 'Emily Chen',
    email: 'emily.chen@emptrack.com',
    phone: '+1 (555) 567-8901',
    position: 'UI/UX Designer',
    departmentId: departmentMap['Design'], // Added
    department: 'Design',
    salary: 78000,
    joinDate: '2021-11-05',
    status: 'active',
    managerId: managerMap['Alex Rivera'], // Added
    manager: 'Alex Rivera',
    projects: ['proj-2', 'proj-3'],
  },
  {
    id: 'emp-6',
    name: 'Alex Rivera',
    email: 'alex.rivera@emptrack.com',
    phone: '+1 (555) 678-9012',
    position: 'Design Lead',
    departmentId: departmentMap['Design'], // Added
    department: 'Design',
    salary: 88000,
    joinDate: '2020-04-12',
    status: 'active',
    projects: ['proj-1', 'proj-2'],
  },
];

// Mock departments - update to include managerId and remove manager string
export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    description: 'Software development and infrastructure',
    employeeCount: 8,
    managerId: 4, // Sarah Johnson's employee ID
    manager: 'Sarah Johnson',
    budget: 1500000,
  },
  {
    id: 'dept-2',
    name: 'Product',
    description: 'Product management and strategy',
    employeeCount: 4,
    managerId: 7, // James Wilson (would need to be added)
    manager: 'James Wilson',
    budget: 300000,
  },
  {
    id: 'dept-3',
    name: 'Design',
    description: 'UI/UX and brand design',
    employeeCount: 5,
    managerId: 6, // Alex Rivera
    manager: 'Alex Rivera',
    budget: 250000,
  },
  {
    id: 'dept-4',
    name: 'Sales',
    description: 'Business development and sales',
    employeeCount: 6,
    managerId: 8, // Lisa Anderson (would need to be added)
    manager: 'Lisa Anderson',
    budget: 500000,
  },
  {
    id: 'dept-5',
    name: 'Human Resources',
    description: 'HR and recruiting',
    employeeCount: 3,
    managerId: 2, // Jane Smith
    manager: 'Jane Smith',
    budget: 150000,
  },
];

// Mock projects - update to include departmentId
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of the mobile application UI/UX',
    status: 'in-progress',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    team: ['emp-1', 'emp-5', 'emp-6'],
    budget: 250000,
    departmentId: departmentMap['Product'], // Added
    department: 'Product',
  },
  {
    id: 'proj-2',
    name: 'API Infrastructure Upgrade',
    description: 'Modernize backend infrastructure and APIs',
    status: 'in-progress',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    team: ['emp-3', 'emp-6'],
    budget: 350000,
    departmentId: departmentMap['Engineering'], // Added
    department: 'Engineering',
  },
  {
    id: 'proj-3',
    name: 'Analytics Dashboard',
    description: 'Build comprehensive analytics dashboard for clients',
    status: 'planning',
    progress: 20,
    startDate: '2024-03-01',
    endDate: '2024-07-31',
    team: ['emp-1', 'emp-4', 'emp-5'],
    budget: 180000,
    departmentId: departmentMap['Product'], // Added
    department: 'Product',
  },
  {
    id: 'proj-4',
    name: 'Security Audit & Enhancement',
    description: 'Comprehensive security audit and improvements',
    status: 'completed',
    progress: 100,
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    team: ['emp-1', 'emp-4'],
    budget: 120000,
    departmentId: departmentMap['Engineering'], // Added
    department: 'Engineering',
  },
];

// Mock attendance records - fix leaveType (it should only be present when status is 'leave')
export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: '2024-03-08',
    checkIn: '09:00',
    checkOut: '18:30',
    status: 'present',
  },
  {
    id: 'att-2',
    employeeId: 'emp-1',
    date: '2024-03-07',
    checkIn: '09:15',
    checkOut: '18:00',
    status: 'present',
  },
  {
    id: 'att-3',
    employeeId: 'emp-2',
    date: '2024-03-08',
    checkIn: '08:45',
    checkOut: '17:45',
    status: 'present',
  },
  {
    id: 'att-4',
    employeeId: 'emp-3',
    date: '2024-03-08',
    checkIn: '09:30',
    status: 'leave', // Changed from 'present' with leaveType to 'leave'
    leaveType: 'vacation', // leaveType only when status is 'leave'
  },
  {
    id: 'att-5',
    employeeId: 'emp-4',
    date: '2024-03-08',
    checkIn: '08:30',
    checkOut: '19:00',
    status: 'present',
  },
];

// Mock salary records - fix property names to match SalaryRecord interface
export const mockSalaries: SalaryRecord[] = [
  {
    id: 'sal-1',
    employeeId: 'emp-1',
    month: '2024-02',
    basicSalary: 95000, // Changed from baseSalary
    allowances: 5000,   // Changed from bonus
    deductions: 8500,
    netSalary: 91500,
    status: 'paid',
  },
  {
    id: 'sal-2',
    employeeId: 'emp-2',
    month: '2024-02',
    basicSalary: 75000, // Changed from baseSalary
    allowances: 0,      // Changed from bonus
    deductions: 6500,
    netSalary: 68500,
    status: 'paid',
  },
  {
    id: 'sal-3',
    employeeId: 'emp-3',
    month: '2024-02',
    basicSalary: 85000, // Changed from baseSalary
    allowances: 7000,   // Changed from bonus
    deductions: 7500,
    netSalary: 84500,
    status: 'paid',
  },
  {
    id: 'sal-4',
    employeeId: 'emp-1',
    month: '2024-03',
    basicSalary: 95000, // Changed from baseSalary
    allowances: 3000,   // Changed from bonus
    deductions: 8500,
    netSalary: 89500,
    status: 'processed',
  },
];

// Mock leave requests - fix property names
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-1',
    employeeName: 'John Doe', // Added
    type: 'vacation',
    startDate: '2024-04-15',
    endDate: '2024-04-19',
    reason: 'Summer vacation',
    status: 'approved',
    approvedBy: 'emp-4',
    approverName: 'Sarah Johnson', // Added
    appliedDate: '2024-03-01',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-2',
    employeeName: 'Jane Smith', // Added
    type: 'sick',
    startDate: '2024-03-09',
    endDate: '2024-03-10',
    reason: 'Flu',
    status: 'pending',
    appliedDate: '2024-03-08',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-5',
    employeeName: 'Emily Chen', // Added
    type: 'personal',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    reason: 'Personal appointment',
    status: 'approved',
    approvedBy: 'emp-6',
    approverName: 'Alex Rivera', // Added
    appliedDate: '2024-03-05',
  },
];

// Mock activities - add userName
export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    userId: 'emp-1',
    userName: 'John Doe', // Added
    action: 'Clocked in',
    timestamp: '2024-03-08T09:00:00Z',
  },
  {
    id: 'act-2',
    userId: 'emp-2',
    userName: 'Jane Smith', // Added
    action: 'Submitted leave request',
    timestamp: '2024-03-08T10:30:00Z',
    details: { type: 'sick', days: 2 },
  },
  {
    id: 'act-3',
    userId: 'emp-4',
    userName: 'Sarah Johnson', // Added
    action: 'Approved leave request',
    timestamp: '2024-03-08T11:00:00Z',
    details: { employeeId: 'emp-5', leaveId: 'leave-3' },
  },
  {
    id: 'act-4',
    userId: 'emp-3',
    userName: 'Mike Johnson', // Added
    action: 'Updated project status',
    timestamp: '2024-03-08T14:15:00Z',
    details: { projectId: 'proj-1', status: 'in-progress', progress: 65 },
  },
  {
    id: 'act-5',
    userId: 'emp-1',
    userName: 'John Doe', // Added
    action: 'Clocked out',
    timestamp: '2024-03-08T18:30:00Z',
  },
];

// Helper function to get employee by ID
export function getEmployeeById(id: string): Employee | undefined {
  return mockEmployees.find((emp) => emp.id === id);
}

// Helper function to get department by ID
export function getDepartmentById(id: string): Department | undefined {
  return mockDepartments.find((dept) => dept.id === id);
}

// Helper function to get project by ID
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((proj) => proj.id === id);
}

// Helper function to get user by email
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

// Helper function to get attendance by employee and date
export function getAttendanceByEmployeeAndDate(
  employeeId: string,
  date: string
): AttendanceRecord | undefined {
  return mockAttendance.find(
    (att) => att.employeeId === employeeId && att.date === date
  );
}