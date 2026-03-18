'use client';

import { useState } from 'react';
import { Plus, Users, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDepartments } from '@/lib/mock-data';
import { Department } from '@/lib/types';

export default function DepartmentsPage() {
  const [sortKey, setSortKey] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedDepartments = [...mockDepartments].sort((a, b) => {
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

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-2">{mockDepartments.length} departments total</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockDepartments.map((dept) => (
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
                  <span className="font-medium text-foreground">{dept.manager}</span>
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
