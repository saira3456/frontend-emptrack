'use client';

import { useState } from 'react';
import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockLeaveRequests, mockEmployees } from '@/lib/mock-data';
import { formatDate } from '@/lib/date-utils';
import { Calendar, Plus, Clock } from 'lucide-react';

export default function EmployeeLeavePage() {
  const currentEmployee = mockEmployees[0];
  const employeeLeaves = mockLeaveRequests.filter(l => l.employeeId === currentEmployee.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate leave balances
  const leaveBalances = {
    vacation: 12,
    sick: 8,
    personal: 3,
  };

  const usedLeaves = {
    vacation: employeeLeaves.filter(l => l.type === 'vacation' && l.status === 'approved').length,
    sick: employeeLeaves.filter(l => l.type === 'sick' && l.status === 'approved').length,
    personal: employeeLeaves.filter(l => l.type === 'personal' && l.status === 'approved').length,
  };

  return (
    <EmployeeLayoutWrapper>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground mt-2">Manage your leaves and check balance</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-border/40 bg-card border-blue-500/20">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Vacation Leave</span>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {leaveBalances.vacation - usedLeaves.vacation}
              </div>
              <div className="text-xs text-muted-foreground">
                {usedLeaves.vacation} used of {leaveBalances.vacation} days
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(usedLeaves.vacation / leaveBalances.vacation) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card border-green-500/20">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Sick Leave</span>
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {leaveBalances.sick - usedLeaves.sick}
              </div>
              <div className="text-xs text-muted-foreground">
                {usedLeaves.sick} used of {leaveBalances.sick} days
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(usedLeaves.sick / leaveBalances.sick) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card border-orange-500/20">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Personal Leave</span>
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {leaveBalances.personal - usedLeaves.personal}
              </div>
              <div className="text-xs text-muted-foreground">
                {usedLeaves.personal} used of {leaveBalances.personal} days
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${(usedLeaves.personal / leaveBalances.personal) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Timeline */}
      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Leave Requests
          </CardTitle>
          <CardDescription>Your leave application history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employeeLeaves.length === 0 ? (
              <p className="text-muted-foreground text-sm">No leave requests yet</p>
            ) : (
              employeeLeaves.map((leave, index) => (
                <div key={leave.id} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      leave.status === 'approved'
                        ? 'bg-green-500'
                        : leave.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}></div>
                    {index < employeeLeaves.length - 1 && (
                      <div className="w-0.5 h-20 bg-border/40 my-2"></div>
                    )}
                  </div>

                  {/* Leave details */}
                  <div className="flex-1 pb-4">
                    <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground capitalize">{leave.type} Leave</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
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
                      <p className="text-sm text-muted-foreground mb-3">{leave.reason}</p>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border/40">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/40 text-destructive">
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </EmployeeLayoutWrapper>
  );
}
