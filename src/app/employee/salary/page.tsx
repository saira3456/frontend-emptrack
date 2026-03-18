'use client';

import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSalaries, mockEmployees } from '@/lib/mock-data';
import { formatMonthYear } from '@/lib/date-utils';
import { Download, DollarSign, TrendingUp } from 'lucide-react';

export default function EmployeeSalaryPage() {
  const currentEmployee = mockEmployees[0];
  const employeeSalaries = mockSalaries.filter(s => s.employeeId === currentEmployee.id);

  return (
    <EmployeeLayoutWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Salary Information</h1>
        <p className="text-muted-foreground mt-2">View your salary structure and payment history</p>
      </div>

      {/* Latest Salary Card */}
      {employeeSalaries.length > 0 && (
        <Card className="border-border/40 bg-gradient-to-br from-card to-muted/10 mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Current Month Salary
            </CardTitle>
            <CardDescription>{formatMonthYear(employeeSalaries[0].month + '-01')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Salary breakdown grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
                <p className="text-sm text-muted-foreground mb-2">Base Salary</p>
                <p className="text-2xl font-bold text-foreground">
                  ${employeeSalaries[0].baseSalary.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-2">Bonus & Allowances</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +${employeeSalaries[0].bonus.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-muted-foreground mb-2">Deductions & Tax</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -${employeeSalaries[0].deductions.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Net salary */}
            <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Net Salary</p>
                  <p className="text-4xl font-bold text-primary">
                    ${employeeSalaries[0].netSalary.toLocaleString()}
                  </p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download Payslip
                </Button>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Earnings</h3>
              <div className="space-y-2 pl-4 border-l border-primary/20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="font-medium text-foreground">${employeeSalaries[0].baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Bonus</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+${(employeeSalaries[0].bonus * 0.7).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Allowances</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+${(employeeSalaries[0].bonus * 0.3).toLocaleString()}</span>
                </div>
              </div>

              <h3 className="font-semibold text-foreground text-sm mt-4">Deductions</h3>
              <div className="space-y-2 pl-4 border-l border-red-500/20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-${(employeeSalaries[0].deductions * 0.6).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-${(employeeSalaries[0].deductions * 0.25).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Other</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-${(employeeSalaries[0].deductions * 0.15).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary History */}
      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Salary History
          </CardTitle>
          <CardDescription>Your past salary records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {employeeSalaries.length === 0 ? (
              <p className="text-muted-foreground text-sm">No salary records available</p>
            ) : (
              employeeSalaries.map((salary) => (
                <div key={salary.id} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors border border-border/40">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{formatMonthYear(salary.month + '-01')}</p>
                    <p className="text-sm text-muted-foreground">
                      Base: ${salary.baseSalary.toLocaleString()} | Net: ${salary.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/40">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </EmployeeLayoutWrapper>
  );
}
