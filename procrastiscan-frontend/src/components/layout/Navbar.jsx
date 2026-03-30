import { Plus, Search, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onAddTask }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 transition-shadow">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          ProcrastiScan
        </h1>
        <div className="hidden lg:flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-80 border border-transparent focus-within:border-purple-300 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onAddTask}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <UserCircle className="w-9 h-9" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
