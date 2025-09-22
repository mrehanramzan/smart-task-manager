import Navbar from "../components/layout/Navbar";
import CustomButton from "../components/ui/CustomButton";
import { MetricCard } from "../components/summary/MetricCard";
import { ProgressRing } from "../components/summary/ProgressRing";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  AlertCircle,
  RefreshCw,
  Crown,
} from "lucide-react";
import { get_monthly_summary } from "../apis/llm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MonthlySummary() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const navigate = useNavigate()
  // fetch data from backend
  useEffect(() => {
    user.subscription_tier==="free"?navigate("/dashboard"):null
    const fetchData = async () => {
      setLoading(true);
      try {
        const now = new Date();

        const res = await get_monthly_summary();
        if (!res.error) {
          setSummaryData(res);
        } else {
          setSummaryData(null);
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [currentMonth, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">
                Generating Your Monthly Summary
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Analyzing your productivity patterns...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96 text-gray-600">
          No summary data available.
        </div>
      </div>
    );
  }

  const { monthName, overview, categories } = summaryData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                {monthName} Summary
              </h1>
              <p className="mt-2 text-gray-600">
                AI-generated insights on your productivity and task completion
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  {overview.tasksCompleted} completed
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  {overview.totalTimeSpent}h tracked
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-purple-600" />
                  {overview.productivityScore}/100 score
                </span>
              </div>
            </div>

            {/* Premium upsell */}
            {user?.plan === "free" && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900 text-lg">
                      Premium Feature Preview
                    </div>
                    <p className="mt-2 text-blue-800">
                      Upgrade to Premium for full access to historical data,
                      custom reports, and PDF exports.
                    </p>
                  </div>
                  <CustomButton size="sm" className="ml-4 flex-shrink-0">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </CustomButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={CheckCircle}
            title="Tasks Completed"
            value={overview.tasksCompleted}
            subtitle={`of ${overview.tasksCreated} created`}
            color="green"
          />

          <MetricCard
            icon={Clock}
            title="Time Tracked"
            value={`${overview.totalTimeSpent}h`}
            subtitle="this month"
            color="purple"
          />

          <MetricCard
            icon={Target}
            title="Completion Rate"
            value={`${overview.completionRate}%`}
            subtitle="success rate"
            color="green"
          />

          <MetricCard
            icon={BarChart3}
            title="Productivity Score"
            value={overview.productivityScore}
            subtitle="overall rating"
            color="orange"
          />
        </div>

        {/* Completion Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Completion Rate
            </h3>
            <div className="flex flex-col items-center">
              <ProgressRing
                percentage={overview.completionRate}
                size={180}
                strokeWidth={14}
                color="#10B981"
              />
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {overview.tasksCompleted}
                  </span>{" "}
                  completed out of
                  <span className="font-semibold text-gray-900">
                    {" "}
                    {overview.tasksCreated}
                  </span>{" "}
                  tasks
                </p>
                <div className="pt-2 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>Streak: {overview.streakDays} days</span>
                  <span>•</span>
                  <span>Avg: {overview.avgTaskTime}h/task</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Time Distribution by Category
              </h3>
              <div className="text-sm text-gray-500">
                Total: {overview.totalTimeSpent}h
              </div>
            </div>

            <div className="space-y-5">
              {categories.map((category, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#3B82F6"
                              : index === 1
                              ? "#8B5CF6"
                              : "#10B981",
                        }}
                      />
                      <span className="font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-600">
                        {category.tasks} tasks
                      </span>
                      <span className="font-semibold text-gray-900">
                        {category.timeSpent}h
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor:
                            index === 0
                              ? "#3B82F6"
                              : index === 1
                              ? "#8B5CF6"
                              : "#10B981",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{category.percentage}% of total time</span>
                      <span>{category.completionRate}% completion rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {overview.totalTimeSpent}h
                  </div>
                  <div className="text-sm text-gray-600">Total Tracked</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {overview.avgTaskTime}h
                  </div>
                  <div className="text-sm text-gray-600">Avg per Task</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {overview.overdueTasks}
                  </div>
                  <div className="text-sm text-gray-600">Overdue Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}