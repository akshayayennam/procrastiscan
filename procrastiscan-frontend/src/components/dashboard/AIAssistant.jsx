import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ListChecks, Info, ChevronRight } from 'lucide-react';
import { getTasks } from '../../services/api';

export default function AIAssistant() {
  const [recommendation, setRecommendation] = useState(null);
  const [tasksExist, setTasksExist] = useState(false);
  const [loading, setLoading] = useState(true);

  const generateBreakdown = (task) => {
    const title = task.title.toLowerCase();
    
    if (title.includes('project') || title.includes('assignment')) {
      return [
        "Break down the project into smaller modules or sections.",
        "Complete the core functionality or the most difficult part first.",
        "Review and debug your code or content for errors.",
        "Finalize documentation and formatting.",
        "Do a final walkthrough and submission."
      ];
    } else if (title.includes('study') || title.includes('learn') || title.includes('exam')) {
      return [
        "Gather all necessary study materials and resources.",
        "Create a focused study environment without distractions.",
        "Review key concepts and take brief notes.",
        "Practice with sample questions or active recall.",
        "Summarize what you've learned for long-term retention."
      ];
    } else if (title.includes('email') || title.includes('call') || title.includes('meeting')) {
      return [
        "Prepare the main points or agenda you need to cover.",
        "Draft the content or script for your communication.",
        "Send the email or make the call/attend the meeting.",
        "Note down any follow-up actions or decisions made.",
        "Archive or check off the task as completed."
      ];
    } else {
      return [
        "Start with the first small step to build momentum.",
        "Set a timer for 25 minutes of focused work (Pomodoro).",
        "Avoid any multitasking during this focused session.",
        "Review your progress after the timer goes off.",
        "Complete the remaining parts and finalize the task."
      ];
    }
  };

  const getAIRecommendation = (tasks) => {
    const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
    
    if (pendingTasks.length === 0) return null;

    // AI Logic: Priority Score Calculation
    // 1. Overdue = +100 points
    // 2. High PostponeCount = +10 points per postpone
    // 3. Nearest Deadline = + (30 - days remaining) points
    
    const today = new Date();
    
    const scoredTasks = pendingTasks.map(task => {
      let score = 0;
      let reasons = [];
      
      const deadline = new Date(task.deadline);
      const diffTime = today - deadline; // Positive means overdue
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // 1. Overdue Logic (The longer overdue, the higher the score)
      if (diffDays > 0) {
        score += 100 + (diffDays * 2); // 100 base + 2 points per day overdue
        reasons.push(`It is ${diffDays} days overdue`);
      } else if (diffDays >= -2) {
        score += 50;
        reasons.push("The deadline is approaching very soon");
      }

      // 2. Priority Logic
      if (task.priority === 'High') {
        score += 40;
        reasons.push("It's a high priority task");
      } else if (task.priority === 'Medium') {
        score += 20;
      }

      // 3. Procrastination History
      if (task.postponeCount > 0) {
        score += (task.postponeCount * 15);
        reasons.push(`It has been postponed ${task.postponeCount} times`);
      }

      return { 
        ...task, 
        score, 
        aiReason: reasons.length > 0 
          ? reasons.join(" and ") + "." 
          : "This task needs your attention." 
      };
    });

    // Sort by score descending
    scoredTasks.sort((a, b) => b.score - a.score);
    const recommended = scoredTasks[0];
    
    return {
      task: recommended,
      reason: recommended.aiReason,
      steps: generateBreakdown(recommended)
    };
  };

  useEffect(() => {
    const fetchAndRecommend = async () => {
      try {
        setLoading(true);
        const res = await getTasks();
        setTasksExist(res.data.length > 0);
        const aiRec = getAIRecommendation(res.data);
        setRecommendation(aiRec);
      } catch (error) {
        console.error("AI Assistant error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRecommend();
    
    const handleTaskCreated = () => fetchAndRecommend();
    window.addEventListener('taskCreated', handleTaskCreated);
    return () => window.removeEventListener('taskCreated', handleTaskCreated);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">AI Assistant is analyzing your tasks...</p>
        </div>
      </div>
    );
  }

  if (!tasksExist) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border-purple-100 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-4 rounded-full">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Welcome to your AI Assistant!</h3>
        <p className="text-gray-500 mt-2 mb-6">Add tasks to your list, and I'll help you figure out what to do next.</p>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openTaskModal'));
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
        >
          Add Your First Task
        </button>
      </div>
    );
  }
  
  if (!recommendation) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Assistant</h3>
            <p className="text-purple-100 text-xs font-medium uppercase tracking-wider">Next Best Action</p>
          </div>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
          <span className="text-white text-xs font-bold">Recommended</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-600 uppercase tracking-widest">Recommended Task</span>
          </div>
          <h4 className="text-2xl font-black text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
            "{recommendation.task.title}"
          </h4>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-xl shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase mb-1 tracking-wider">AI Reason</p>
            <p className="text-amber-900 font-medium leading-relaxed">{recommendation.reason}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Actionable Steps</span>
          </div>
          <div className="grid gap-3">
            {recommendation.steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300 group/item shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 font-bold text-gray-400 group-hover/item:bg-indigo-600 group-hover/item:text-white group-hover/item:border-transparent transition-all">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors">
                  {step}
                </p>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-0 group-hover/item:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by ProcrastiScan AI Engine</p>
      </div>
    </div>
  );
}
