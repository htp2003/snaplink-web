import { useState, useEffect } from 'react';

function Settings() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Giả lập gọi API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Tính năng đang phát triển</p>
        </div>
      )}
    </div>
  );
}

export default Settings;