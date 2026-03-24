// frontend/src/components/attendance-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save, Edit2 } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttendanceService, DailyAttendance } from '@/services/attendance.service';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
}

export default function AttendanceManager() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceData, setAttendanceData] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<Map<number, boolean>>(new Map());

  useEffect(() => {
    fetchEmployeesAndAttendance();
  }, [selectedDate]);

  const fetchEmployeesAndAttendance = async () => {
    setLoading(true);
    try {
      // Get all employees and today's attendance
      const attendance = await AttendanceService.getAttendanceByDate(selectedDate);
      
      // Store employees
      const employeeList = attendance.map(item => item.employee);
      setEmployees(employeeList);
      
      // Store attendance in map for quick lookup
      const attendanceMap = new Map();
      attendance.forEach(item => {
        if (item.attendance) {
          attendanceMap.set(item.employee.id, item.attendance);
        }
      });
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (employeeId: number, status: string) => {
    setSaving(prev => new Map(prev).set(employeeId, true));
    try {
      await AttendanceService.markAttendance({
        employeeId,
        date: selectedDate,
        status
      });
      await fetchEmployeesAndAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setSaving(prev => {
        const newMap = new Map(prev);
        newMap.delete(employeeId);
        return newMap;
      });
    }
  };

  const handleBulkMark = async (status: string) => {
    if (confirm(`Mark all employees as ${status.toUpperCase()}?`)) {
      setSaving(new Map(employees.map(emp => [emp.id, true])));
      try {
        await AttendanceService.bulkMarkAttendance(selectedDate, status);
        await fetchEmployeesAndAttendance();
      } catch (error) {
        console.error('Error bulk marking:', error);
      } finally {
        setSaving(new Map());
      }
    }
  };

  const getCurrentStatus = (employeeId: number): string => {
    return attendanceData.get(employeeId)?.status || '';
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300';
      case 'absent': return 'bg-red-100 text-red-800 border-red-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'half_day': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const presentCount = employees.filter(emp => getCurrentStatus(emp.id) === 'present').length;
  const absentCount = employees.filter(emp => getCurrentStatus(emp.id) === 'absent').length;
  const lateCount = employees.filter(emp => getCurrentStatus(emp.id) === 'late').length;
  const halfDayCount = employees.filter(emp => getCurrentStatus(emp.id) === 'half_day').length;
  const totalCount = employees.length;
  const markedCount = presentCount + absentCount + lateCount + halfDayCount;

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-2">Mark employee attendance for the day</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            variant="outline"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Today
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{markedCount} marked</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{presentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalCount ? ((presentCount / totalCount) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalCount ? ((absentCount / totalCount) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Late</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{lateCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Half Day</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{halfDayCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button onClick={() => handleBulkMark('present')} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All Present
        </Button>
        <Button onClick={() => handleBulkMark('absent')} variant="destructive">
          <XCircle className="w-4 h-4 mr-2" />
          Mark All Absent
        </Button>
        <Button onClick={() => handleBulkMark('late')} className="bg-yellow-600 hover:bg-yellow-700">
          <Clock className="w-4 h-4 mr-2" />
          Mark All Late
        </Button>
        <Button onClick={() => handleBulkMark('half_day')} className="bg-purple-600 hover:bg-purple-700">
          <AlertCircle className="w-4 h-4 mr-2" />
          Mark All Half Day
        </Button>
      </div>

      {/* Employees Table with Attendance Buttons */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <CardTitle>Employees</CardTitle>
          <CardDescription>Click on status buttons to mark attendance for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => {
                    const currentStatus = getCurrentStatus(employee.id);
                    const isSaving = saving.get(employee.id);
                    
                    return (
                      <tr key={employee.id} className="border-b border-border/40 hover:bg-muted/30 transition">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{employee.department}</td>
                        <td className="p-4 text-muted-foreground">{employee.position}</td>
                        <td className="p-4">
                          {currentStatus ? (
                            <Badge className={`${getStatusColor(currentStatus)} border-transparent px-3 py-1`}>
                              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace('_', ' ')}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-transparent px-3 py-1">
                              Not Marked
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'present')}
                              disabled={isSaving || currentStatus === 'present'}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isSaving && saving.get(employee.id) ? '...' : 'Present'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'absent')}
                              disabled={isSaving || currentStatus === 'absent'}
                              variant="destructive"
                            >
                              {isSaving && saving.get(employee.id) ? '...' : 'Absent'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'late')}
                              disabled={isSaving || currentStatus === 'late'}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              {isSaving && saving.get(employee.id) ? '...' : 'Late'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'half_day')}
                              disabled={isSaving || currentStatus === 'half_day'}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isSaving && saving.get(employee.id) ? '...' : 'Half Day'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}