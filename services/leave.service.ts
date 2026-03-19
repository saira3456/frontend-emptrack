// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL);

export class LeaveService {
  static async getEmployeeLeaves(employeeId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/leaves`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return [];
    }
  }
}