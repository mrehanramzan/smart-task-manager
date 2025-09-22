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

from utils.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



class TaskAnalyzer:
    def __init__(self):
        self.db = SessionLocal()
    
    def get_user_tasks(self, user_id: str, days_back: int = 30) -> List[Dict]:
        """Fetch user tasks from the database"""
        logger.info(f"User id inside get user tasks {user_id}")
        try:
            query = text("""
                SELECT 
                    id, title, description, status, 
                    created_at, updated_at, due_date,
                    start_at, end_at, owner_id
                FROM tasks 
                WHERE owner_id = :owner_id 
                AND created_at >= :date_filter
                ORDER BY created_at DESC
            """)
            
            date_filter = datetime.now() - timedelta(days=days_back)
            result = self.db.execute(query, {
                "owner_id": user_id, 
                "date_filter": date_filter
            })
            
            tasks = []
            for row in result:
                # Calculate time spent if start_at and end_at exist
                time_spent_hours = 0
                if row.start_at and row.end_at:
                    time_spent_hours = (row.end_at - row.start_at).total_seconds() / 3600
                
                tasks.append({
                    "id": str(row.id),
                    "title": row.title,
                    "description": row.description,
                    "status": row.status.value if hasattr(row.status, 'value') else str(row.status),
                    "created_at": row.created_at.isoformat() if row.created_at else None,
                    "updated_at": row.updated_at.isoformat() if row.updated_at else None,
                    "due_date": row.due_date.isoformat() if row.due_date else None,
                    "start_at": row.start_at.isoformat() if row.start_at else None,
                    "end_at": row.end_at.isoformat() if row.end_at else None,
                    "time_spent_hours": round(time_spent_hours, 2),
                    "owner_id": str(row.owner_id)
                })
            
            return tasks
        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            return []
        finally:
            self.db.close()

    def get_task_statistics(self, user_id: str, days_back: int = 30) -> Dict:
        """Get comprehensive task statistics for the user"""
        try:
            query = text("""
                SELECT 
                    COUNT(*) as total_tasks,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                    COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
                    COUNT(CASE WHEN due_date < NOW() AND status != 'completed' THEN 1 END) as overdue_tasks,
                    -- Calculate time spent from start_at and end_at
                    SUM(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE 0 
                        END
                    ) as total_time_spent_hours,
                    AVG(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE NULL 
                        END
                    ) as avg_time_per_task_hours
                FROM tasks 
                WHERE owner_id = :owner_id 
                AND created_at >= :date_filter
            """)
            
            date_filter = datetime.now() - timedelta(days=days_back)
            result = self.db.execute(query, {
                "owner_id": user_id, 
                "date_filter": date_filter
            }).fetchone()
            
            total_tasks = result.total_tasks or 0
            completed_tasks = result.completed_tasks or 0
            
            return {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "in_progress_tasks": result.in_progress_tasks or 0,
                "todo_tasks": result.todo_tasks or 0,
                "overdue_tasks": result.overdue_tasks or 0,
                "total_time_spent_hours": round(float(result.total_time_spent_hours or 0), 2),
                "avg_time_per_task_hours": round(float(result.avg_time_per_task_hours or 0), 2),
                "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
            }
        except Exception as e:
            logger.error(f"Error fetching statistics: {e}")
            return {}
        finally:
            self.db.close()


    def get_monthly_task_statistics(self, user_id: str, start_date: datetime, end_date: datetime) -> Dict:
        """Get comprehensive task statistics for a specific month"""
        try:
            query = text("""
                SELECT 
                    COUNT(*) as total_tasks,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                    COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
                    COUNT(CASE WHEN due_date < :end_date AND status != 'completed' THEN 1 END) as overdue_tasks,
                    -- Calculate time spent from start_at and end_at
                    COALESCE(SUM(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE 0 
                        END
                    ), 0) as total_time_spent_hours,
                    COALESCE(AVG(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE NULL 
                        END
                    ), 0) as avg_time_per_task_hours
                FROM tasks 
                WHERE owner_id = :owner_id 
                AND created_at >= :start_date 
                AND created_at < :end_date
            """)
            
            result = self.db.execute(query, {
                "owner_id": user_id,
                "start_date": start_date,
                "end_date": end_date
            }).fetchone()
            
            total_tasks = result.total_tasks or 0
            completed_tasks = result.completed_tasks or 0
            
            return {
                "total_tasks": int(total_tasks),
                "completed_tasks": int(completed_tasks),
                "in_progress_tasks": int(result.in_progress_tasks or 0),
                "todo_tasks": int(result.todo_tasks or 0),
                "overdue_tasks": int(result.overdue_tasks or 0),
                "total_time_spent_hours": round(float(result.total_time_spent_hours or 0), 2),
                "avg_time_per_task_hours": round(float(result.avg_time_per_task_hours or 0), 2),
                "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
            }
        except Exception as e:
            logger.error(f"Error fetching monthly statistics: {e}")
            return {
                "total_tasks": 0,
                "completed_tasks": 0,
                "in_progress_tasks": 0,
                "todo_tasks": 0,
                "overdue_tasks": 0,
                "total_time_spent_hours": 0,
                "avg_time_per_task_hours": 0,
                "completion_rate": 0
            }

    def get_monthly_category_breakdown(self, user_id: str, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Get task breakdown by category for a specific month"""
        try:
            # Since you don't have a category column, we'll create categories based on task patterns
            # You can modify this logic based on your actual categorization method
            query = text("""
                WITH task_categories AS (
                    SELECT 
                        *,
                        CASE 
                            WHEN LOWER(title) LIKE '%dev%' OR LOWER(title) LIKE '%code%' 
                                 OR LOWER(title) LIKE '%program%' OR LOWER(title) LIKE '%bug%'
                                 OR LOWER(description) LIKE '%dev%' OR LOWER(description) LIKE '%code%' 
                            THEN 'Development'
                            WHEN LOWER(title) LIKE '%design%' OR LOWER(title) LIKE '%ui%' 
                                 OR LOWER(title) LIKE '%ux%' OR LOWER(title) LIKE '%mockup%'
                                 OR LOWER(description) LIKE '%design%' 
                            THEN 'Design'
                            WHEN LOWER(title) LIKE '%meet%' OR LOWER(title) LIKE '%call%' 
                                 OR LOWER(title) LIKE '%discuss%' OR LOWER(title) LIKE '%review%'
                                 OR LOWER(description) LIKE '%meet%'
                            THEN 'Meetings'
                            WHEN LOWER(title) LIKE '%plan%' OR LOWER(title) LIKE '%research%' 
                                 OR LOWER(title) LIKE '%analyze%' OR LOWER(title) LIKE '%document%'
                                 OR LOWER(description) LIKE '%plan%'
                            THEN 'Planning'
                            ELSE 'Other'
                        END as category
                    FROM tasks 
                    WHERE owner_id = :owner_id 
                    AND created_at >= :start_date 
                    AND created_at < :end_date
                )
                SELECT 
                    category,
                    COUNT(*) as task_count,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
                    COALESCE(SUM(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE 0 
                        END
                    ), 0) as time_spent_hours,
                    COALESCE(AVG(
                        CASE 
                            WHEN start_at IS NOT NULL AND end_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (end_at - start_at)) / 3600.0
                            ELSE NULL 
                        END
                    ), 0) as avg_time_hours
                FROM task_categories
                GROUP BY category
                ORDER BY time_spent_hours DESC
            """)
            
            result = self.db.execute(query, {
                "owner_id": user_id,
                "start_date": start_date,
                "end_date": end_date
            }).fetchall()
            
            # Calculate total time for percentage calculation
            total_time = sum(float(row.time_spent_hours or 0) for row in result)
            
            categories = []
            for row in result:
                if row.task_count > 0:  # Only include categories with tasks
                    completion_rate = round((float(row.completed_count) / float(row.task_count) * 100), 1) if row.task_count > 0 else 0
                    percentage = round((float(row.time_spent_hours or 0) / total_time * 100), 1) if total_time > 0 else 0
                    
                    categories.append({
                        "name": row.category,
                        "timeSpent": round(float(row.time_spent_hours or 0), 1),
                        "tasks": int(row.task_count),
                        "percentage": percentage,
                        "avgTime": round(float(row.avg_time_hours or 0), 2),
                        "completionRate": completion_rate
                    })
            
            return categories
            
        except Exception as e:
            logger.error(f"Error fetching category breakdown: {e}")
            return []