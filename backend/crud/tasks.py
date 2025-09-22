import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from models.task import Task
from enums.task_status import TaskStatus
from schemas.task import TaskCreate, TaskUpdate

async def get_tasks(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(Task).filter(Task.owner_id == user_id))
    tasks = result.scalars().all()
    return tasks


# Get task via task id
async def get_task(db: AsyncSession, task_id: uuid.UUID, user_id: uuid.UUID):
    result = await db.execute(
        select(Task).filter(Task.id == task_id, Task.owner_id == user_id)
    )
    return result.scalars().first()


# Create a new task
async def create_task(db: AsyncSession, user_id: uuid.UUID, task: TaskCreate):
    new_task = Task(
        id=uuid.uuid4(),
        owner_id=user_id,
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        status=TaskStatus.todo,
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


async def update_task_status(db: AsyncSession, db_task: Task, status: TaskStatus):
    now = datetime.utcnow()

    # If task moves to "in_progress" → set start_at if not already set
    if status == TaskStatus.in_progress and not db_task.start_at:
        db_task.start_at = now

    # If task moves to "completed" → set end_at
    if status == TaskStatus.completed and not db_task.end_at:
        db_task.end_at = now

    db_task.status = status
    await db.commit()
    await db.refresh(db_task)
    return db_task


# Delete task 
async def delete_task(db: AsyncSession, db_task: Task):
    await db.delete(db_task)
    await db.commit()

# Count total task a user have
async def count_user_tasks(db: AsyncSession, user_id: uuid.UUID) -> int:
    result = await db.execute(select(Task).filter(Task.owner_id == user_id))
    return len(result.scalars().all())

# Update task fully
async def update_task(
    db: AsyncSession, 
    db_task: Task, 
    updates: TaskUpdate): 
    for key, value in updates.dict(exclude_unset=True).items(): 
        setattr(db_task, key, value) 
    await db.commit() 
    await db.refresh(db_task) 
    return db_task