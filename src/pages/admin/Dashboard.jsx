import { useState, useEffect } from 'react';
import { statistics } from '../../mockData';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhotographers: 0,
    totalVenues: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    recentReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API
    setTimeout(() => {
      setStats(statistics);
      setLoading(false);
    }, 500);
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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Người dùng</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Nhiếp ảnh gia</h2>
          <p className="text-3xl font-bold">{stats.totalPhotographers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Địa điểm</h2>
          <p className="text-3xl font-bold">{stats.totalVenues}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Hoạt động cần chú ý</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span>Nội dung chờ phê duyệt</span>
              <span className="font-bold">{stats.pendingApprovals}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span>Báo cáo vi phạm mới</span>
              <span className="font-bold">{stats.recentReports}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Đặt chỗ gần đây</h2>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;