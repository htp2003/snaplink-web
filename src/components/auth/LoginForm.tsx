import React, { useState } from "react";
import { Eye, EyeOff, Camera, Shield, Lock, Mail } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>

              {/* Brand */}
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                SnapLink
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Admin & Moderator Portal
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Đăng nhập hệ thống
              </h2>
              <p className="text-gray-500 text-sm">
                Nhập thông tin đăng nhập của bạn
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "email"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      focusedField === "email"
                        ? "border-blue-500 bg-blue-50/30"
                        : "border-gray-300 bg-gray-50/50"
                    }`}
                    placeholder="admin@snaplink.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "password"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      focusedField === "password"
                        ? "border-blue-500 bg-blue-50/30"
                        : "border-gray-300 bg-gray-50/50"
                    }`}
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" strokeWidth={1.5} />
                    Đăng nhập
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mb-3">
                <Shield className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Hệ thống quản trị bảo mật
              </p>
              <p className="text-xs text-gray-500">
                Chỉ dành cho Admin và Moderator được ủy quyền
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            Cần hỗ trợ? Liên hệ{" "}
            <span className="text-white font-medium hover:text-blue-200 transition-colors duration-200 cursor-pointer">
              support@snaplink.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
