// services/authService.ts
import { LoginRequest, LoginResponse, User } from "../types/auth.types";
import { apiClient } from "./apiClient";

const JWT_CLAIMS = {
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  NAME: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  NAMEIDENTIFIER:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
};

class AuthService {
  private tokenKey = "token";
  private userKey = "user";

  // Parse JWT token để lấy thông tin user
  private parseJwtToken(token: string): User | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      console.log("JWT Payload:", payload);

      // Extract user info từ JWT claims
      const userId = parseInt(payload[JWT_CLAIMS.NAMEIDENTIFIER]) || 0;
      const name = payload[JWT_CLAIMS.NAME] || "";
      const role = payload[JWT_CLAIMS.ROLE] || "";

      // Convert role từ "Admin" -> "admin", "Moderator" -> "moderator"
      const normalizedRole = role.toLowerCase() as "admin" | "moderator";

      const user: User = {
        id: userId,
        name: name,
        email: "", // JWT không chứa email, có thể lấy từ response khác
        role: normalizedRole,
        token: token,
      };

      console.log("Parsed User:", user);
      return user;
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      return null;
    }
  }

  // Check if token is valid (not expired)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      const exp = payload.exp;
      const currentTime = Date.now() / 1000;

      return exp > currentTime;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<any>(
        "/api/Auth/login",
        credentials
      );
      console.log("Login API Response:", response);

      // Kiểm tra response structure
      if (response.data && response.data.token) {
        const token = response.data.token;

        // Parse JWT để lấy user info
        const user = this.parseJwtToken(token);

        if (user) {
          // Save token và user info
          this.saveToken(token);
          this.saveUser(user);

          return {
            success: true,
            message: "Đăng nhập thành công",
            user: user,
            token: token,
          };
        } else {
          return {
            success: false,
            message: "Không thể parse thông tin người dùng từ token",
          };
        }
      } else {
        return {
          success: false,
          message: response.data?.message || "Đăng nhập thất bại",
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }

      return {
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập",
      };
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  saveUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Utility method để check role cụ thể
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  }

  isModerator(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "moderator";
  }

  hasRole(role: "admin" | "moderator"): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export const authService = new AuthService();
