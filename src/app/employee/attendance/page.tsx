'use client';

import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAttendance, mockEmployees } from '@/lib/mock-data';
import { formatDate } from '@/lib/date-utils';
import { Calendar, CheckCircle, XCircle, Clock, Moon, Umbrella } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const currentEmployee = mockEmployees[0];
  const employeeAttendance = mockAttendance.filter(a => a.employeeId === currentEmployee.id);
  
  // Calculate attendance stats
  const present = employeeAttendance.filter(a => a.status === 'present').length;
  const absent = employeeAttendance.filter(a => a.status === 'absent').length;
  const leave = employeeAttendance.filter(a => a.status === 'leave').length;
  const halfDay = employeeAttendance.filter(a => a.status === 'half-day').length;
  const holiday = employeeAttendance.filter(a => a.status === 'holiday').length;
  
  const total = employeeAttendance.length;
  // Calculate present percentage (excluding holidays and leaves from total working days)
  const workingDays = employeeAttendance.filter(a => 
    a.status !== 'holiday' && a.status !== 'leave'
  ).length;
  const percentage = workingDays > 0 ? ((present / workingDays) * 100).toFixed(1) : 0;

  // Function to get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'present':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'absent':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'leave':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'holiday':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'half-day':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'leave':
        return <Moon className="w-5 h-5 text-blue-600" />;
      case 'holiday':
        return <Umbrella className="w-5 h-5 text-purple-600" />;
      case 'half-day':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <EmployeeLayoutWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-2">View and track your attendance records</p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Days</p>
                <p className="text-2xl font-bold text-foreground">{total}</p>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-card border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Present</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{present}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Half Day</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{halfDay}</p>
              </div>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Leave</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{leave}</p>
              </div>
              <Moon className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Absent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{absent}</p>
              </div>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holiday Stats Card (if any) */}
      {holiday > 0 && (
        <Card className="border-border/40 bg-card border-purple-500/20 mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Holidays</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{holiday}</p>
              </div>
              <Umbrella className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Percentage */}
      <Card className="border-border/40 bg-card mb-8">
        <CardHeader>
          <CardTitle>Attendance Percentage</CardTitle>
          <CardDescription>Your overall attendance rate (excluding holidays and leaves)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="text-5xl font-bold text-primary">{percentage}%</div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-teal-600 transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {present} days present out of {workingDays} working days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Your recent attendance history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {employeeAttendance.length === 0 ? (
              <p className="text-muted-foreground text-sm">No attendance records</p>
            ) : (
              employeeAttendance.slice(0, 20).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium text-foreground">{formatDate(record.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.checkIn} - {record.checkOut || 'In Progress'}
                        {record.leaveType && ` (${record.leaveType})`}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(record.status)}>
                    {record.status === 'half-day' ? 'Half Day' : 
                     record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </EmployeeLayoutWrapper>
  );
}