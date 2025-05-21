// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authUsers } from '../../mockData';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Tìm user trong dữ liệu mẫu
    const user = authUsers.find(user => user.email === email && user.password === password);

    setTimeout(() => {
      if (user) {
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }));

        toast.success('Đăng nhập thành công!');

        // Chuyển hướng dựa vào vai trò
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'moderator') {
          navigate('/moderator');
        }
      } else {
        toast.error('Email hoặc mật khẩu không đúng!');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập SnapLink</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="mb-1">Tài khoản demo:</p>
          <p>Admin: admin@snaplink.com / password</p>
          <p>Moderator: moderator@snaplink.com / password</p>
        </div>
      </div>
    </div>
  );
}

export default Login;