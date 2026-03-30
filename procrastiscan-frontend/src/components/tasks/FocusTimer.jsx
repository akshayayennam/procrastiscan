import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react';

export default function FocusTimer({ task, onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert(`Time's up for: ${task.title}! Take a break.`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, task.title]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-8 duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 w-80 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <div 
            className="h-full bg-purple-600 transition-all duration-1000" 
            style={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <Timer className="w-5 h-5" />
            <span>Focus Mode</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 font-medium mb-1 truncate px-4">Working on: <span className="text-gray-900 font-bold">{task.title}</span></p>
          <h2 className="text-6xl font-black text-gray-900 tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-amber-100' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                Start Focus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
