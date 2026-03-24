export class AuthService {
  static getCurrentUser() {
    // Get from localStorage or context
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}