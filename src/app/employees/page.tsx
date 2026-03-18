'use client';

import { useState } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockEmployees } from '@/lib/mock-data';
import { Employee } from '@/lib/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
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

  const handleSort = (key: keyof Employee, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium text-foreground">{value}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value) => <span className="text-muted-foreground">{value}</span>,
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {value}
        </Badge>
      ),
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value) => <span className="font-mono text-foreground">${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge 
          variant="outline"
          className={
            value === 'active'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
              : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
          }
        >
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </Badge>
      ),
    },
  ];

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
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-border/40 bg-card mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Search by name, email, or department..."
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
