// services/apiClient.ts
import { API_BASE_URL } from "../config/api";
import { authService } from "./authService";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

class ApiClient {
  private baseUrl = API_BASE_URL;

  private getHeaders(): Record<string, string> {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || "API request failed",
          errors: data.errors,
        };
      }
    } catch (error) {
      console.error("API response parsing error:", error);
      return {
        success: false,
        message: "Lỗi phản hồi từ server",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API GET error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API POST error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API PUT error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API DELETE error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  }

  // Patch method for partial updates
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("API PATCH error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  }
}

export const apiClient = new ApiClient();

// Utility function to replace URL parameters
export const replaceUrlParams = (
  url: string,
  params: Record<string, string | number>
): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value));
  });
  return result;
};
