import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Sử dụng logout từ useAuth

  // Check if user is already logged in
  useEffect(() => {
    if (user && authService.isTokenValid()) {
      const redirectPath = user.role === "admin" ? "/admin" : "/moderator";
      navigate(redirectPath, { replace: true });
    } else if (user) {
      // Token expired, clear storage and logout
      logout(); // Gọi logout từ useAuth
      toast.error("Phiên đăng nhập đã hết hạn!");
    }
  }, [user, navigate, logout]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      console.log("Login Response:", response);

      if (response.success && response.user) {
        authService.saveUser(response.user);
        toast.success(`Chào mừng ${response.user.name}!`);
        const redirectPath =
          response.user.role === "admin" ? "/admin" : "/moderator";
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(response.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm logout để gọi từ component khác nếu cần
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // Chuyển hướng ngay lập tức
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} />;
};

export default Login;
