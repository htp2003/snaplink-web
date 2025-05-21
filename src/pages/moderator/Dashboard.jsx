// src/pages/moderator/Dashboard.jsx
import { useState, useEffect } from 'react';

function ModeratorDashboard() {
    const [stats, setStats] = useState({
        pendingContent: 0,
        pendingReports: 0,
        suspendedAccounts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            setStats({
                pendingContent: 15,
                pendingReports: 8,
                suspendedAccounts: 3
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="h-40 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Tổng quan Moderator</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Nội dung chờ duyệt</h2>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingContent}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Báo cáo cần xử lý</h2>
                    <p className="text-3xl font-bold text-red-500">{stats.pendingReports}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Tài khoản đã tạm khóa</h2>
                    <p className="text-3xl font-bold text-gray-500">{stats.suspendedAccounts}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Hướng dẫn dành cho Moderator</h2>
                <div className="space-y-2">
                    <p>1. Kiểm duyệt nội dung: Xem xét và duyệt các nội dung được đăng tải như hồ sơ nhiếp ảnh gia, địa điểm, và ảnh.</p>
                    <p>2. Xử lý báo cáo: Xem xét và xử lý các báo cáo từ người dùng về nội dung không phù hợp.</p>
                    <p>3. Quản lý tài khoản: Có thể tạm khóa hoặc mở khóa tài khoản người dùng khi cần thiết.</p>
                </div>
            </div>
        </div>
    );
}

export default ModeratorDashboard;