'use client';

import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockEmployees, mockProjects } from '@/lib/mock-data';
import { Briefcase, Users, Calendar } from 'lucide-react';

export default function EmployeeProjectsPage() {
  const currentEmployee = mockEmployees[0];
  const employeeProjects = mockProjects.filter(p => p.team.includes(currentEmployee.id));

  return (
    <EmployeeLayoutWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
        <p className="text-muted-foreground mt-2">Track and manage your assigned projects</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {employeeProjects.length === 0 ? (
          <Card className="border-border/40 bg-card">
            <CardContent className="pt-12 pb-12">
              <p className="text-center text-muted-foreground">No projects assigned yet</p>
            </CardContent>
          </Card>
        ) : (
          employeeProjects.map((project) => (
            <Card key={project.id} className="border-border/40 bg-card hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {project.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{project.description}</CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary">{project.progress}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold text-foreground">{project.progress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-green-600 transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Status
                    </p>
                    <p className="font-semibold text-foreground capitalize">{project.status}</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Size
                    </p>
                    <p className="font-semibold text-foreground">{project.team.length} members</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="font-semibold text-foreground">${(project.budget / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1 border-border/40">
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </EmployeeLayoutWrapper>
  );
}
