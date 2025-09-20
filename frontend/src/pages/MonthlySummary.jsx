import Navbar from "../components/layout/Navbar";
import CustomButton from "../components/ui/CustomButton";
import { MetricCard } from "../components/summary/MetricCard";
import { ProgressRing } from "../components/summary/ProgressRing";
import { WeeklyTrendChart } from "../components/summary/WeeklyTrendChart";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertCircle,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Crown,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Activity,
  Users,
  FileText,
  Zap,
  Coffee,
  Brain,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
export default function MonthlySummary({ user }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  
    const mockUser = user || {
      name: "John Doe",
      email: "john@example.com",
      plan: "premium"
    };
  
    // Generate comprehensive mock data
    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        const monthData = generateCompleteMockData(currentMonth);
        setSummaryData(monthData);
        setLoading(false);
      }, 1200);
    }, [currentMonth, selectedTimeframe]);
  
    const generateCompleteMockData = (date) => {
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const isCurrentMonth = date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
      
      return {
        monthName,
        isCurrentMonth,
        overview: {
          tasksCreated: isCurrentMonth ? 28 : 32,
          tasksCompleted: isCurrentMonth ? 22 : 26,
          totalTimeSpent: isCurrentMonth ? 156 : 178,
          completionRate: isCurrentMonth ? 79 : 81,
          productivityScore: isCurrentMonth ? 85 : 88,
          avgTaskTime: isCurrentMonth ? 6.2 : 5.8,
          overdueTasks: isCurrentMonth ? 3 : 2,
          streakDays: isCurrentMonth ? 12 : 18
        },
        categories: [
          { 
            name: "Development", 
            timeSpent: isCurrentMonth ? 68 : 78, 
            tasks: isCurrentMonth ? 9 : 11, 
            percentage: 44,
            avgTime: 7.6,
            completionRate: 89
          },
          { 
            name: "Design", 
            timeSpent: isCurrentMonth ? 42 : 48, 
            tasks: isCurrentMonth ? 6 : 7, 
            percentage: 27,
            avgTime: 6.9,
            completionRate: 83
          },
          { 
            name: "Meetings", 
            timeSpent: isCurrentMonth ? 28 : 32, 
            tasks: isCurrentMonth ? 4 : 5, 
            percentage: 18,
            avgTime: 7.0,
            completionRate: 100
          },
          { 
            name: "Planning", 
            timeSpent: isCurrentMonth ? 18 : 20, 
            tasks: isCurrentMonth ? 3 : 4, 
            percentage: 11,
            avgTime: 5.0,
            completionRate: 75
          }
        ],
        weeklyTrends: isCurrentMonth ? [
          { week: "Week 1", completed: 6, created: 8, efficiency: 92 },
          { week: "Week 2", completed: 5, created: 7, efficiency: 88 },
          { week: "Week 3", completed: 7, created: 6, efficiency: 95 },
          { week: "Week 4", completed: 4, created: 7, efficiency: 76 }
        ] : [
          { week: "Week 1", completed: 7, created: 8, efficiency: 94 },
          { week: "Week 2", completed: 6, created: 8, efficiency: 90 },
          { week: "Week 3", completed: 8, created: 8, efficiency: 98 },
          { week: "Week 4", completed: 5, created: 8, efficiency: 82 }
        ],        insights: [
          {
            type: "positive",
            title: "Productivity Boost",
            description: `Your completion rate increased by ${isCurrentMonth ? 12 : 15}% compared to last month! You're consistently meeting your daily goals.`,
            impact: "high"
          },
          {
            type: "neutral",
            title: "Peak Performance Pattern",
            description: "You're most productive between 9 AM - 11 AM and Tuesday-Thursday. Consider scheduling complex tasks during these periods.",
            impact: "medium"
          },
          {
            type: "warning",
            title: "Long Task Alert",
            description: `You have ${isCurrentMonth ? 3 : 2} tasks that took longer than 8 hours. Breaking them into smaller chunks could improve completion rates.`,
            impact: "medium"
          },
          {
            type: "positive",
            title: "Consistency Achievement",
            description: `You maintained a ${isCurrentMonth ? 12 : 18}-day streak of daily task completion. Keep up the excellent habit!`,
            impact: "high"
          }
        ]      };
    };
  
    const navigateMonth = (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(currentMonth.getMonth() + direction);
      
      // Limit to last 3 months for more data
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 2);
      
      if (newMonth <= now && newMonth >= threeMonthsAgo) {
        setCurrentMonth(newMonth);
      }
    };
  
    const canNavigateNext = () => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(currentMonth.getMonth() + 1);
      return nextMonth <= new Date();
    };
  
    const canNavigatePrev = () => {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(currentMonth.getMonth() - 1);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(new Date().getMonth() - 2);
      return prevMonth >= threeMonthsAgo;
    };
  
  
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Navbar user={mockUser} />
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">Generating Your Monthly Summary</div>
                <div className="text-sm text-gray-600 mt-1">Analyzing your productivity patterns...</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={mockUser} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                  Monthly Summary
                </h1>
                <p className="mt-2 text-gray-600">AI-generated insights on your productivity and task completion patterns</p>
                
                {/* Quick Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    {summaryData?.overview.tasksCompleted} completed
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-600" />
                    {summaryData?.overview.totalTimeSpent}h tracked
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-purple-600" />
                    {summaryData?.overview.productivityScore}/100 score
                  </span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Month Navigation */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 min-w-[160px] justify-center">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{summaryData?.monthName}</span>
                  </div>
                  
                </div>
                
              </div>
            </div>
  
            {/* Premium Feature Notice for Free Users */}
            {mockUser.plan === "free" && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900 text-lg">
                      Premium Feature Preview
                    </div>
                    <p className="mt-2 text-blue-800">
                      You're viewing a preview of Monthly Summary. Upgrade to Premium for full access to detailed analytics, 
                      historical data, custom reports, and PDF exports.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ✨ AI Insights
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📊 Advanced Analytics
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📈 Trend Analysis
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🏆 Achievement Tracking
                      </span>
                    </div>
                  </div>
                  <CustomButton size="sm" className="ml-4 flex-shrink-0">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </CustomButton>
                </div>
              </div>
            )}
          </div>
  
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={CheckCircle}
              title="Tasks Completed"
              value={summaryData?.overview.tasksCompleted}
              subtitle={`of ${summaryData?.overview.tasksCreated} created`}
              trend="+12%"
              trendDirection="up"
              color="green"
            />
            
            <MetricCard
              icon={Clock}
              title="Time Tracked"
              value={`${summaryData?.overview.totalTimeSpent}h`}
              subtitle="this month"
              trend="+8%"
              trendDirection="up"
              color="purple"
            />
            
            <MetricCard
              icon={Target}
              title="Completion Rate"
              value={`${summaryData?.overview.completionRate}%`}
              subtitle="success rate"
              trend="+5%"
              trendDirection="up"
              color="green"
            />
            
            <MetricCard
              icon={BarChart3}
              title="Productivity Score"
              value={summaryData?.overview.productivityScore}
              subtitle="overall rating"
              trend="+3pts"
              trendDirection="up"
              color="orange"
            />
          </div>
  
          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Completion Rate Visualization */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Completion Rate</h3>
              <div className="flex flex-col items-center">
                <ProgressRing 
                  percentage={summaryData?.overview.completionRate || 0}
                  size={180}
                  strokeWidth={14}
                  color="#10B981"
                />
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{summaryData?.overview.tasksCompleted}</span> completed out of 
                    <span className="font-semibold text-gray-900"> {summaryData?.overview.tasksCreated}</span> tasks
                  </p>
                  <div className="flex items-center justify-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">12% improvement from last month</span>
                  </div>
                  <div className="pt-2 flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Streak: {summaryData?.overview.streakDays} days</span>
                    <span>•</span>
                    <span>Avg: {summaryData?.overview.avgTaskTime}h/task</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Time Distribution */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Time Distribution by Category</h3>
                <div className="text-sm text-gray-500">Total: {summaryData?.overview.totalTimeSpent}h</div>
              </div>
              
              <div className="space-y-5">
                {summaryData?.categories.map((category, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-3" style={{
                          backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : index === 2 ? '#10B981' : '#F59E0B'
                        }}></div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-600">{category.tasks} tasks</span>
                        <span className="font-semibold text-gray-900">{category.timeSpent}h</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : index === 2 ? '#10B981' : '#F59E0B'
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
                    <div className="text-lg font-bold text-gray-900">{summaryData?.overview.totalTimeSpent}h</div>
                    <div className="text-sm text-gray-600">Total Tracked</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{summaryData?.overview.avgTaskTime}h</div>
                    <div className="text-sm text-gray-600">Avg per Task</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{summaryData?.overview.overdueTasks}</div>
                    <div className="text-sm text-gray-600">Overdue Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Weekly Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Performance Trends</h3>
              <div className="text-sm text-gray-500">Tasks Created vs Completed</div>
            </div>
            <WeeklyTrendChart data={summaryData?.weeklyTrends || []} />
          </div>
  
          {/* AI Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI-Generated Insights
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {summaryData?.insights.map((insight, index) => {
                const bgColor = insight.type === 'positive' ? 'bg-green-50 border-green-200' : 
                               insight.type === 'warning' ? 'bg-amber-50 border-amber-200' : 
                               'bg-blue-50 border-blue-200';
                const iconColor = insight.type === 'positive' ? 'text-green-600' : 
                                 insight.type === 'warning' ? 'text-amber-600' : 
                                 'text-blue-600';
                const icon = insight.type === 'positive' ? TrendingUp : 
                            insight.type === 'warning' ? AlertCircle : 
                            Activity;
                const IconComponent = icon;
                
                return (
                  <div key={index} className={`p-5 rounded-lg border ${bgColor} relative overflow-hidden`}>
                    <div className="flex items-start">
                      <IconComponent className={`h-5 w-5 mr-3 mt-0.5 ${iconColor} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
          {/* Recommendations */}
          {/* Action Items */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              Recommended Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  <span className="text-sm font-medium text-gray-900">Schedule tasks during peak hours (9-11 AM)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  <span className="text-sm font-medium text-gray-900">Break down tasks longer than 6 hours</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  <span className="text-sm font-medium text-gray-900">Implement 15-minute daily planning sessions</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  <span className="text-sm font-medium text-gray-900">Set up weekly review sessions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  <span className="text-sm font-medium text-gray-900">Focus on Tuesday-Thursday for important tasks</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  <span className="text-sm font-medium text-gray-900">Maintain daily task completion streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }