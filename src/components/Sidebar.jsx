import { Link, useLocation } from 'react-router-dom';
import { BarChart, Users, Image, Calendar, CreditCard, Settings } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: <BarChart className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Quản lý người dùng' },
    { path: '/admin/content', icon: <Image className="w-5 h-5" />, label: 'Kiểm duyệt nội dung' },
    { path: '/admin/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Quản lý đặt chỗ' },
    { path: '/admin/transactions', icon: <CreditCard className="w-5 h-5" />, label: 'Quản lý giao dịch' },
    { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Cài đặt' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold">SnapLink Admin</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center px-4 py-3 hover:bg-gray-700 ${location.pathname === item.path ? 'bg-gray-700 border-l-4 border-blue-500' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;