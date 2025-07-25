// src/pages/moderator/UserManagement.jsx
import { useState, useEffect } from 'react';
import { users } from '../../mockData';
import { Search, User, Lock, Unlock } from 'lucide-react';

function ModeratorUserManagement() {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            // Moderator chỉ quản lý user, photographer, venue_owner
            const filteredUsers = users.filter(user =>
                ['user', 'photographer', 'venue_owner'].includes(user.role)
            );
            setUserList(filteredUsers);
            setLoading(false);
        }, 1000);
    }, []);

    const handleLockAccount = (id) => {
        setUserList(userList.map(user =>
            user.id === id ? { ...user, status: 'inactive' } : user
        ));
    };

    const handleUnlockAccount = (id) => {
        setUserList(userList.map(user =>
            user.id === id ? { ...user, status: 'active' } : user
        ));
    };

    // Lọc người dùng theo tìm kiếm
    const filteredUsers = userList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Quản lý tài khoản</h1>

            <div className="mb-6">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <div className="ml-4 font-medium text-gray-900">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {user.role === 'user' ? 'Người dùng' :
                                                user.role === 'photographer' ? 'Nhiếp ảnh gia' : 'Chủ địa điểm'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status === 'active' ? 'Hoạt động' :
                                                user.status === 'inactive' ? 'Bị khóa' : 'Chờ xác nhận'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.status === 'active' ? (
                                            <button
                                                onClick={() => handleLockAccount(user.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center justify-end"
                                            >
                                                <Lock className="w-4 h-4 mr-1" /> Khóa
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnlockAccount(user.id)}
                                                className="text-green-600 hover:text-green-900 flex items-center justify-end"
                                            >
                                                <Unlock className="w-4 h-4 mr-1" /> Mở khóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ModeratorUserManagement;