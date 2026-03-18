'use client';

import { Calendar, DollarSign, Briefcase, Clock, FileText, Send } from 'lucide-react';
import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEmployees, mockProjects, mockSalaries, mockLeaveRequests } from '@/lib/mock-data';
import { formatDate, formatMonthYear } from '@/lib/date-utils';

export default function EmployeePortalPage() {
  // Get current employee (demo - John Doe)
  const currentEmployee = mockEmployees[0];
  const employeeProjects = mockProjects.filter(p => p.team.includes(currentEmployee.id));
  const employeeSalary = mockSalaries.find(s => s.employeeId === currentEmployee.id);
  const employeeLeaves = mockLeaveRequests.filter(l => l.employeeId === currentEmployee.id);

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
            <p className="text-lg font-semibold text-foreground">{currentEmployee.department}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Status
            </p>
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              Active
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
        {/* My Projects */}
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
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        {project.progress}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
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
            <CardDescription>Your remaining leaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vacation</span>
                <span className="font-semibold text-foreground">12 days</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sick</span>
                <span className="font-semibold text-foreground">8 days</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Personal</span>
                <span className="font-semibold text-foreground">3 days</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '30%' }}></div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Request Leave
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Your recent leave applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeeLeaves.length === 0 ? (
              <p className="text-muted-foreground text-sm">No leave requests</p>
            ) : (
              employeeLeaves.map((leave) => (
                <div key={leave.id} className="p-3 bg-muted/20 rounded-lg border border-border/40">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground capitalize">{leave.type} Leave</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </p>
                      </div>
                    <Badge className={
                      leave.status === 'approved' 
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : leave.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    }>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Latest Salary Information */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
            <CardDescription>Your latest salary details</CardDescription>
          </CardHeader>
          <CardContent>
            {employeeSalary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="font-semibold text-foreground">${employeeSalary.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Bonus</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+${employeeSalary.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg border border-border/40">
                  <span className="text-muted-foreground">Deductions</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">-${employeeSalary.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20 mt-2">
                  <span className="font-semibold text-foreground">Net Salary</span>
                  <span className="font-bold text-primary text-lg">${employeeSalary.netSalary.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Month: {formatMonthYear(employeeSalary.month + '-01')}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No salary information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-4 border-border/40">
          <Calendar className="w-5 h-5 mb-2 text-primary" />
          <span>Request Leave</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-4 border-border/40">
          <FileText className="w-5 h-5 mb-2 text-primary" />
          <span>View Payslip</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-4 border-border/40">
          <Clock className="w-5 h-5 mb-2 text-primary" />
          <span>Mark Attendance</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-4 border-border/40">
          <Send className="w-5 h-5 mb-2 text-primary" />
          <span>Send Feedback</span>
        </Button>
      </div>
    </EmployeeLayoutWrapper>
  );
}
