from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from enums.task_status import TaskStatus

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    status: TaskStatus
    created_at: datetime
    start_at: Optional[datetime]
    end_at: Optional[datetime]

    class Config:
        from_attributes = True