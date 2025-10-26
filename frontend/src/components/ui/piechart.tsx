import { useEffect, useRef, useState } from 'react';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C4E538', '#36CFC9'];

export default function PieChart({ data, title = 'Pie Chart' }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add default colors if not provided
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = -Math.PI / 2;

    chartData.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = hoveredIndex === index ? item.color + 'CC' : item.color;
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      const percentage = ((item.value / total) * 100).toFixed(0);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [chartData, hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += 2 * Math.PI;
      angle += Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;

      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = 0;
      
      for (let i = 0; i < chartData.length; i++) {
        const sliceAngle = (chartData[i].value / total) * 2 * Math.PI;
        if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
          setHoveredIndex(i);
          return;
        }
        currentAngle += sliceAngle;
      }
    }
    
    setHoveredIndex(null);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h2>
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          />
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
          {hoveredIndex !== null && (
            <div className="mt-4 text-center p-3 bg-gray-100 rounded">
              <p className="text-sm font-semibold text-gray-800">
                {chartData[hoveredIndex].name}
              </p>
              <p className="text-xs text-gray-600">
                Value: {chartData[hoveredIndex].value} (
                {((chartData[hoveredIndex].value / chartData.reduce((s, i) => s + i.value, 0)) * 100).toFixed(1)}%)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to convert object to array format
export function convertToChartData(data: Record<string, number>): PieChartData[] {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));
}