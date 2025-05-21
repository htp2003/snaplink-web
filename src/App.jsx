// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import ModeratorLayout from './layouts/ModeratorLayout';
import Login from './pages/auth/Login';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentModeration from './pages/admin/ContentModeration';
import BookingManagement from './pages/admin/BookingManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import Settings from './pages/admin/Settings';

// Moderator pages
import ModeratorDashboard from './pages/moderator/Dashboard';
import ModeratorContentModeration from './pages/moderator/ContentModeration';
import ReportHandling from './pages/moderator/ReportHandling';
import ModeratorUserManagement from './pages/moderator/UserManagement';

// Kiểm tra quyền truy cập
function ProtectedRoute({ children, allowedRoles }) {
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);

  if (!allowedRoles.includes(user.role)) {
    // Chuyển hướng về trang thích hợp theo vai trò
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'moderator') {
      return <Navigate to="/moderator" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi load ứng dụng
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }

    // Thêm event listener để cập nhật khi trạng thái đăng nhập thay đổi
    const handleStorageChange = () => {
      const userJson = localStorage.getItem('user');
      setUser(userJson ? JSON.parse(userJson) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? (
            user.role === 'admin' ? <Navigate to="/admin" replace /> :
              user.role === 'moderator' ? <Navigate to="/moderator" replace /> :
                <Login />
          ) : <Login />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentModeration />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Moderator Routes */}
        <Route path="/moderator" element={
          <ProtectedRoute allowedRoles={['moderator']}>
            <ModeratorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ModeratorDashboard />} />
          <Route path="content" element={<ModeratorContentModeration />} />
          <Route path="reports" element={<ReportHandling />} />
          <Route path="users" element={<ModeratorUserManagement />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin" replace /> :
              user.role === 'moderator' ? <Navigate to="/moderator" replace /> :
                <Navigate to="/login" replace />
          ) : <Navigate to="/login" replace />
        } />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;