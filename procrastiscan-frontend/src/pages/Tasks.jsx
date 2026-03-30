import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTasks, completeTask, postponeTask, deleteTask, createTask } from '../services/api';
import TaskModal from '../components/tasks/TaskModal';
import FocusTimer from '../components/tasks/FocusTimer';
import { CheckCircle, Clock, Trash2, AlertCircle, Calendar, Plus, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Tasks() {
  const { isTaskModalOpen, setIsTaskModalOpen } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusTask, setFocusTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Listen for task creation from the global layout
    const handleTaskCreated = () => fetchTasks();
    window.addEventListener('taskCreated', handleTaskCreated);
    
    return () => window.removeEventListener('taskCreated', handleTaskCreated);
  }, []);

  const handleCompleteTask = async (id) => {
    try {
      await completeTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  const handlePostponeTask = async (id) => {
    try {
      await postponeTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to postpone task", error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            My Tasks
          </h1>
          <p className="text-gray-500 mt-1">Manage your work and beat procrastination.</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all sm:w-auto w-full md:hidden"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div key={task.id} className={cn(
                "p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50",
                task.status === 'COMPLETED' ? "bg-gray-50/50" : ""
              )}>
                <div className="flex items-start gap-4 flex-1">
                  <button 
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.status === 'COMPLETED'}
                    className={cn(
                      "mt-1 shrink-0 rounded-full transition-colors",
                      task.status === 'COMPLETED' ? "text-green-500" : "text-gray-300 hover:text-green-500"
                    )}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  <div>
                    <h3 className={cn(
                      "text-lg font-bold",
                      task.status === 'COMPLETED' ? "text-gray-400 line-through" : "text-gray-900"
                    )}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-500 mt-1 text-sm">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                        task.status === 'COMPLETED' 
                          ? "bg-gray-100 text-gray-500" 
                          : new Date(task.deadline) < new Date() 
                            ? "bg-red-50 text-red-600" 
                            : "bg-blue-50 text-blue-600"
                      )}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(task.deadline)}
                        {new Date(task.deadline) < new Date() && task.status !== 'COMPLETED' && " (Overdue)"}
                      </span>
                      
                      {task.priority && (
                        <span className={cn(
                          "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
                          task.priority === 'High' 
                            ? "bg-red-100 text-red-700" 
                            : task.priority === 'Medium'
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        )}>
                          {task.priority}
                        </span>
                      )}
                      
                      {task.postponeCount > 0 && task.status !== 'COMPLETED' && (
                        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Postponed {task.postponeCount} times
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center ml-10 sm:ml-0">
                  {task.status !== 'COMPLETED' && (
                    <>
                      <button 
                        onClick={() => handleCompleteTask(task.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                      <button 
                        onClick={() => setFocusTask(task)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Timer className="w-4 h-4" />
                        Focus
                      </button>
                      <button 
                        onClick={() => handlePostponeTask(task.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        Postpone
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              You haven't added any tasks. Get started by adding a task to track your productivity!
            </p>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-purple-200 transition-all transform hover:-translate-y-0.5"
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>

      {focusTask && (
        <FocusTimer 
          task={focusTask} 
          onClose={() => setFocusTask(null)} 
        />
      )}
    </div>
  );
}
