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
export function ProgressRing({ percentage, size = 120, strokeWidth = 8, color = "#3B82F6", children }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="relative inline-block">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children || <span className="text-2xl font-bold text-gray-900">{percentage}%</span>}
        </div>
      </div>
    );
  }