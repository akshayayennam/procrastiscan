export default function ProcrastinationTable({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Top Procrastinated Tasks</h3>
        <p className="text-sm text-gray-500 mt-1">Tasks needing your immediate attention.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4 text-center">Postponed</th>
              <th className="px-6 py-4 text-center">Overdue Days</th>
              <th className="px-6 py-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={item.taskId || idx} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                      {item.postponeCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-600 font-medium">
                    {item.overdueDays}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${Math.min((item.procrastinationScore / 100) * 100, 100)}%` }} 
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-8">{item.procrastinationScore}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No procrastination detected. Keep up the good work!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
