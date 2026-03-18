'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowLeft,
  Clock,
  UserPlus,
  Edit2,
  Trash2,
  Save,
  Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProjectService, Project, ProjectAssignment } from 'services/project.service';
import { EmployeeService } from 'services/employee.service';

function StatusBadge({ status }: { status: string }) {
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

// Assign Employee Dialog
function AssignEmployeeDialog({ 
  projectId, 
  onAssign,
  availableEmployees = []
}: { 
  projectId: number, 
  onAssign: (data: any) => void,
  availableEmployees: any[]
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    role: '',
    hoursAllocated: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      employeeId: parseInt(formData.employeeId),
      role: formData.role,
      hoursAllocated: parseInt(formData.hoursAllocated),
    });
    setOpen(false);
    setFormData({ employeeId: '', role: '', hoursAllocated: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus className="w-4 h-4" />
          Assign Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/40">
        <DialogHeader>
          <DialogTitle className="text-foreground">Assign Employee to Project</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select an employee and define their role and hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Select */}
          <div className="space-y-2">
            <Label htmlFor="employee" className="text-foreground">Employee</Label>
            <Select 
              value={formData.employeeId} 
              onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              required
            >
              <SelectTrigger className="bg-background border-border/40">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                {availableEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} - {emp.position}
                  </SelectItem>
                ))}
                {availableEmployees.length === 0 && (
                  <SelectItem value="none" disabled>No employees available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">Role</Label>
            <Input
              id="role"
              placeholder="e.g., Frontend Developer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="bg-background border-border/40"
              required
            />
          </div>

          {/* Hours Allocated */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="text-foreground">Hours Allocated</Label>
            <Input
              id="hours"
              type="number"
              placeholder="160"
              value={formData.hoursAllocated}
              onChange={(e) => setFormData({ ...formData, hoursAllocated: e.target.value })}
              className="bg-background border-border/40"
              required
            />
          </div>

          <DialogFooter>
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
              disabled={availableEmployees.length === 0}
            >
              Assign to Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<ProjectAssignment[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'planning' as Project['status'],
    budget: 0,
  });

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      // Load project details
      const projectData = await ProjectService.getProjectById(projectId);
      if (!projectData) {
        router.push('/projects');
        return;
      }
      setProject(projectData);
      setEditForm({
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        budget: projectData.budget,
      });

      // Load team members
      const team = await ProjectService.getProjectTeam(projectId);
      setTeamMembers(team);

      // Load available employees (not in project)
      const available = await EmployeeService.getAvailableEmployeesForProject(projectId);
      setAvailableEmployees(available);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignEmployee = async (assignment: any) => {
    const result = await ProjectService.assignEmployeeToProject(projectId, assignment);
    if (result) {
      // Refresh team members
      const team = await ProjectService.getProjectTeam(projectId);
      setTeamMembers(team);
      
      // Refresh available employees
      const available = await EmployeeService.getAvailableEmployeesForProject(projectId);
      setAvailableEmployees(available);
    }
  };

  const handleRemoveEmployee = async (employeeId: number) => {
    if (confirm('Are you sure you want to remove this employee from the project?')) {
      const success = await ProjectService.removeEmployeeFromProject(projectId, employeeId);
      if (success) {
        // Refresh team members
        const team = await ProjectService.getProjectTeam(projectId);
        setTeamMembers(team);
        
        // Refresh available employees
        const available = await EmployeeService.getAvailableEmployeesForProject(projectId);
        setAvailableEmployees(available);
      }
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await ProjectService.updateProject(projectId, editForm);
    if (updated) {
      setProject(updated);
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout userName="Admin User" userRole="Administrator">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return null;
  }

  const totalHoursAllocated = teamMembers.reduce((acc, m) => acc + m.hoursAllocated, 0);
  const totalHoursWorked = teamMembers.reduce((acc, m) => acc + (m.hoursWorked || 0), 0);
  const overallProgress = totalHoursAllocated > 0 
    ? (totalHoursWorked / totalHoursAllocated) * 100 
    : project.progress || 0;

  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push('/projects')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-border/40 hover:bg-muted"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit Project'}
          </Button>
        </div>
      </div>

      {/* Edit Form or Project Info */}
      {isEditing ? (
        <Card className="border-border/40 bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-background border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editForm.status} 
                    onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger className="bg-background border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/40">
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="bg-background border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={editForm.budget}
                    onChange={(e) => setEditForm({ ...editForm, budget: parseInt(e.target.value) })}
                    className="bg-background border-border/40"
                  />
                </div>
              </div>
              <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Project Overview Cards */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/40 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Timeline</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Budget</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                ${(project.budget / 1000).toFixed(0)}K
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Team Size</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {teamMembers.length} members
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Total Hours</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {totalHoursWorked}/{totalHoursAllocated} hrs
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      <Card className="border-border/40 bg-card mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar progress={overallProgress} />
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="bg-muted/50 border-border/40">
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="reports">Reports & Activity</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>

        {/* TEAM TAB */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
            <AssignEmployeeDialog 
              projectId={projectId} 
              onAssign={handleAssignEmployee}
              availableEmployees={availableEmployees}
            />
          </div>

          <Card className="border-border/40 bg-card">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Employee</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Hours</TableHead>
                    <TableHead className="text-muted-foreground">Progress</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const memberProgress = member.hoursAllocated > 0 
                      ? (member.hoursWorked / member.hoursAllocated) * 100 
                      : 0;
                    
                    return (
                      <TableRow key={member.id} className="border-border/40 hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {member.employeeName?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{member.employeeName}</p>
                              <p className="text-xs text-muted-foreground">{member.employeePosition}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{member.role}</TableCell>
                        <TableCell className="text-foreground">{new Date(member.joinedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{member.hoursWorked || 0}/{member.hoursAllocated}</p>
                            <p className="text-xs text-muted-foreground">hours</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <ProgressBar progress={memberProgress} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={member.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleRemoveEmployee(member.employeeId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {teamMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No team members assigned yet. Click "Assign Employee" to add.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports">
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Reports & Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                View work logs and project updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No reports yet. This will show work logs from employees.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETAILS TAB */}
        <TabsContent value="details">
          <Card className="border-border/40 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="text-foreground">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                  <p className="text-foreground">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
                  <p className="text-foreground">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                  <p className="text-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p className="text-foreground">{new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}