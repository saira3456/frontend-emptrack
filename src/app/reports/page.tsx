'use client';

import { Download, BarChart3 } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Department salary data
const departmentSalaryData = [
  { department: 'Engineering', baseSalary: 380000, bonus: 15000, deductions: 34000 },
  { department: 'Product', baseSalary: 170000, bonus: 12000, deductions: 15000 },
  { department: 'Design', baseSalary: 155000, bonus: 8000, deductions: 14000 },
  { department: 'Sales', baseSalary: 210000, bonus: 25000, deductions: 19000 },
  { department: 'HR', baseSalary: 105000, bonus: 3000, deductions: 10000 },
];

// Monthly salary trend
const monthlySalaryTrend = [
  { month: 'Jan', total: 245000 },
  { month: 'Feb', total: 248000 },
  { month: 'Mar', total: 251000 },
  { month: 'Apr', total: 254000 },
  { month: 'May', total: 258000 },
  { month: 'Jun', total: 262000 },
];

const reportTypes = [
  {
    title: 'Employee Summary Report',
    description: 'Comprehensive employee data including positions, departments, and salaries',
    icon: '📊',
  },
  {
    title: 'Attendance Report',
    description: 'Monthly attendance records and absenteeism analysis',
    icon: '📅',
  },
  {
    title: 'Payroll Report',
    description: 'Detailed payroll information including deductions and bonuses',
    icon: '💰',
  },
  {
    title: 'Department Report',
    description: 'Department-wise employee distribution and budget allocation',
    icon: '🏢',
  },
  {
    title: 'Project Report',
    description: 'Project status, progress, and budget utilization',
    icon: '📈',
  },
  {
    title: 'Leave Report',
    description: 'Leave requests, approvals, and balances by employee',
    icon: '✈️',
  },
];

export default function ReportsPage() {
  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Generate and view various HR reports and analytics</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Salary Breakdown */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Salary by Department</CardTitle>
            <CardDescription>Monthly salary distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentSalaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis stroke="hsl(var(--color-muted-foreground))" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Legend />
                <Bar dataKey="baseSalary" stackId="a" fill="hsl(var(--color-chart-1))" name="Base Salary" />
                <Bar dataKey="bonus" stackId="a" fill="hsl(var(--color-chart-2))" name="Bonus" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Salary Trend */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Monthly Salary Trend</CardTitle>
            <CardDescription>Total payroll over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalaryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--color-chart-1))" strokeWidth={2} dot={{ fill: 'hsl(var(--color-chart-1))' }} name="Total Payroll" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report, index) => (
            <Card key={index} className="border-border/40 bg-card hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{report.description}</CardDescription>
                  </div>
                  <span className="text-2xl">{report.icon}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-border/40 gap-2">
                  <Download className="w-4 h-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Metrics Summary */}
      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle>Key Metrics Summary</CardTitle>
          <CardDescription>Overview of important HR metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground mb-1">Average Salary</p>
              <p className="text-2xl font-bold text-foreground">$85,500</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground mb-1">Total Payroll</p>
              <p className="text-2xl font-bold text-foreground">$1.52M</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground mb-1">Avg Attendance Rate</p>
              <p className="text-2xl font-bold text-foreground">94%</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground mb-1">Leave Balance</p>
              <p className="text-2xl font-bold text-foreground">342 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
