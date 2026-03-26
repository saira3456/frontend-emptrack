const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  checkIn?: string;
  checkOut?: string;
  overtimeHours: number;
}

export interface DailyAttendance {
  employee: {
    id: number;
    name: string;
    email: string;
    position: string;
    department: string;
  };
  attendance: Attendance | null;
}

export interface AttendanceSummary {
  date: string;
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  notMarked: number;
  attendanceRate: number;
}

export class AttendanceService {
  static async getAttendanceByDate(date: string): Promise<DailyAttendance[]> {
    try {
      const url = `${API_BASE_URL}/attendance?date=${date}`;
      console.log('📤 Fetching attendance for date:', date);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch attendance:', response.status);
        return [];
      }

      const data = await response.json();
      console.log('✅ Attendance data fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  static async markAttendance(data: {
    employeeId: number;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
  }): Promise<any> {
    try {
      const url = `${API_BASE_URL}/attendance`;
      console.log('📤 Marking attendance:', data);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark attendance: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Attendance marked:', result);
      return result;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  static async bulkMarkAttendance(date: string, status: string): Promise<any> {
    try {
      const url = `${API_BASE_URL}/attendance/bulk`;
      console.log('📤 Bulk marking attendance:', { date, status });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to bulk mark attendance: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Bulk attendance marked:', result);
      return result;
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      throw error;
    }
  }

  static async updateAttendance(id: number, data: any): Promise<any> {
    try {
      const url = `${API_BASE_URL}/attendance/${id}`;
      console.log('📤 Updating attendance:', { id, data });
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update attendance: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Attendance updated:', result);
      return result;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  static async updateCheckInOut(data: {
    employeeId: number;
    date: string;
    checkIn?: string;
    checkOut?: string;
    overtimeHours?: number;
  }): Promise<any> {
    try {
      const url = `${API_BASE_URL}/attendance/check-in-out`;
      console.log('📤 Updating check in/out:', data);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update check in/out: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Check in/out updated:', result);
      return result;
    } catch (error) {
      console.error('Error updating check in/out:', error);
      throw error;
    }
  }

  static async getAttendanceSummary(startDate: string, endDate: string): Promise<AttendanceSummary[]> {
    try {
      const url = `${API_BASE_URL}/attendance/summary?startDate=${startDate}&endDate=${endDate}`;
      console.log('📤 Fetching attendance summary:', { startDate, endDate });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch attendance summary:', response.status);
        return [];
      }

      const data = await response.json();
      console.log('✅ Attendance summary fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      return [];
    }
  }

  static async getEmployeeAttendance(employeeId: number, startDate?: string, endDate?: string): Promise<Attendance[]> {
    try {
      let url = `${API_BASE_URL}/attendance/employee/${employeeId}`;
      if (startDate) {
        url += `?startDate=${startDate}`;
        if (endDate) {
          url += `&endDate=${endDate}`;
        }
      }
      
      console.log('📤 Fetching employee attendance:', { employeeId, startDate, endDate });
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch employee attendance:', response.status);
        return [];
      }

      const data = await response.json();
      console.log('✅ Employee attendance fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      return [];
    }
  }
}