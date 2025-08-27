import React from "react";

interface ChartData {
  name: string;
  value: number;
  label?: string;
}

interface ChartContainerProps {
  title: string;
  data: ChartData[];
  type: "line" | "bar" | "pie";
  color?: string;
  height?: number;
  loading?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  type,
  color = "#3B82F6",
  height = 250,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p>Chưa có dữ liệu</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2" style={{ height }}>
          {type === "bar" && (
            <div className="flex items-end justify-between h-full space-x-1">
              {data.slice(-10).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(item.value / maxValue) * 80}%`,
                      backgroundColor: color,
                      minHeight: item.value > 0 ? "4px" : "0px",
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {item.name.split("/").slice(-2).join("/")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "line" && (
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {data.length > 1 && (
                  <polyline
                    points={data
                      .slice(-10)
                      .map(
                        (item, index) =>
                          `${
                            (index / (data.slice(-10).length - 1)) * 380 + 10
                          },${190 - (item.value / maxValue) * 170}`
                      )
                      .join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
                {data.slice(-10).map((item, index) => (
                  <circle
                    key={index}
                    cx={(index / (data.slice(-10).length - 1)) * 380 + 10}
                    cy={190 - (item.value / maxValue) * 170}
                    r="4"
                    fill={color}
                  />
                ))}
              </svg>
              <div className="flex justify-between mt-2">
                {data.slice(-10).map((item, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {item.name.split("/").slice(-2).join("/")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Tổng:{" "}
          {data
            .reduce((sum, item) => sum + item.value, 0)
            .toLocaleString("vi-VN")}
        </div>
      )}
    </div>
  );
};

export default ChartContainer;
