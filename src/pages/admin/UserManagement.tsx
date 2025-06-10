// pages/admin/UserManagement.tsx
import React, { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { mockUsers, type User as UserType } from "../../mocks/users";

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUserList(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  // Filter users based on search term
  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role: UserType["role"]): string => {
    switch (role) {
      case "user":
        return "Người dùng";
      case "photographer":
        return "Nhiếp ảnh gia";
      case "venue_owner":
        return "Chủ địa điểm";
      case "admin":
        return "Quản trị viên";
      case "moderator":
        return "Kiểm duyệt viên";
      default:
        return "Khác";
    }
  };

  const getStatusLabel = (status: UserType["status"]): string => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Bị khóa";
      case "pending":
        return "Chờ xác nhận";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: UserType["status"]): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleStatus = (id: number) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      <div className="mb-6 flex justify-between">
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

        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Thêm người dùng
        </button>
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4 font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Xem
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                      Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {user.status === "active" ? "Khóa" : "Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy người dùng nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
