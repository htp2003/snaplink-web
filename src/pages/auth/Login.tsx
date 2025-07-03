// pages/auth/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import LoginForm from "../../components/auth/LoginForm";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isTokenValid()) {
      // Redirect to appropriate dashboard
      const redirectPath = user.role === "admin" ? "/admin" : "/moderator";
      navigate(redirectPath, { replace: true });
    } else if (user) {
      // Token expired, clear storage
      authService.logout();
      toast.error("Phiên đăng nhập đã hết hạn!");
    }
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.user) {
        // Save user to localStorage
        authService.saveUser(response.user);

        // Show success message
        toast.success(`Chào mừng ${response.user.name}!`);

        // Redirect based on role
        const redirectPath =
          response.user.role === "admin" ? "/admin" : "/moderator";
        navigate(redirectPath, { replace: true });
      } else {
        // Show error message
        toast.error(response.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} />;
};

export default Login;
