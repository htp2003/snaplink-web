import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentModeration from './pages/admin/ContentModeration';
import BookingManagement from './pages/admin/BookingManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import Settings from './pages/admin/Settings';

// Bảo vệ route - kiểm tra đã đăng nhập chưa
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi load ứng dụng
    const user = localStorage.getItem('user');
    setIsAuthenticated(user !== null);
    
    // Thêm event listener để cập nhật khi trạng thái đăng nhập thay đổi
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(user !== null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
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
        
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;