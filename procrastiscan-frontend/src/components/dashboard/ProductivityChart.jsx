import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductivityChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        Productivity Trend
      </h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
              tickFormatter={(dateStr) => {
                try {
                  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                } catch (e) {
                  return dateStr;
                }
              }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="completedTasks" 
              name="Completed Tasks"
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}
