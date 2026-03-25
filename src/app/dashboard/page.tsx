'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, TrendingUp, AlertCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/date-utils';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { EmployeeService } from '@/services/employee.service';
import { DepartmentService } from '@/services/department.service';
import { ProjectService } from '@/services/project.service';
import { Activity } from '@/lib/types';

// Define types for dashboard data
interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  monthlyPayroll?: number;
  attendanceToday?: number;
}

interface DepartmentDistribution {
  name: string;
  value: number;
  color: string;
}

interface EmployeeGrowthData {
  month: string;
  employees: number;
}

// Chart colors
const chartColors = [
  '#4f46e5',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
  });

  const [departmentDistribution, setDepartmentDistribution] = useState<DepartmentDistribution[]>([]);
  const [employeeGrowthData, setEmployeeGrowthData] = useState<EmployeeGrowthData[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [employees, departments, projects] = await Promise.all([
        EmployeeService.getAllEmployees(),
        DepartmentService.getAllDepartments(),
        ProjectService.getAllProjects(),
      ]);

      // Calculate statistics
      const totalEmployees = employees?.length || 0;
      const totalDepartments = departments?.length || 0;
      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'in-progress')?.length || 0;

      // FIX: Ensure budget is treated as a number, not string concatenation
      const totalBudget = projects?.reduce((sum, p) => {
        const budget = typeof p.budget === 'string' ? parseFloat(p.budget) : (p.budget || 0);
        return sum + (isNaN(budget) ? 0 : budget);
      }, 0) || 0;

      console.log('Total budget calculated:', totalBudget); // Debug log

      setStats({
        totalEmployees,
        totalDepartments,
        totalProjects,
        activeProjects,
        totalBudget, // This should now be a proper number
      });


      // Calculate department distribution
      const deptDistribution = departments.map((dept, index) => ({
        name: dept.name,
        value: employees?.filter(emp => emp.departmentId === parseInt(dept.id))?.length || 0,
        color: chartColors[index % chartColors.length],
      })).filter(dept => dept.value > 0);

      setDepartmentDistribution(deptDistribution);

      // Generate employee growth data (last 6 months)
      const growthData = generateEmployeeGrowthData(employees);
      setEmployeeGrowthData(growthData);

      // Fetch recent activities (you'll need to implement this endpoint)
      await fetchRecentActivities();

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent activities from your API
      // This assumes you have an activities endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities/recent?limit=5`);
      if (response.ok) {
        const activities = await response.json();
        setRecentActivities(activities);
      } else {
        // Fallback to empty array if endpoint doesn't exist
        setRecentActivities([]);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setRecentActivities([]);
    }
  };

  const generateEmployeeGrowthData = (employees: any[]): EmployeeGrowthData[] => {
    // Get current date and last 6 months
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      months.push({
        month: monthName,
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      });
    }

    // Count employees by month (based on joinDate)
    const growthData = months.map(({ month, year, monthIndex }) => {
      const employeesInMonth = employees?.filter(emp => {
        if (!emp.joinDate) return false;
        const joinDate = new Date(emp.joinDate);
        return joinDate.getFullYear() === year && joinDate.getMonth() <= monthIndex;
      }).length || 0;

      return {
        month,
        employees: employeesInMonth,
      };
    });

    return growthData;
  };

  const formatCurrency = (amount: number) => {
    // Handle invalid or NaN values
    if (!amount || isNaN(amount)) return '$0';

    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayoutWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayoutWrapper>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchDashboardData()}>
              Retry
            </Button>
          </div>
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your HR system overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          description="Active employees"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          description="Active departments"
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          description={`Out of ${stats.totalProjects} total`}
          icon={<Briefcase className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Project Budget"
          value={formatCurrency(stats.totalBudget)}
          description="Total allocated budget"
          icon={<DollarSign className="w-5 h-5" />}
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
            {employeeGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employeeGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No employee growth data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Distribution */}
        {/* Department Distribution */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                    }}
                    formatter={(value: any, name: any) => [`${value} employees`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0
                ? `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.activeProjects} active out of {stats.totalProjects} total projects
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Budget per Project</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProjects > 0
                ? formatCurrency(stats.totalBudget / stats.totalProjects)
                : '$0'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees per Department</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalDepartments > 0
                ? Math.round(stats.totalEmployees / stats.totalDepartments)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average team size
            </p>
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
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.userName && (
                            <span className="font-semibold">{activity.userName}</span>
                          )} {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(activity.timestamp)}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {JSON.stringify(activity.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activities</p>
                  <p className="text-sm mt-1">Activities will appear here as users interact with the system</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/employees/add">
                  <Users className="w-4 h-4 mr-2" />
                  Add New Employee
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/departments/add">
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Department
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/projects/add">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Start New Project
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/attendance">
                  <Calendar className="w-4 h-4 mr-2" />
                  Mark Attendance
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/reports">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Reports
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}