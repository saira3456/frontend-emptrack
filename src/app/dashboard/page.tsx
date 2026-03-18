'use client';

import { Users, Building2, Briefcase, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockEmployees, mockDepartments, mockProjects, mockActivities } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/date-utils';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Chart data
const employeeGrowthData = [
  { month: 'Jan', employees: 15 },
  { month: 'Feb', employees: 18 },
  { month: 'Mar', employees: 22 },
  { month: 'Apr', employees: 26 },
  { month: 'May', employees: 28 },
  { month: 'Jun', employees: 32 },
];

const departmentDistributionData = [
  { name: 'Engineering', value: 8, color: 'hsl(var(--color-chart-1))' },
  { name: 'Product', value: 4, color: 'hsl(var(--color-chart-2))' },
  { name: 'Design', value: 5, color: 'hsl(var(--color-chart-3))' },
  { name: 'Sales', value: 6, color: 'hsl(var(--color-chart-4))' },
  { name: 'HR', value: 3, color: 'hsl(var(--color-chart-5))' },
];

const chartColors = [
  '#4f46e5',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#8b5cf6',
];

export default function DashboardPage() {
//   const activeProjects = mockProjects.filter((p) => p.status === 'In Progress').length;
const activeProjects = mockProjects.filter((p) => p.status === 'in-progress').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <AdminLayoutWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your HR system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={mockEmployees.length}
          description="Active employees"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Departments"
          value={mockDepartments.length}
          description="Active departments"
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          description="In progress"
          icon={<Briefcase className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Project Budget"
          value={`$${(totalBudget / 1000).toFixed(0)}K`}
          description="Total allocated"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Employee Growth Chart */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Employee Growth</CardTitle>
            <CardDescription>Last 6 months trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Line type="monotone" dataKey="employees" stroke="hsl(var(--color-chart-1))" strokeWidth={2} dot={{ fill: 'hsl(var(--color-chart-1))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                New Department
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
