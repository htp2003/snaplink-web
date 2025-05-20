import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Header() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Đăng xuất thành công');
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold">SnapLink</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center">
          <User className="w-8 h-8 text-gray-400 mr-2" />
          <span className="mr-4">Admin</span>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;