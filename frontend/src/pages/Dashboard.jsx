import { useState, useEffect, useContext } from "react";
import { PlayCircle, Plus, Filter, Search, Calendar, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import FilterPanel from "../components/tasks/FilterPanel";
import CustomButton from "../components/ui/CustomButton";
import Chatbot from "../components/ai/Chatbot";
import ChatbotTrigger from "../components/ai/ChatbotTrigger";

import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from "../apis/task";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all", sortBy: "created", sortOrder: "desc" });
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    const res = await getTasks();
    if (!res.error) {
      const updatedTasks = res.map(task => {
        let timeSpent = 0;
        const start = task.start_at ? new Date(task.start_at) : null;
        const end = task.end_at ? new Date(task.end_at) : null;
        if (start && end) {
          timeSpent = Math.floor((end - start) / 60000); // in minutes
        } else if (start) {
          timeSpent = Math.floor((new Date() - start) / 60000);
        }
        return { ...task, timeSpent };
      });
      setTasks(updatedTasks);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case "dueDate":
          aValue = new Date(a.due_date);
          bValue = new Date(b.due_date);
          break;
        case "timeSpent":
          aValue = a.timeSpent;
          bValue = b.timeSpent;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      return filters.sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filters]);

  const handleCreateTask = () => {
    if (user.subscription_tier === "free" && tasks.length >= 10) {
      alert("You've reached the maximum number of tasks for free users. Upgrade to Premium for unlimited tasks!");
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateTaskSubmit = async (newTask) => {
    const res = await createTask(newTask);
    if (!res.error) {
      let timeSpent = 0;
      if (res.start_at && res.end_at) {
        timeSpent = Math.floor((new Date(res.end_at) - new Date(res.start_at)) / 60000);
      } else if (res.start_at) {
        timeSpent = Math.floor((new Date() - new Date(res.start_at)) / 60000);
      }
      setTasks(prev => [...prev, { ...res, timeSpent }]);
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    const res = await updateTask(taskId, updates);
    if (!res.error) {
      let timeSpent = 0;
      if (res.start_at && res.end_at) {
        timeSpent = Math.floor((new Date(res.end_at) - new Date(res.start_at)) / 60000);
      } else if (res.start_at) {
        timeSpent = Math.floor((new Date() - new Date(res.start_at)) / 60000);
      }
      setTasks(prev => prev.map(task => task.id === taskId ? { ...res, timeSpent } : task));
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    const res = await updateTaskStatus(taskId, status);
    if (!res.error) {
      let timeSpent = 0;
      if (res.start_at && res.end_at) {
        timeSpent = Math.floor((new Date(res.end_at) - new Date(res.start_at)) / 60000);
      } else if (res.start_at) {
        timeSpent = Math.floor((new Date() - new Date(res.start_at)) / 60000);
      }
      setTasks(prev => prev.map(task => task.id === taskId ? { ...res, timeSpent } : task));
    } else {
      alert("Failed to update task: " + res.error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const res = await deleteTask(taskId);
    if (!res.error) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${isChatbotOpen ? 'lg:pr-104' : ''}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your tasks and track your progress</p>
            </div>
            <CustomButton
              onClick={handleCreateTask}
              disabled={user.subscription_tier === "free" && tasks.length >= 10}
              className="w-full lg:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </CustomButton>
          </div>

          {/* Plan Status */}
          {user.subscription_tier === "free" && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-amber-800">
                      Free Plan: {tasks.length}/10 tasks used
                    </div>
                    {tasks.length >= 10 && (
                      <p className="mt-1 text-sm text-amber-700">
                        You've reached your task limit. Upgrade to Premium for unlimited tasks!
                      </p>
                    )}
                  </div>
                </div>
                <CustomButton size="sm" variant="outline" className="ml-4 flex-shrink-0">
                  Upgrade to Premium
                </CustomButton>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomButton
              variant="outline"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex-shrink-0 ${isFilterPanelOpen ? 'bg-gray-50' : ''}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CustomButton>
          </div>

          {isFilterPanelOpen && (
            <div className="pt-4 border-t border-gray-200">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {tasks.length === 0 ? "Get started by creating your first task." : "Try adjusting your search or filters."}
            </p>
            {tasks.length === 0 && (
              <CustomButton onClick={handleCreateTask}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Task
              </CustomButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onUpdateStatus={handleUpdateTaskStatus} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}
      </div>

      {user?.subscription_tier === "premium" ? (
        <>
          <ChatbotTrigger
            onClick={() => setIsChatbotOpen(true)}
            hasUnreadMessages={false}
          />
          <Chatbot
            user={user}
            isOpen={isChatbotOpen}
            onClose={() => setIsChatbotOpen(false)}
          />
        </>
      ) : null}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTask={handleCreateTaskSubmit}
        />
      )}
    </div>
  );
}