import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import TaskModal from '../tasks/TaskModal';
import { createTask } from '../../services/api';

export default function Layout() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOpenModal = () => setIsTaskModalOpen(true);
    window.addEventListener('openTaskModal', handleOpenModal);
    return () => window.removeEventListener('openTaskModal', handleOpenModal);
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setIsTaskModalOpen(false);
      // If we are on the tasks page, we want to refresh it.
      // If we are on dashboard, we might want to refresh summary, 
      // but for now, let's just trigger a custom event.
      window.dispatchEvent(new CustomEvent('taskCreated'));
      
      // If we are not on the tasks page, maybe redirect to it? 
      // Or just stay on current page. Let's stay on current page.
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden text-gray-900 selection:bg-purple-200 selection:text-purple-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar onAddTask={() => setIsTaskModalOpen(true)} />
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth will-change-scroll pb-24">
          <div className="max-w-7xl mx-auto h-full">
            {/* The routed content goes here */}
            <Outlet context={{ isTaskModalOpen, setIsTaskModalOpen }} />
          </div>
        </main>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSave={handleCreateTask} 
      />
    </div>
  );
}
