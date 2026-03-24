'use client';

import { useState, useEffect } from 'react';
import { EmployeeLayoutWrapper } from '@/components/employee-layout-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Calendar, Loader2 } from 'lucide-react';
import { ProjectService, ProjectAssignment } from '@/services/project.service';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';


export default function EmployeeProjectsPage() {
  const router = useRouter();
  const { user, isEmployee } = useAuth();
  const [projects, setProjects] = useState<ProjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not employee
    if (!isEmployee) {
      router.push('/');
      return;
    }

    if (user?.id) {
      loadProjects();
    }
  }, [user?.id, isEmployee]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Fetching projects for employee:', user?.id);
      const data = await ProjectService.getEmployeeProjects(user?.id as string);
      console.log('📥 Received projects:', data);
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  if (!isEmployee) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <EmployeeLayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  if (error) {
    return (
      <EmployeeLayoutWrapper>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button onClick={loadProjects} className="mt-4">
            Retry
          </Button>
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  return (
    <EmployeeLayoutWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name}! Track and manage your assigned projects
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.length === 0 ? (
          <Card className="border-border/40 bg-card">
            <CardContent className="pt-12 pb-12">
              <p className="text-center text-muted-foreground">No projects assigned yet</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            // Calculate individual progress
            const individualProgress = project.hoursAllocated > 0 
              ? Math.round((project.hoursWorked / project.hoursAllocated) * 100) 
              : 0;
            
            return (
              <Card key={project.id} className="border-border/40 bg-card hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {project.projectName}
                      </CardTitle>
                      <CardDescription className="mt-2">{project.projectDescription}</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary">
                      {project.progress}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Project Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Overall Progress</span>
                      <span className="text-sm font-semibold text-foreground">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-green-600 transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Your Personal Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Your Progress</span>
                      <span className="text-sm font-semibold text-foreground">
                        {individualProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                        style={{ width: `${individualProgress}%` }}
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
                      <p className="font-semibold text-foreground capitalize">
                        {project.projectStatus}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg border border-border/40">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Size
                      </p>
                      <p className="font-semibold text-foreground">
                        {project.teamCount} members
                      </p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg border border-border/40">
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="font-semibold text-foreground">
                        ${(project.budget / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  {/* Your Role and Hours */}
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-foreground">
                      Your Role: <span className="text-primary">{project.role}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hours: {project.hoursWorked} / {project.hoursAllocated} ({individualProgress}% complete)
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleViewDetails(project.projectId)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-border/40"
                    >
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </EmployeeLayoutWrapper>
  );
}