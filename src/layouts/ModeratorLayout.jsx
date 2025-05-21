// src/layouts/ModeratorLayout.jsx
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Flag, UserCheck, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ModeratorLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.success('Đăng xuất thành công');
        navigate('/login');
    };

    const menuItems = [
        { path: '/moderator', icon: <BarChart className="w-5 h-5" />, label: 'Tổng quan' },
        { path: '/moderator/content', icon: <Flag className="w-5 h-5" />, label: 'Kiểm duyệt nội dung' },
        { path: '/moderator/reports', icon: <Flag className="w-5 h-5" />, label: 'Xử lý báo cáo' },
        { path: '/moderator/users', icon: <UserCheck className="w-5 h-5" />, label: 'Quản lý tài khoản' },
    ];

    return (
        <div className="flex h-screen">
            <div className="bg-gray-800 text-white w-64 h-screen">
                <div className="p-4">
                    <h1 className="text-xl font-bold">SnapLink Moderator</h1>
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

            <div className="flex-1 flex flex-col">
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
                            <span className="mr-4">Moderator</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ModeratorLayout;