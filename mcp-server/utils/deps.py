from sqlalchemy import text


def calculate_productivity_score(stats):
    """Calculate a productivity score based on various metrics"""
    completion_rate = float(stats.get('completion_rate', 0))
    avg_time = float(stats.get('avg_time_per_task_hours', 0))
    total_tasks = int(stats.get('total_tasks', 0))
    overdue_tasks = int(stats.get('overdue_tasks', 0))
    
    # Base score from completion rate (0-50 points)
    score = completion_rate * 0.5
    
    # Bonus for reasonable task times (0-20 points)
    if 1 <= avg_time <= 8:  # Reasonable task duration
        score += 20
    elif avg_time > 0:  # Some time tracking
        score += 10
    
    # Bonus for task volume (0-20 points)
    if total_tasks >= 20:
        score += 20
    elif total_tasks >= 10:
        score += 15
    elif total_tasks >= 5:
        score += 10
    
    # Penalty for overdue tasks (0-10 points deduction)
    if total_tasks > 0:
        overdue_ratio = overdue_tasks / total_tasks
        score -= overdue_ratio * 10
    
    return int(max(0, min(100, round(score))))


def calculate_completion_streak(analyzer, user_id, start_date, end_date):
    """Calculate the current completion streak for the month"""
    try:
        # Get daily completion data for the month
        query = text("""
            SELECT DATE(created_at) as task_date, 
                   COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
            FROM tasks 
            WHERE owner_id = :user_id 
            AND created_at >= :start_date 
            AND created_at < :end_date
            GROUP BY DATE(created_at)
            ORDER BY task_date DESC
        """)
        
        result = analyzer.db.execute(query, {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date
        }).fetchall()
        
        # Calculate streak of days with completed tasks
        streak = 0
        for row in result:
            if row.completed_count > 0:
                streak += 1
            else:
                break
                
        return streak
        
    except Exception as e:
        return 0