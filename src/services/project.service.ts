// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL);

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget: number;
  departmentId?: number;
  departmentName?: string;
  teamCount?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAssignment {
  // From employee_projects table
  id: number;
  employeeId: number;
  projectId: number;
  role: string;
  hoursAllocated: number;
  hoursWorked: number;
  joinedDate: string;
  assignmentStatus: string;
  
  // From projects table (joined data)
  projectName: string;
  projectDescription: string;
  projectStatus: string;
  startDate: string;
  endDate: string;
  budget: number;
  
  // Calculated fields
  teamCount: number;
  progress: number;
}

export class ProjectService {
  // ========== PROJECT CRUD ==========

  static async getAllProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch projects: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  static async getProjectById(projectId: string | number): Promise<Project | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch project: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  static async createProject(projectData: any): Promise<Project | null> {
  try {
    console.log('📤 Sending to backend:', JSON.stringify(projectData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

  static async updateProject(
    projectId: string | number,
    updateData: Partial<{
      name: string;
      description: string;
      status: string;
      budget: number;
    }>
  ): Promise<Project | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to update project: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  // ========== TEAM MANAGEMENT ==========

  static async getProjectTeam(projectId: string | number): Promise<ProjectAssignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/team`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch project team: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching project team:', error);
      return [];
    }
  }

  static async assignEmployeeToProject(
    projectId: string | number,
    assignmentData: {
      employeeId: number;
      role: string;
      hoursAllocated: number;
    }
  ): Promise<ProjectAssignment | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign employee: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error assigning employee:', error);
      return null;
    }
  }

  static async removeEmployeeFromProject(projectId: string | number, employeeId: string | number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove employee: ${response.status}`);
      }

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Error removing employee:', error);
      return false;
    }
  }

  // ========== EMPLOYEE SPECIFIC ==========

  static async getEmployeeProjects(employeeId: string | number): Promise<ProjectAssignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/employee/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch employee projects: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching employee projects:', error);
      return [];
    }
  }

  static async logWorkHours(
    projectId: string | number,
    employeeId: string | number,
    hoursWorked: number
  ): Promise<{ hoursWorked: number } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/employee/${employeeId}/hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hoursWorked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log work hours: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging work hours:', error);
      return null;
    }
  }

  // ========== EMPLOYEES FOR ASSIGNMENT ==========

  static async getAvailableEmployeesForProject(projectId: string | number): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/available-for-project/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch available employees: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available employees:', error);
      return [];
    }
  }
}