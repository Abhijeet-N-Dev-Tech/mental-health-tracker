import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type ViewMode = 'weekly' | 'monthly';

interface SleepEntry {
  date: string;
  sleepHours: number;
}

interface ActivityEntry {
  date: string;
  [type: string]: string | number;
}

interface ChartData {
  sleep: SleepEntry[];
  activity: ActivityEntry[];
}

export default function Overview({ refetchSignal }: { refetchSignal: boolean }) {
  const [view, setView] = useState<ViewMode>('weekly');
  const [data, setData] = useState<ChartData>({
    sleep: [],
    activity: [],
  });

  const fetchChartData = async () => {
    const res = await axios.get<ChartData>(`${API_BASE}/logs/chart-data?view=${view}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchChartData();
  }, [view, refetchSignal]);

  const activityTypes = Array.from(
    new Set(data.activity.flatMap((entry) => Object.keys(entry).filter((k) => k !== 'date')))
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-end mb-4">
        <select
          value={view}
          onChange={(e) => setView(e.target.value as ViewMode)}
          className="px-3 py-1 rounded border text-sm"
        >
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>
      </div>

      {/* Activity Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Activity Duration by Type</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activityTypes.map((type) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type.charAt(0).toUpperCase() + type.slice(1)}
                  stroke={getColor(type)}
                  strokeWidth={2}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleep Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sleep Hours</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sleep}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sleepHours" fill="#f59e0b" name="Sleep Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function getColor(type: string): string {
  const colorMap: Record<string, string> = {
    exercise: '#0ea5e9',
    reading: '#facc15',
    meditation: '#8b5cf6',
    work: '#ef4444',
    hobby: '#22d3ee',
    walking: '#10b981',
    running: '#3b82f6',
    yoga: '#f472b6',
    other: '#a78bfa',
  };
  return colorMap[type] || '#94a3b8';
}
