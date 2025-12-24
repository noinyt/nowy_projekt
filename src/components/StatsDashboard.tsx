'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsProps {
  userCount: number;
  taskStats: { status: string; count: number }[];
}

export function StatsDashboard({ userCount, taskStats }: StatsProps) {
  const data = taskStats.map(s => ({
    name: s.status,
    ilość: s.count
  }));
  
  const COLORS = ['#016630', '#193cb8', '#e8d5c7'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Zarejestrowani Użytkownicy</h3>
        <p className="text-4xl font-bold text-gray-900 mt-2">{userCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-64">
        <h3 className="text-gray-500 text-sm font-medium uppercase mb-4">Status Zadań (Globalnie)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <Tooltip />
            <Bar dataKey="ilość" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}