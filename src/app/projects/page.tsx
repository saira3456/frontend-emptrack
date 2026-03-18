'use client';

import { Plus, Calendar, Users, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectService, Project } from 'services/project.service';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function ProjectStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    'planning': { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', label: 'Planning' },
    'in-progress': { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress' },
    'completed': { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', label: 'Completed' },
    'on-hold': { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', label: 'On Hold' },
  };

  const config = statusConfig[status] || statusConfig['planning'];
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
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-foreground w-12 text-right">{Math.round(progress)}%</span>
    </div>
  );
}

// New Project Form Component
function NewProjectDialog({ onProjectCreate }: { onProjectCreate: (project: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      status: formData.status,
      budget: parseInt(formData.budget) || 0,
    };

    await onProjectCreate(projectData);
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'planning',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/40">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Project</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new project to the system. You can assign employees later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g., ERP System"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border/40 focus:border-primary"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border/40 focus:border-primary min-h-[100px]"
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-background border-border/40 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-foreground">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-background border-border/40 focus:border-primary"
              />
            </div>
          </div>

          {/* Budget and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-foreground">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-background border-border/40 focus:border-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-foreground">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-background border-border/40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/40">
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border/40 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreate = async (projectData: any) => {
    const newProject = await ProjectService.createProject(projectData);
    if (newProject) {
      await loadProjects(); // Refresh the list
    }
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            {loading ? 'Loading...' : `${projects.length} projects in total`}
          </p>
        </div>
        <NewProjectDialog onProjectCreate={handleProjectCreate} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/40 bg-card animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-muted rounded w-full mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-border/40 bg-card hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Progress</p>
                  <ProgressBar progress={project.progress || 0} />
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
                    Team Members ({project.teamCount || 0})
                  </p>
                  {project.departmentName && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {project.departmentName}
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button variant="outline" className="w-full mt-4 border-border/40 hover:bg-muted">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects found. Create your first project!</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}