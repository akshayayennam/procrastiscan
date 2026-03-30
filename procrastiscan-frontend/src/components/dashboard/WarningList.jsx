import { AlertTriangle, Clock, CalendarDays } from 'lucide-react';

export default function WarningList({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
          <CalendarDays className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-gray-900 font-medium">All caught up!</h3>
        <p className="text-sm text-gray-500 mt-1">No high-risk tasks at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          High Risk Tasks
        </h3>
        <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {warnings.length} Warnings
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {warnings.map((warning, idx) => (
          <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
            <div className="bg-red-50 p-2 rounded-lg mt-1 shrink-0">
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{warning.title}</h4>
              <p className="text-sm text-red-600 mt-0.5">{warning.warning}</p>
              <p className="text-xs text-gray-500 mt-1">Deadline: {new Date(warning.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
