// services/authService.ts
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

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
    role: "admin" | "moderator";
  };
  token?: string;
  message?: string;
}

class AuthService {
  private baseUrl = API_BASE_URL;
  private tokenKey = "auth_token";

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("Attempting login with:", credentials.email);

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed:", errorText);

        return {
          success: false,
          message:
            response.status === 401
              ? "Email hoặc mật khẩu không đúng!"
              : "Lỗi đăng nhập! Vui lòng thử lại.",
        };
      }

      const data = await response.json();
      console.log("Login response data:", data);

      // Check if response contains token
      if (data && data.token) {
        // Save token
        localStorage.setItem(this.tokenKey, data.token);

        // Decode JWT to get user info
        const userInfo = this.decodeJWTPayload(data.token);

        if (userInfo) {
          const user = {
            id: parseInt(userInfo.nameid), // nameid từ JWT
            name: userInfo.name || "Unknown",
            email: "", // Sẽ được cập nhật sau
            role:
              userInfo.role?.toLowerCase() === "admin" ? "admin" : "moderator",
          };

          // Try to get user details including email from API
          try {
            const userDetailResponse = await fetch(
              `${this.baseUrl}/api/User/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              }
            );

            if (userDetailResponse.ok) {
              const userDetail = await userDetailResponse.json();
              user.email = userDetail.email || "unknown@example.com";
            }
          } catch (error) {
            console.warn("Could not fetch user details:", error);
            // Fallback to a default email or extract from login credentials
            user.email = credentials.email;
          }

          return {
            success: true,
            user,
            token: data.token,
          };
        } else {
          return {
            success: false,
            message: "Không thể giải mã thông tin người dùng!",
          };
        }
      } else {
        return {
          success: false,
          message: "Phản hồi từ server không đúng định dạng!",
        };
      }
    } catch (error) {
      console.error("Login API error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server! Vui lòng kiểm tra kết nối mạng.",
      };
    }
  }

  // Save user to localStorage
  saveUser(user: LoginResponse["user"]): void {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  // Get current user from localStorage
  getCurrentUser(): LoginResponse["user"] | null {
    try {
      const userJson = localStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout();
      return null;
    }
  }

  // Get token for API calls
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout user
  logout(): void {
    localStorage.removeItem("user");
    localStorage.removeItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get user role
  getUserRole(): "admin" | "moderator" | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if token is valid (improved with expiration check)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeJWTPayload(token);
      if (!payload) return false;

      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }

  // Decode JWT payload to get user information
  private decodeJWTPayload(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      // JWT claims mapping
      return {
        nameid:
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        name: payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
        role: payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        exp: payload.exp,
        iss: payload.iss,
        aud: payload.aud,
      };
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
