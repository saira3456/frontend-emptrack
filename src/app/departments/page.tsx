'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Department, Employee } from '@/lib/types';
import { DepartmentService } from '@/services/department.service';
import { EmployeeService } from '@/services/employee.service';

interface NewDepartmentFormData {
  name: string;
  description: string;
  managerId: string;
  budget: string;
}

export default function DepartmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<NewDepartmentFormData>({
    name: "",
    description: "",
    managerId: "",
    budget: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortKey, setSortKey] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DepartmentService.getAllDepartments();
      setDepartments(data);
      console.log('✅ Departments loaded:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments');
      console.error('❌ Error loading departments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const sortedDepartments = [...departments].sort((a, b) => {
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

  const handleSort = (key: keyof Department, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleAddDepartment = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const departmentData = {
        name: newDepartment.name,
        description: newDepartment.description,
        managerId: newDepartment.managerId ? parseInt(newDepartment.managerId) : undefined,
        budget: parseFloat(newDepartment.budget) || 0,
      };

      console.log("📤 Sending to API:", departmentData);

      const createdDepartment = await DepartmentService.createDepartment(departmentData);
      setDepartments([...departments, createdDepartment]);
      
      alert('✅ Department created successfully!');

      setNewDepartment({
        name: "",
        description: "",
        managerId: "",
        budget: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error creating department:', error);
      setError(error instanceof Error ? error.message : 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Department>[] = [
    {
      key: 'name',
      label: 'Department Name',
      sortable: true,
      render: (value) => <span className="font-medium text-foreground">{value}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span className="text-muted-foreground text-sm">{value}</span>,
    },
    {
      key: 'manager',
      label: 'Manager',
      sortable: true,
      render: (value) => <span>{value || 'Not Assigned'}</span>,
    },
    {
      key: 'employeeCount',
      label: 'Employees',
      sortable: true,
      render: (value) => <span className="font-medium text-foreground">{value}</span>,
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (value) => <span className="font-mono text-foreground">${(value as number).toLocaleString()}</span>,
    },
  ];

  if (isLoading) {
    return (
      <AppLayout userName="Admin User" userRole="Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading departments...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userName="Admin User" userRole="Administrator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <p>Error: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchDepartments}
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
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-2">{departments.length} departments total</p>
        </div>
        <Button 
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Add Department Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Fill out the details to add a new department.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="Department Name *"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            />
            <Input
              placeholder="Description *"
              value={newDepartment.description}
              onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
            />
            
            {/* Manager Dropdown */}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newDepartment.managerId}
              onChange={(e) => setNewDepartment({ ...newDepartment, managerId: e.target.value })}
            >
              <option value="">Select Manager (Optional)</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>

            <Input
              placeholder="Budget *"
              type="number"
              value={newDepartment.budget}
              onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddDepartment}
              disabled={
                !newDepartment.name ||
                !newDepartment.description ||
                !newDepartment.budget ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Adding...' : 'Add Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {departments.map((dept) => (
          <Card key={dept.id} className="border-border/40 bg-card hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription className="mt-1">{dept.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Manager</span>
                  <span className="font-medium text-foreground">{dept.manager || 'Not Assigned'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Employees
                  </span>
                  <span className="font-medium text-foreground">{dept.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </span>
                  <span className="font-mono font-medium text-foreground">${(dept.budget / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Table */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Detailed department information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={sortedDepartments}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}