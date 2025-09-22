import os
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import logging
from mcp.server.fastmcp import FastMCP
import google.generativeai as genai
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import httpx

from utils.api import settings
from utils.insights import TaskAnalyzer
from utils.database import engine
from utils.deps import calculate_completion_streak, calculate_productivity_score

# Initialize FastMCP server
mcp = FastMCP(name="Smart Task Manager AI",host="0.0.0.0", port=8000)
logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash-exp')



@mcp.tool()
def query_task_data(user_id: str, query: str) -> str:
    """
    Answer natural language questions about user's task data using AI.
    
    Args:
        user_id: The ID of the user making the query
        query: Natural language question about tasks
    
    Returns:
        AI-generated answer based on user's task data
    """
    logger.info(f"User id for tasks {user_id}")
    try:
        analyzer = TaskAnalyzer()
        
        # Get comprehensive task data
        tasks = analyzer.get_user_tasks(user_id, 60) 
        stats = analyzer.get_task_statistics(user_id, 60)
        
        if not tasks:
            return "You don't have any tasks yet. Create some tasks to start getting insights!"
        
        context = f"""
        User's Task Data (Last 60 Days):
        
        Statistics: {json.dumps(stats, indent=2)}
        
        Tasks: {json.dumps(tasks, indent=2)}
        
        User Question: "{query}"
        
        Please answer the user's question based on their actual task data. Be specific, use numbers from the data, and provide actionable insights. If the question cannot be answered from the available data, explain what's missing.
        """
        
        if settings.GEMINI_API_KEY:
            response = model.generate_content(context)
            return response.text
        else:
            query_lower = query.lower()
            
            if "time" in query_lower and "spent" in query_lower:
                total_time = stats.get('total_time_spent', 0)
                return f"You've spent a total of {total_time} minutes ({total_time/60:.1f} hours) on tasks in the last 90 days."
            
            elif "overdue" in query_lower:
                overdue = stats.get('overdue_tasks', 0)
                return f"You have {overdue} overdue tasks that need attention."
            
            elif "completion" in query_lower or "completed" in query_lower:
                completed = stats.get('completed_tasks', 0)
                rate = stats.get('completion_rate', 0)
                return f"You've completed {completed} tasks with a {rate:.1f}% completion rate."
            
            else:
                return f"Based on your task data: You have {stats.get('total_tasks', 0)} total tasks, {stats.get('completed_tasks', 0)} completed, and {stats.get('in_progress_tasks', 0)} in progress."
    except Exception as e:
        logger.error(f"Error querying task data: {e}")

        return f"Sorry, I couldn't process your query. Error: {str(e)}"



@mcp.tool()
def get_monthly_summary(user_id: str, month_offset: int = 0) -> str:
    """
    Get comprehensive monthly summary data for the user's tasks.
    
    Args:
        user_id: The ID of the user requesting the summary
        month_offset: Number of months back from current month (0 = current month, 1 = last month, etc.)
    
    Returns:
        JSON string containing complete monthly summary data
    """
    logger.info(f"Generating monthly summary for user {user_id}, month_offset: {month_offset}")
    
    try:
        analyzer = TaskAnalyzer()
        
        # Calculate date range for the requested month
        now = datetime.now()
        target_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Go back to the requested month
        for _ in range(month_offset):
            if target_month.month == 1:
                target_month = target_month.replace(year=target_month.year - 1, month=12)
            else:
                target_month = target_month.replace(month=target_month.month - 1)
        
        # Calculate next month for date filtering
        if target_month.month == 12:
            next_month = target_month.replace(year=target_month.year + 1, month=1)
        else:
            next_month = target_month.replace(month=target_month.month + 1)
        
        month_name = target_month.strftime("%B %Y")
        is_current_month = target_month.month == now.month and target_month.year == now.year
        
        # Get tasks for the specific month
        monthly_stats = analyzer.get_monthly_task_statistics(user_id, target_month, next_month)
        category_data = analyzer.get_monthly_category_breakdown(user_id, target_month, next_month)
        
        # Calculate productivity metrics
        productivity_score = calculate_productivity_score(monthly_stats)
        
        # Structure data as expected by frontend
        summary_data = {
            "monthName": month_name,
            "isCurrentMonth": is_current_month,
            "overview": {
                "tasksCreated": int(monthly_stats.get('total_tasks', 0)),
                "tasksCompleted": int(monthly_stats.get('completed_tasks', 0)),
                "totalTimeSpent": int(round(float(monthly_stats.get('total_time_spent_hours', 0)))),
                "completionRate": float(monthly_stats.get('completion_rate', 0)),
                "productivityScore": int(productivity_score),
                "avgTaskTime": round(float(monthly_stats.get('avg_time_per_task_hours', 0)), 1),
                "overdueTasks": int(monthly_stats.get('overdue_tasks', 0)),
                "streakDays": int(calculate_completion_streak(analyzer, user_id, target_month, next_month))
            },
            "categories": category_data
        }
        
        return json.dumps(summary_data, indent=2)
        
    except Exception as e:
        logger.error(f"Error generating monthly summary: {e}")
        return json.dumps({
            "error": f"Failed to generate monthly summary: {str(e)}",
            "monthName": "Unknown",
            "isCurrentMonth": False,
            "overview": {
                "tasksCreated": 0,
                "tasksCompleted": 0,
                "totalTimeSpent": 0,
                "completionRate": 0,
                "productivityScore": 0,
                "avgTaskTime": 0,
                "overdueTasks": 0,
                "streakDays": 0
            },
            "categories": []
        })

