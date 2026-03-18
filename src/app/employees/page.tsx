'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter, Download, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Employee, Department } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { EmployeeService } from 'services/employee.service';
import { DepartmentService } from 'services/department.service';

interface NewEmployeeFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  salary: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  password: string;
  confirmPassword: string;
}

// Define a type for update form data that uses strings for form inputs
interface UpdateEmployeeFormData {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  departmentId?: string;  // Keep as string for form handling
  salary?: number | string;  // Allow both for flexibility
  status?: 'active' | 'inactive' | 'on-leave';
  joinDate?: string;
}

export default function EmployeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    departmentId: "",
    salary: "",
    status: "active",
    joinDate: new Date().toISOString().split('T')[0],
    password: "",
    confirmPassword: "",
  });
  const [updateEmployeeData, setUpdateEmployeeData] = useState<UpdateEmployeeFormData>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employees and departments on load
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
      console.log('✅ Employees loaded:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
      console.error('❌ Error loading employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getAllDepartments();
      setDepartments(data);
      console.log('✅ Departments loaded:', data);
    } catch (err) {
      console.error('❌ Error loading departments:', err);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc'
        ? aVal - bVal
        : bVal - aVal;
    }

    return 0;
  });

  const handleSort = (key: keyof Employee, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleUpdateClick = (employee: Employee) => {



    setSelectedEmployee(employee);

    const formattedJoinDate = employee.joinDate
      ? new Date(employee.joinDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setUpdateEmployeeData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      departmentId: employee.departmentId?.toString() || "",
      salary: employee.salary,
      status: employee.status,
      joinDate: formattedJoinDate,
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for API - convert types appropriately
      const apiData: any = {
        ...updateEmployeeData,
      };

      // Convert departmentId from string to number if present
      if (updateEmployeeData.departmentId !== undefined) {
        apiData.departmentId = updateEmployeeData.departmentId ?
          parseInt(updateEmployeeData.departmentId, 10) : undefined;
      }

      // Convert salary from string to number if it's a string
      if (updateEmployeeData.salary !== undefined && typeof updateEmployeeData.salary === 'string') {
        apiData.salary = updateEmployeeData.salary ?
          parseFloat(updateEmployeeData.salary) : undefined;
      }

      console.log("📤 Updating employee:", selectedEmployee.id, apiData);

      const updatedEmployee = await EmployeeService.updateEmployee(selectedEmployee.id, apiData);

      // Update the employees list with the updated employee
      setEmployees(employees.map(emp =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      ));

      alert('✅ Employee updated successfully!');
      setIsUpdateModalOpen(false);
      setSelectedEmployee(null);
      setUpdateEmployeeData({});
    } catch (error) {
      console.error('❌ Error updating employee:', error);
      setError(error instanceof Error ? error.message : 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await EmployeeService.deleteEmployee(employee.id);
        setEmployees(employees.filter(emp => emp.id !== employee.id));
        alert('✅ Employee deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting employee:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete employee');
      }
    }
  };

  const handleAddEmployee = async () => {
    // Validate passwords match
    if (newEmployee.password !== newEmployee.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newEmployee.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!newEmployee.departmentId) {
      setError('Please select a department');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const employeeData = {
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        position: newEmployee.position,
        departmentId: parseInt(newEmployee.departmentId, 10),
        salary: parseFloat(newEmployee.salary) || 0,
        joinDate: newEmployee.joinDate,
        status: newEmployee.status,
        password: newEmployee.password,
      };

      console.log("📤 Sending to API:", { ...employeeData, password: '[HIDDEN]' });

      const createdEmployee = await EmployeeService.createEmployee(employeeData);
      setEmployees([...employees, createdEmployee]);

      alert('✅ Employee created successfully!');

      // Reset form
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        position: "",
        departmentId: "",
        salary: "",
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        password: "",
        confirmPassword: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error creating employee:', error);
      setError(error instanceof Error ? error.message : 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium text-foreground">{value as string}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => <span className="text-muted-foreground">{value as string}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value) => <span className="text-muted-foreground">{value as string}</span>,
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'salary',
      label: 'Salary',
      sortable: true,
      render: (value) => <span className="font-mono text-foreground">${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value) => <span className="text-muted-foreground">{value as string}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value as 'active' | 'inactive' | 'on-leave';
        const statusColors = {
          active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
          inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
          'on-leave': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
        };
        const statusLabels = {
          active: 'Active',
          inactive: 'Inactive',
          'on-leave': 'On Leave'
        };
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, employee) => {
        if (!employee) return null;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateClick(employee);
              }}
              className="gap-1"
            >
              <Pencil className="w-4 h-4" />
              Update
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEmployee(employee);
              }}
              className="gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <AppLayout userName="Admin User" userRole="Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading employees...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout userName="Admin User" userRole="Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <p>Error: {error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchEmployees}
            >
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-2">{filteredEmployees.length} employees in the system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border/40">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 border-border/40">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Fill out the details to add a new employee.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4 max-h-[60vh] overflow-y-auto px-1">
            <Input
              placeholder="Full Name *"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <Input
              placeholder="Email *"
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
            <Input
              placeholder="Phone Number *"
              type="tel"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
            />
            <Input
              placeholder="Position *"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            />

            {/* Department Dropdown */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newEmployee.departmentId}
              onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
              required
            >
              <option value="">Select Department *</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Salary *"
              type="number"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
            />
            <Input
              placeholder="Join Date"
              type="date"
              value={newEmployee.joinDate}
              onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newEmployee.status}
              onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as 'active' | 'inactive' | 'on-leave' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Password *"
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className={!newEmployee.password && error ? 'border-destructive' : ''}
              />
              <Input
                placeholder="Confirm Password *"
                type="password"
                value={newEmployee.confirmPassword}
                onChange={(e) => setNewEmployee({ ...newEmployee, confirmPassword: e.target.value })}
                className={newEmployee.password !== newEmployee.confirmPassword && newEmployee.confirmPassword ? 'border-destructive' : ''}
              />
              {newEmployee.password !== newEmployee.confirmPassword && newEmployee.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              disabled={
                !newEmployee.name ||
                !newEmployee.email ||
                !newEmployee.phone ||
                !newEmployee.position ||
                !newEmployee.departmentId ||
                !newEmployee.salary ||
                !newEmployee.password ||
                !newEmployee.confirmPassword ||
                newEmployee.password !== newEmployee.confirmPassword ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Employee Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
            <DialogDescription>Update the employee details below.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4 max-h-[60vh] overflow-y-auto px-1">
            <Input
              placeholder="Full Name *"
              value={updateEmployeeData.name || ''}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, name: e.target.value })}
            />
            <Input
              placeholder="Email *"
              type="email"
              value={updateEmployeeData.email || ''}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, email: e.target.value })}
            />
            <Input
              placeholder="Phone Number *"
              type="tel"
              value={updateEmployeeData.phone || ''}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, phone: e.target.value })}
            />
            <Input
              placeholder="Position *"
              value={updateEmployeeData.position || ''}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, position: e.target.value })}
            />

            {/* Department Dropdown for Update */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={updateEmployeeData.departmentId?.toString() || ''}
              onChange={(e) => setUpdateEmployeeData({
                ...updateEmployeeData,
                departmentId: e.target.value
              })}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Salary"
              type="number"
              value={updateEmployeeData.salary?.toString() || ''}
              onChange={(e) => setUpdateEmployeeData({
                ...updateEmployeeData,
                salary: e.target.value
              })}
            />
            <Input
              placeholder="Join Date"
              type="date"
              value={updateEmployeeData.joinDate || ''}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, joinDate: e.target.value })}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={updateEmployeeData.status || 'active'}
              onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, status: e.target.value as 'active' | 'inactive' | 'on-leave' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card className="border-border/40 bg-card mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Search by name, email, department, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground"
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <CardTitle>Employee List</CardTitle>
          <CardDescription>Manage and view all employees</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={sortedEmployees}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}

