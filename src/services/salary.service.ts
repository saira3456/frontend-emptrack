// const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL);

export class SalaryService {
  static async getEmployeeSalaries(employeeId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/salaries`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching salaries:', error);
      return [];
    }
  }
}