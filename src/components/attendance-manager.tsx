'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save, Edit2, UserCheck, UserX, UserMinus, Clock as ClockIcon, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AttendanceService, DailyAttendance } from '@/services/attendance.service';
import { EmployeeService } from '@/services/employee.service';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  departmentId?: number;
  status?: string;
}

interface AttendanceRecord {
  id?: number;
  employeeId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
}

export default function AttendanceManager() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceData, setAttendanceData] = useState<Map<number, AttendanceRecord>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<Map<number, boolean>>(new Map());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployeesAndAttendance();
  }, [selectedDate]);

  const fetchEmployeesAndAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch attendance with employee details
      const attendanceRecords = await AttendanceService.getAttendanceByDate(selectedDate);
      
      // Format employees and attendance data
      const formattedEmployees: Employee[] = [];
      const attendanceMap = new Map();
      
      attendanceRecords.forEach((record: DailyAttendance) => {
        formattedEmployees.push({
          id: record.employee.id,
          name: record.employee.name,
          email: record.employee.email,
          position: record.employee.position,
          department: record.employee.department,
        });
        
        if (record.attendance) {
          attendanceMap.set(record.employee.id, record.attendance);
        }
      });
      
      setEmployees(formattedEmployees);
      setAttendanceData(attendanceMap);
      
      // Get unique departments for filter
      const uniqueDepts = [...new Set(formattedEmployees.map(emp => emp.department))];
      setDepartments(uniqueDepts);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (employeeId: number, status: string) => {
    setSaving(prev => new Map(prev).set(employeeId, true));
    setError(null);
    
    try {
      await AttendanceService.markAttendance({
        employeeId,
        date: selectedDate,
        status: status as 'present' | 'absent' | 'late' | 'half_day'
      });

      // Refresh data after marking
      await fetchEmployeesAndAttendance();

    } catch (error) {
      console.error('Error marking attendance:', error);
      setError(`Failed to mark attendance for ${employees.find(e => e.id === employeeId)?.name}. Please try again.`);
    } finally {
      setSaving(prev => {
        const newMap = new Map(prev);
        newMap.delete(employeeId);
        return newMap;
      });
    }
  };

  const handleBulkMark = async (status: string) => {
    const filteredEmployees = getFilteredEmployees();
    if (filteredEmployees.length === 0) {
      setError('No employees to mark');
      return;
    }

    if (confirm(`Mark ${filteredEmployees.length} employees as ${status.toUpperCase()}?`)) {
      setError(null);
      
      // Set saving state for all filtered employees
      const savingMap = new Map();
      filteredEmployees.forEach(emp => savingMap.set(emp.id, true));
      setSaving(savingMap);

      try {
        await AttendanceService.bulkMarkAttendance(selectedDate, status);
        
        // Refresh all data after bulk operation
        await fetchEmployeesAndAttendance();
        alert(`Successfully marked ${filteredEmployees.length} employees as ${status}`);

      } catch (error) {
        console.error('Error bulk marking:', error);
        setError('Error during bulk marking. Some employees may not have been updated.');
      } finally {
        setSaving(new Map());
      }
    }
  };

  const getCurrentStatus = (employeeId: number): string => {
    return attendanceData.get(employeeId)?.status || '';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400';
      case 'absent': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'half_day': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'late': return <ClockIcon className="w-4 h-4" />;
      case 'half_day': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Filter employees based on search and department
  const getFilteredEmployees = () => {
    let filtered = employees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();

  // Calculate statistics
  const presentCount = filteredEmployees.filter(emp => getCurrentStatus(emp.id) === 'present').length;
  const absentCount = filteredEmployees.filter(emp => getCurrentStatus(emp.id) === 'absent').length;
  const lateCount = filteredEmployees.filter(emp => getCurrentStatus(emp.id) === 'late').length;
  const halfDayCount = filteredEmployees.filter(emp => getCurrentStatus(emp.id) === 'half_day').length;
  const notMarkedCount = filteredEmployees.filter(emp => !getCurrentStatus(emp.id)).length;
  const totalCount = filteredEmployees.length;

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
          <Button
            onClick={fetchEmployeesAndAttendance}
            variant="outline"
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground mt-1">In current view</p>
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
            <p className="text-xs text-muted-foreground mt-1">{totalCount ? ((lateCount / totalCount) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Half Day</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{halfDayCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalCount ? ((halfDayCount / totalCount) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Not Marked</p>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{notMarkedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background"
          />
        </div>
        <select
          className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
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
          <CardTitle>Employee Attendance</CardTitle>
          <CardDescription>
            {filteredEmployees.length} employees • {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading employees...</p>
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No employees found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border/40">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Position</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Current Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => {
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
                        <td className="p-4">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {employee.department}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{employee.position}</td>
                        <td className="p-4">
                          {currentStatus ? (
                            <Badge className={`${getStatusColor(currentStatus)} border-transparent px-3 py-1 flex items-center gap-1 w-fit`}>
                              {getStatusIcon(currentStatus)}
                              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace('_', ' ')}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-transparent px-3 py-1 dark:bg-gray-800 dark:text-gray-300">
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
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {isSaving && saving.get(employee.id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Present
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'absent')}
                              disabled={isSaving || currentStatus === 'absent'}
                              variant="destructive"
                            >
                              {isSaving && saving.get(employee.id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Absent
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'late')}
                              disabled={isSaving || currentStatus === 'late'}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              {isSaving && saving.get(employee.id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Late
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(employee.id, 'half_day')}
                              disabled={isSaving || currentStatus === 'half_day'}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              {isSaving && saving.get(employee.id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Half Day
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}