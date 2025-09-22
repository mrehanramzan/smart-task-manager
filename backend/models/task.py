import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, Text, Enum, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID


from config.database import Base
from enums.task_status import TaskStatus

class Task(Base):
    __tablename__ = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus, name="task_status"), nullable=False, default=TaskStatus.todo)
    due_date = Column(DateTime(timezone=True), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    start_at = Column(DateTime(timezone=True), nullable=True)
    end_at = Column(DateTime(timezone=True), nullable=True)
 