// frontend/src/services/attendance.service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  checkIn?: string;
  checkOut?: string;
  overtimeHours: number;
  createdAt: string;
  updatedAt: string;
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
  totalOvertime: number;
  attendanceRate: number;
}

export class AttendanceService {
  static async getAttendanceByDate(date: string): Promise<DailyAttendance[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance?date=${date}`);
      if (!response.ok) return [];
      return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async bulkMarkAttendance(date: string, status: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, status }),
    });
    return response.json();
  }

  static async updateAttendance(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async getAttendanceSummary(startDate: string, endDate: string): Promise<AttendanceSummary[]> {
    const response = await fetch(`${API_BASE_URL}/attendance/summary?startDate=${startDate}&endDate=${endDate}`);
    return response.json();
  }
}