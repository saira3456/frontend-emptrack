'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Briefcase, Clock, FileText, Send } from 'lucide-react';
import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Employee, SalaryRecord } from '@/lib/types';
import { formatDate, formatMonthYear } from '@/lib/date-utils';
import { EmployeeService } from '@/services/employee.service';
import { SalaryService } from '@/services/salary.service';
import { AuthService } from '@/services/auth.service';

// Dummy projects data (temporary)
const dummyProjects = [
  {
    id: '1',
    name: 'ERP System Development',
    description: 'Company-wide ERP system implementation',
    status: 'in-progress',
    progress: 65,
    department: 'Engineering',
    role: 'Frontend Developer'
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Customer mobile app UI/UX redesign',
    status: 'in-progress',
    progress: 40,
    department: 'Design',
    role: 'UI Designer'
  },
  {
    id: '3',
    name: 'Sales Dashboard',
    description: 'Interactive dashboard for sales team',
    status: 'planning',
    progress: 15,
    department: 'Engineering',
    role: 'Full Stack Developer'
  }
];

// Dummy leaves data (temporary)
const dummyLeaves = [
  {
    id: '1',
    type: 'vacation',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    reason: 'Family vacation to mountains',
    status: 'approved',
    appliedDate: '2024-03-01'
  },
  {
    id: '2',
    type: 'sick',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    reason: 'Flu and fever',
    status: 'approved',
    appliedDate: '2024-02-09'
  },
  {
    id: '3',
    type: 'personal',
    startDate: '2024-04-05',
    endDate: '2024-04-05',
    reason: 'Personal errand',
    status: 'pending',
    appliedDate: '2024-03-25'
  },
  {
    id: '4',
    type: 'vacation',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    reason: 'Year-end break',
    status: 'approved',
    appliedDate: '2024-01-05'
  }
];

export default function EmployeePortalPage() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employeeProjects] = useState(dummyProjects); // Using dummy data for now
  const [employeeLeaves] = useState(dummyLeaves); // Using dummy data for now
  const [employeeSalary, setEmployeeSalary] = useState<SalaryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaveBalances, setLeaveBalances] = useState({
    vacation: 12,
    sick: 8,
    personal: 3,
    used: {
      vacation: 0,
      sick: 0,
      personal: 0
    }
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Calculate leave balances from dummy data
  useEffect(() => {
    calculateLeaveBalances(dummyLeaves);
  }, []);

  const fetchEmployeeData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current logged in employee from auth
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'employee') {
        throw new Error('No employee logged in');
      }

      // Fetch employee details
      const employee = await EmployeeService.getEmployeeById(currentUser.id);
      setCurrentEmployee(employee);

      // Fetch employee's salary records
      const salaries = await SalaryService.getEmployeeSalaries(employee.id);
      if (salaries.length > 0) {
        setEmployeeSalary(salaries[0]); // Get latest salary
      }

    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load employee data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLeaveBalances = (leaves: any[]) => {
    // Ensure leaves is array
    if (!Array.isArray(leaves)) {
      return;
    }

    const used = {
      vacation: 0,
      sick: 0,
      personal: 0
    };

    leaves.forEach(leave => {
      if (leave?.status === 'approved') {
        const days = calculateDaysDifference(leave.startDate, leave.endDate);
        if (leave.type === 'vacation') used.vacation += days;
        if (leave.type === 'sick') used.sick += days;
        if (leave.type === 'personal') used.personal += days;
      }
    });

    setLeaveBalances(prev => ({
      ...prev,
      used
    }));
  };

  const calculateDaysDifference = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getRemainingLeaves = (type: keyof typeof leaveBalances) => {
    const total = leaveBalances[type] as number;
    const used = leaveBalances.used[type as keyof typeof leaveBalances.used] || 0;
    return total - used;
  };

  const getLeavePercentage = (type: keyof typeof leaveBalances) => {
    const total = leaveBalances[type] as number;
    const used = leaveBalances.used[type as keyof typeof leaveBalances.used] || 0;
    return (used / total) * 100;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
      'on-leave': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      'on-hold': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
      'in-progress': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
      planning: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      approved: 'bg-green-500/10 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      rejected: 'bg-red-500/10 text-red-700 dark:text-red-400'
    };
    return variants[status] || 'bg-gray-500/10 text-gray-700';
  };

  const handleRequestLeave = () => {
    // Navigate to leave request page or open modal
    window.location.href = '/employee/leaves/request';
  };

  const handleViewPayslip = () => {
    if (employeeSalary) {
      window.location.href = `/employee/salaries/${employeeSalary.id}`;
    }
  };

  const handleMarkAttendance = () => {
    window.location.href = '/employee/attendance';
  };

  const handleSendFeedback = () => {
    window.location.href = '/employee/feedback';
  };

  // Get only recent leaves (last 3)
  const recentLeaves = employeeLeaves.slice(0, 3);

  if (isLoading) {
    return (
      <EmployeeLayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  if (error || !currentEmployee) {
    return (
      <EmployeeLayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <p>Error: {error || 'Employee not found'}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchEmployeeData}
            >
              Try Again
            </Button>
          </div>
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  return (
    <EmployeeLayoutWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentEmployee.name}</h1>
        <p className="text-muted-foreground mt-2">Here's your personal workspace</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Department
            </p>
            <p className="text-lg font-semibold text-foreground">{currentEmployee.department || 'Not Assigned'}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Status
            </p>
            <Badge className={getStatusBadge(currentEmployee.status)}>
              {currentEmployee.status.charAt(0).toUpperCase() + currentEmployee.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Salary
            </p>
            <p className="text-lg font-semibold text-foreground">${(currentEmployee.salary / 1000).toFixed(0)}K/yr</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Join Date
            </p>
            <p className="text-lg font-semibold text-foreground">{formatDate(currentEmployee.joinDate)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* My Projects - Using Dummy Data */}
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
              <CardDescription>Projects you're currently working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {employeeProjects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects assigned yet</p>
              ) : (
                employeeProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-muted/20 rounded-lg border border-border/40">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            Department: {project.department}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Role: {project.role}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    {project.progress !== undefined && (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leave Balance */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your remaining leaves for the year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vacation</span>
                <span className="font-semibold text-foreground">
                  {getRemainingLeaves('vacation')} / {leaveBalances.vacation} days
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${getLeavePercentage('vacation')}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sick</span>
                <span className="font-semibold text-foreground">
                  {getRemainingLeaves('sick')} / {leaveBalances.sick} days
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${getLeavePercentage('sick')}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Personal</span>
                <span className="font-semibold text-foreground">
                  {getRemainingLeaves('personal')} / {leaveBalances.personal} days
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${getLeavePercentage('personal')}%` }}
                ></div>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleRequestLeave}
            >
              Request Leave
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests - Using Dummy Data */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your recent leave applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLeaves.length === 0 ? (
              <p className="text-muted-foreground text-sm">No leave requests yet</p>
            ) : (
              recentLeaves.map((leave) => (
                <div key={leave.id} className="p-3 bg-muted/20 rounded-lg border border-border/40">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground capitalize">{leave.type} Leave</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(leave.status)}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                </div>
              ))
            )}
            {employeeLeaves.length > 0 && (
              <Button 
                variant="link" 
                className="text-primary p-0"
                onClick={() => window.location.href = '/employee/leaves'}
              >
                View all requests →
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Latest Salary Information */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Latest Salary Information</CardTitle>
            <CardDescription>Your salary details for this month</CardDescription>
          </CardHeader>
          <CardContent>
            {employeeSalary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="font-semibold text-foreground">${employeeSalary.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Allowances</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+${employeeSalary.allowances?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Deductions</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">-${employeeSalary.deductions?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20 mt-2">
                  <span className="font-semibold text-foreground">Net Salary</span>
                  <span className="font-bold text-primary text-lg">${employeeSalary.netSalary.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Month: {formatMonthYear(employeeSalary.month + '-01')} • 
                  Status: <span className="capitalize">{employeeSalary.status}</span>
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">No salary information available for this month</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/employee/salaries'}
                >
                  View Salary History
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto flex flex-col items-center justify-center py-4 border-border/40 hover:border-primary/50 transition-colors"
          onClick={handleRequestLeave}
        >
          <Calendar className="w-5 h-5 mb-2 text-primary" />
          <span>Request Leave</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex flex-col items-center justify-center py-4 border-border/40 hover:border-primary/50 transition-colors"
          onClick={handleViewPayslip}
          disabled={!employeeSalary}
        >
          <FileText className="w-5 h-5 mb-2 text-primary" />
          <span>View Payslip</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex flex-col items-center justify-center py-4 border-border/40 hover:border-primary/50 transition-colors"
          onClick={handleMarkAttendance}
        >
          <Clock className="w-5 h-5 mb-2 text-primary" />
          <span>Mark Attendance</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex flex-col items-center justify-center py-4 border-border/40 hover:border-primary/50 transition-colors"
          onClick={handleSendFeedback}
        >
          <Send className="w-5 h-5 mb-2 text-primary" />
          <span>Send Feedback</span>
        </Button>
      </div>
    </EmployeeLayoutWrapper>
  );
}