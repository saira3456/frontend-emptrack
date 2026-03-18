'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAttendance, mockEmployees } from '@/lib/mock-data';
import { AttendanceRecord } from '@/lib/types';
import { formatDate } from '@/lib/date-utils';

function AttendanceStatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const config = {
    'present': { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400' },
    'absent': { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400' },
    'leave': { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400' },
    'holiday': { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400' },
    'half-day': { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400' }, // Added missing status
  };

  const styles = config[status];
  return (
    <Badge className={`${styles.bg} ${styles.text} border-transparent`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function AttendancePage() {
  const [sortKey, setSortKey] = useState<keyof AttendanceRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedAttendance = [...mockAttendance].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(String(bVal))
        : String(bVal).localeCompare(aVal);
    }
    
    return sortDirection === 'asc' 
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const handleSort = (key: keyof AttendanceRecord, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      render: (value) => {
        const employee = mockEmployees.find(e => e.id === value);
        return <span className="font-medium text-foreground">{employee?.name || 'Unknown'}</span>;
      },
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => formatDate(String(value)),
    },
    {
      key: 'checkIn',
      label: 'Check In',
      render: (value) => <span className="text-muted-foreground">{value || '-'}</span>,
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      render: (value) => <span className="text-muted-foreground">{value || '-'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <AttendanceStatusBadge status={value as AttendanceRecord['status']} />,
    },
  ];

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-2">Track employee attendance and check-ins</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Calendar className="w-4 h-4" />
          View Calendar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Present Today</p>
            <p className="text-3xl font-bold text-foreground">
              {mockAttendance.filter(a => a.status === 'present' && a.date === '2024-03-08').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Absent Today</p>
            <p className="text-3xl font-bold text-foreground">
              {mockAttendance.filter(a => a.status === 'absent' && a.date === '2024-03-08').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">On Leave</p>
            <p className="text-3xl font-bold text-foreground">
              {mockAttendance.filter(a => a.status === 'leave').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Half Day Today</p>
            <p className="text-3xl font-bold text-foreground">
              {mockAttendance.filter(a => a.status === 'half-day' && a.date === '2024-03-08').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Employee check-in and check-out records</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={sortedAttendance}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}