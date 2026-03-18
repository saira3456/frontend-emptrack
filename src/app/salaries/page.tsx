'use client';

import { useState } from 'react';
import { Download, Calculator } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockSalaries, mockEmployees } from '@/lib/mock-data';
import { SalaryRecord } from '@/lib/types';
import { formatMonthYear } from '@/lib/date-utils';

function SalaryStatusBadge({ status }: { status: SalaryRecord['status'] }) {
  const config = {
    'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending' },
    'processed': { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', label: 'Processed' },
    'paid': { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', label: 'Paid' },
  };

  const styles = config[status];
  return (
    <Badge className={`${styles.bg} ${styles.text} border-transparent`}>
      {styles.label}
    </Badge>
  );
}

export default function SalariesPage() {
  const [sortKey, setSortKey] = useState<keyof SalaryRecord>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedSalaries = [...mockSalaries].sort((a, b) => {
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

  const handleSort = (key: keyof SalaryRecord, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const totalPaid = mockSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + s.netSalary, 0);
  const totalProcessed = mockSalaries.filter(s => s.status === 'processed').reduce((acc, s) => acc + s.netSalary, 0);

  const columns: Column<SalaryRecord>[] = [
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
      key: 'month',
      label: 'Month',
      sortable: true,
      render: (value) => formatMonthYear(String(value) + '-01'),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      render: (value) => <span className="font-mono text-foreground">${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'bonus',
      label: 'Bonus',
      render: (value) => <span className="font-mono text-green-600 dark:text-green-400">${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'deductions',
      label: 'Deductions',
      render: (value) => <span className="font-mono text-red-600 dark:text-red-400">-${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (value) => <span className="font-mono font-semibold text-foreground">${(value as number).toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <SalaryStatusBadge status={value as SalaryRecord['status']} />,
    },
  ];

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salaries</h1>
          <p className="text-muted-foreground mt-2">Manage employee salaries and payments</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Calculator className="w-4 h-4" />
          Process Salary
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
            <p className="text-3xl font-bold text-foreground">${(totalPaid / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground mt-2">{mockSalaries.filter(s => s.status === 'paid').length} payments</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Being Processed</p>
            <p className="text-3xl font-bold text-foreground">${(totalProcessed / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground mt-2">{mockSalaries.filter(s => s.status === 'processed').length} in process</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-foreground">{mockSalaries.filter(s => s.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Table */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Salary Records</CardTitle>
              <CardDescription>Employee salary and payment details</CardDescription>
            </div>
            <Button variant="outline" className="gap-2 border-border/40">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={sortedSalaries}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
