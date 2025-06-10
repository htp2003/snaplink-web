// services/authService.ts
import { mockAuthUsers, type AuthUser } from '../mocks/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'moderator';
  };
  message?: string;
}

class AuthService {
  // Simulate API login with delay
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockAuthUsers.find(
          (user) => 
            user.email === credentials.email && 
            user.password === credentials.password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            success: true,
            user: userWithoutPassword
          });
        } else {
          resolve({
            success: false,
            message: 'Email hoặc mật khẩu không đúng!'
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  // Save user to localStorage
  saveUser(user: LoginResponse['user']): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Get current user from localStorage
  getCurrentUser(): LoginResponse['user'] | null {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.logout();
      return null;
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get user role
  getUserRole(): 'admin' | 'moderator' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }
}

export const authService = new AuthService();