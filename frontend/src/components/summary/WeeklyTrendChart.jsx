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
export function WeeklyTrendChart({ data }) {

    const maxValue = Math.max(...data.map(week => Math.max(week.completed, week.created)));
  
    return (
      <div className="space-y-6">
        {data.map((week, index) => {
          const completionRate = Math.round((week.completed / week.created) * 100);
          const completedHeight = (week.completed / maxValue) * 100;
          const createdHeight = (week.created / maxValue) * 100;
  
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-700">{week.week}</div>
              
              <div className="flex-1 flex items-end space-x-2 h-12">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all duration-1000 ease-out"
                    style={{ height: `${createdHeight}%`, minHeight: '4px' }}
                  />
                  <div className="text-xs text-gray-600 mt-1">{week.created}</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-green-500 rounded-t transition-all duration-1000 ease-out"
                    style={{ height: `${completedHeight}%`, minHeight: '4px' }}
                  />
                  <div className="text-xs text-gray-600 mt-1">{week.completed}</div>
                </div>
              </div>
              
              <div className="w-16 text-right">
                <div className="text-sm font-semibold text-gray-900">{completionRate}%</div>
                <div className="text-xs text-gray-500">rate</div>
              </div>
            </div>
          );
        })}
        
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600 pt-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            Created Tasks
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            Completed Tasks
          </div>
        </div>
      </div>
    );
  }