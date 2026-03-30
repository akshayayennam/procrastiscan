import { useState, useEffect } from 'react';
import { 
  getDashboardSummary, 
  getProductivityTrend, 
  getProcrastinationScore, 
  getWarnings 
} from '../services/api';
import SummaryCard from '../components/dashboard/SummaryCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import ProcrastinationTable from '../components/dashboard/ProcrastinationTable';
import WarningList from '../components/dashboard/WarningList';
import AIAssistant from '../components/dashboard/AIAssistant';
import { CheckCircle2, Clock, AlertCircle, LayoutList, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [scores, setScores] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, trendRes, scoresRes, warningsRes] = await Promise.all([
          getDashboardSummary(),
          getProductivityTrend(),
          getProcrastinationScore(),
          getWarnings(),
        ]);

        setSummary(summaryRes.data);
        setTrend(trendRes.data);
        setScores(scoresRes.data);
        setWarnings(warningsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Listen for task creation from the global layout
    const handleTaskCreated = () => fetchDashboardData();
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Overview
          </h1>
          <p className="text-gray-500 mt-1">Here's your productivity status at a glance.</p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard 
            title="Total Tasks" 
            value={summary.totalTasks} 
            icon={LayoutList} 
            colorClass="bg-blue-50 text-blue-600" 
          />
          <SummaryCard 
            title="Completed" 
            value={summary.completedTasks} 
            icon={CheckCircle2} 
            colorClass="bg-green-50 text-green-600" 
          />
          <SummaryCard 
            title="Pending" 
            value={summary.pendingTasks} 
            icon={Clock} 
            colorClass="bg-amber-50 text-amber-600" 
          />
          <SummaryCard 
            title="Overdue" 
            value={summary.overdueTasks} 
            icon={AlertCircle} 
            colorClass="bg-red-50 text-red-600" 
          />
          <SummaryCard 
            title="Productivity Score" 
            value={summary.productivityScore ? `${summary.productivityScore}%` : '0%'} 
            icon={TrendingUp} 
            colorClass="bg-purple-50 text-purple-600" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <ProductivityChart data={trend} />
          <ProcrastinationTable data={scores} />
        </div>
        <div className="lg:sticky lg:top-24">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}
