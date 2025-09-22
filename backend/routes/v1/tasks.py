import uuid
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import JSONResponse

from Security.token import get_current_user
from enums.task_status import TaskStatus
from config.database import get_db
from schemas.task import TaskCreate, TaskResponse, TaskUpdate
from crud import tasks as crud_task
from crud import auth as crud_auth

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"User {current_user.email} (id={current_user.id}) requested task list")
    try:
        tasks = await crud_task.get_tasks(db, current_user.id)
        logger.info(f"Returned {len(tasks)} tasks for user {current_user.email}")
        return tasks
    except Exception as e:
        logger.error(f"Failed to fetch tasks for user {current_user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"User {current_user.email} (id={current_user.id}) is creating a task: {task.title}")
    try:
        subscription = await crud_auth.get_user_with_subscription(db, current_user.id)

        # free tier restriction
        if subscription.tier == "free":
            task_count = await crud_task.count_user_tasks(db, current_user.id)
            if task_count >= 10:
                logger.warning(f"User {current_user.email} exceeded free tier task limit (10)")
                raise HTTPException(
                    status_code=403,
                    detail="Free tier users can only create up to 10 tasks"
                )

        new_task = await crud_task.create_task(db, current_user.id, task)
        logger.info(f"Task {new_task.id} created successfully for user {current_user.email}")
        return new_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create task for user {current_user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create task")


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    updates: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"User {current_user.email} updating task {task_id}")
    try:
        db_task = await crud_task.get_task(db, task_id, current_user.id)
        if not db_task:
            logger.warning(f"Task {task_id} not found for user {current_user.email}")
            raise HTTPException(status_code=404, detail="Task not found")

        updated_task = await crud_task.update_task(db, db_task, updates)
        logger.info(f"Task {task_id} updated successfully for user {current_user.email}")
        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update task {task_id} for user {current_user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update task")


@router.patch("/{task_id}/{status}", response_model=TaskResponse)
async def update_task_status(
    task_id: uuid.UUID,
    status: TaskStatus,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"User {current_user.email} updating task {task_id} status -> {status}")
    try:
        db_task = await crud_task.get_task(db, task_id, current_user.id)
        if not db_task:
            logger.warning(f"Task {task_id} not found for user {current_user.email}")
            raise HTTPException(status_code=404, detail="Task not found")

        updated_task = await crud_task.update_task_status(db, db_task, status)
        logger.info(f"Task {task_id} status updated to {status} for user {current_user.email}")
        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update status for task {task_id} (user {current_user.email}): {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update task status")


@router.delete("/{task_id}")
async def delete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(f"User {current_user.email} deleting task {task_id}")
    try:
        db_task = await crud_task.get_task(db, task_id, current_user.id)
        if not db_task:
            logger.warning(f"Task {task_id} not found for user {current_user.email}")
            raise HTTPException(status_code=404, detail="Task not found")

        await crud_task.delete_task(db, db_task)
        logger.info(f"Task {task_id} deleted successfully for user {current_user.email}")
        return JSONResponse(
            status_code=status.HTTP_204_NO_CONTENT,
            content=""
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete task {task_id} for user {current_user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete task")