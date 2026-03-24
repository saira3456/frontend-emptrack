import { Employee, CreateEmployeeDto } from '@/lib/types';

// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL);


export class EmployeeService {
  static async createEmployee(employeeData: CreateEmployeeDto): Promise<Employee> {
    try {
      const url = `${API_BASE_URL}/employees`;
      console.log('📤 Sending request to:', url);
      console.log('📦 Employee data:', { ...employeeData, password: '[HIDDEN]' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response body:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          if (responseText) errorMessage = responseText;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      console.error('❌ Error in createEmployee:', error);
      throw error;
    }
  }

static async getAvailableEmployeesForProject(projectId: string | number): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/available-employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch available employees: ${response.status}`);
      // Fallback to all employees
      return await this.getAllEmployees();
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching available employees:', error);
    // Fallback to all employees
    return await this.getAllEmployees();
  }
}

  
  static async getAllEmployees(): Promise<Employee[]> {
    try {
      const url = `${API_BASE_URL}/employees`;
      console.log('📤 Fetching employees from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch employees: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Fetched employees:', data);

      return data;
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      throw error;
    }
  }

  static async getEmployeeById(id: string): Promise<Employee> {
    try {
      const url = `${API_BASE_URL}/employees/${id}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch employee: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

static async updateEmployee(id: string | number, employeeData: Partial<Employee>): Promise<any> {
  try {
    const url = `${API_BASE_URL}/employees/${id}`;
    console.log('📤 Updating employee at:', url, employeeData);

    const response = await fetch(url, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    console.log('📥 Update response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update employee: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Employee Updated:', data);
    return data.data || data; 
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    throw error;
  }
}
    

  static async deleteEmployee(id: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/employees/${id}`;
      console.log('📤 Deleting employee at:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete employee: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Employee deleted:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      throw error;
    }
  }
}