import { useState, useEffect } from "react";
import { PlayCircle, Plus, Filter, Search, Calendar, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import TaskCard from "../components/tasks/TaskCard";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import FilterPanel from "../components/tasks/FilterPanel";
import CustomButton from "../components/ui/CustomButton";
import Chatbot from "../components/ai/Chatbot";
import ChatbotTrigger from "../components/ai/ChatbotTrigger";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "created",
    sortOrder: "desc"
  });
  const [loading, setLoading] = useState(true);

  const mockUser = user || {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    plan: "free",
    tasksCount: 7,
    maxTasks: 10
  };

  // Mock tasks data
  useEffect(() => {
    setTimeout(() => {
      setTasks([
        {
          id: 1,
          title: "Complete project proposal",
          description: "Write and review the Q4 project proposal document for the upcoming client presentation",
          status: "todo",
          dueDate: "2025-09-25",
          timeSpent: 120,
          createdAt: "2025-09-20"
        },
        {
          id: 2,
          title: "Design system updates",
          description: "Update the design system components and documentation",
          status: "in-progress",
          dueDate: "2025-09-22",
          timeSpent: 240,
          createdAt: "2025-09-19"
        },
        {
          id: 3,
          title: "Code review",
          description: "Review team's pull requests and provide feedback",
          status: "completed",
          dueDate: "2025-09-21",
          timeSpent: 90,
          createdAt: "2025-09-18"
        },
        {
          id: 4,
          title: "Weekly team meeting",
          description: "Prepare agenda and conduct weekly standup meeting",
          status: "todo",
          dueDate: "2025-09-23",
          timeSpent: 30,
          createdAt: "2025-09-20"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
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
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filters]);

  const handleCreateTask = () => {
    if (mockUser.plan === "free" && tasks.length >= mockUser.maxTasks) {
      alert("You've reached the maximum number of tasks for free users. Upgrade to Premium for unlimited tasks!");
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getStatusStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "in-progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      totalTimeSpent: tasks.reduce((sum, task) => sum + task.timeSpent, 0)
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={mockUser} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
        isChatbotOpen ? 'lg:pr-104' : ''
      }`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your tasks and track your progress</p>
            </div>
            <CustomButton
              onClick={handleCreateTask}
              disabled={mockUser.plan === "free" && tasks.length >= mockUser.maxTasks}
              className="w-full lg:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </CustomButton>
          </div>

          {/* Plan Status */}
          {mockUser.plan === "free" && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-amber-800">
                      Free Plan: {tasks.length}/{mockUser.maxTasks} tasks used
                    </div>
                    {tasks.length >= mockUser.maxTasks && (
                      <p className="mt-1 text-sm text-amber-700">
                        You've reached your task limit. Upgrade to Premium for unlimited tasks!
                      </p>
                    )}
                  </div>
                </div>
                <CustomButton 
                  size="sm" 
                  variant="outline"
                  className="ml-4 flex-shrink-0"
                >
                  Upgrade to Premium
                </CustomButton>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Total Tasks", value: stats.total, color: "blue" },
            { icon: Circle, label: "To Do", value: stats.todo, color: "gray" },
            { icon: PlayCircle, label: "In Progress", value: stats.inProgress, color: "blue" },
            { icon: CheckCircle, label: "Completed", value: stats.completed, color: "green" },
            { icon: Clock, label: "Time Spent", value: `${Math.floor(stats.totalTimeSpent / 60)}h`, color: "purple" }
          ].map((stat, index) => {
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              gray: "bg-gray-100 text-gray-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600"
            };
            
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <FilterPanel 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {tasks.length === 0 
                ? "Get started by creating your first task."
                : "Try adjusting your search or filters."
              }
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
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chatbot Trigger Button */}
      <ChatbotTrigger
        onClick={() => setIsChatbotOpen(true)}
        hasUnreadMessages={false}
      />

      {/* Chatbot Sidebar */}
      <Chatbot
        user={mockUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTask={(newTask) => {
            setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}