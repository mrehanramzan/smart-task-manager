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
export function MetricCard({ icon: Icon, title, value, subtitle, trend, trendDirection, color = "blue" }) {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600"
    };
  
    const TrendIcon = trendDirection === 'up' ? ArrowUp : trendDirection === 'down' ? ArrowDown : Minus;
    const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600';
  
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          {trend && (
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  