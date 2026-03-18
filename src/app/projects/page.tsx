'use client';

import { Plus, Calendar, Users, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/lib/mock-data';
import { Project } from '@/lib/types';

function ProjectStatusBadge({ status }: { status: Project['status'] }) {
  const statusConfig = {
    'planning': { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', label: 'Planning' },
    'in-progress': { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress' },
    'completed': { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', label: 'Completed' },
    'on-hold': { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', label: 'On Hold' },
  };

  const config = statusConfig[status];
  return (
    <Badge className={`${config.bg} ${config.text} border-transparent`}>
      {config.label}
    </Badge>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-foreground w-12 text-right">{progress}%</span>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">{mockProjects.length} projects in total</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card
            key={project.id}
            className="border-border/40 bg-card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <ProjectStatusBadge status={project.status} />
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Progress</p>
                <ProgressBar progress={project.progress} />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium text-foreground">
                      ${(project.budget / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members ({project.team.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.team.map((memberId, index) => (
                    <Badge key={index} variant="secondary" className="bg-muted text-muted-foreground">
                      {memberId.replace('emp-', 'E')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button variant="outline" className="w-full mt-4 border-border/40 hover:bg-muted">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
