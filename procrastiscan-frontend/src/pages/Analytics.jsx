import { useState, useEffect } from 'react';
import { getOverdueTasks, getTopProcrastinatedTasks, getProcrastinationScore } from '../services/api';
import ProcrastinationTable from '../components/dashboard/ProcrastinationTable';
import { AlertCircle, TrendingDown, Clock, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Analytics() {
  const [overdue, setOverdue] = useState([]);
  const [topProcrastinated, setTopProcrastinated] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [overdueRes, topRes, scoresRes] = await Promise.all([
          getOverdueTasks(),
          getTopProcrastinatedTasks(),
          getProcrastinationScore(),
        ]);

        setOverdue(overdueRes.data);
        setTopProcrastinated(topRes.data);
        setScores(scoresRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();

    // Listen for task creation from the global layout
    const handleTaskCreated = () => fetchAnalyticsData();
    window.addEventListener('taskCreated', handleTaskCreated);

    return () => window.removeEventListener('taskCreated', handleTaskCreated);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Procrastination Analytics
        </h1>
        <p className="text-gray-500 mt-1">Deep dive into your habits and identify bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overdue Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{overdue.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Top Postponed</p>
            <p className="text-2xl font-bold text-gray-900">
              {topProcrastinated.length > 0 ? topProcrastinated[0].title : 'None'}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Delay</p>
            <p className="text-2xl font-bold text-gray-900">
              {scores.length > 0 
                ? (scores.reduce((acc, s) => acc + s.overdueDays, 0) / scores.length).toFixed(1) 
                : 0} days
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Most Procrastinated</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProcrastinated.length > 0 ? (
                  topProcrastinated.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">Postponed {task.postponeCount} times</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600">{task.postponeCount}x</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Overdue List</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {overdue.length > 0 ? (
                  overdue.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-red-50/30 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-900">{task.title}</p>
                        <p className="text-sm text-red-600">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-700">
                          {Math.floor((new Date() - new Date(task.deadline)) / (1000 * 60 * 60 * 24))} days ago
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Great! No overdue tasks.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ProcrastinationTable data={scores} />
      </div>
    </div>
  );
}
