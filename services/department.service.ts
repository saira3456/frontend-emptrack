import { Department, CreateDepartmentDto } from '@/lib/types';

// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL);

export class DepartmentService {
  static async createDepartment(departmentData: CreateDepartmentDto): Promise<Department> {
    try {
      const url = `${API_BASE_URL}/departments`;
      console.log('📤 Creating department at:', url);
      console.log('📦 Department data:', departmentData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
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
      console.error('❌ Error creating department:', error);
      throw error;
    }
  }

  static async getAllDepartments(): Promise<Department[]> {
    try {
      const url = `${API_BASE_URL}/departments`;
      console.log('📤 Fetching departments from:', url);

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
        throw new Error(errorData.message || `Failed to fetch departments: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Fetched departments:', data);

      return data;
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
      throw error;
    }
  }

  static async getDepartmentById(id: string): Promise<Department> {
    try {
      const url = `${API_BASE_URL}/departments/${id}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch department: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  }

  static async deleteDepartment(id: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/departments/${id}`;
      console.log('📤 Deleting department at:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete department: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Department deleted:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deleting department:', error);
      throw error;
    }
  }
}