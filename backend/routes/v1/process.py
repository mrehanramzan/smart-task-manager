import logging
from fastapi import APIRouter, Depends, HTTPException
import json

from config.api import settings
from utils.sse_client import call_mcp_tool
from Security.token import get_current_user, premium_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/query")
async def query_tasks(
    query: str,
    current_user=Depends(premium_user)
):
    """Natural language query about user tasks"""
    logger.info(f"User {current_user.email} (id={current_user.id}) submitted query: {query}")

    try:
        result = await call_mcp_tool("query_task_data", {
            "user_id": current_user.id,
            "query": query
        })
        logger.info(f"Query executed successfully for user {current_user.email} (id={current_user.id})")
        return {"success": "True", "data": result}
    except Exception as e:
        logger.error(
            f"Failed to execute query for user {current_user.email} (id={current_user.id}): {str(e)}",
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to process query")


@router.get("/monthly_summary")
async def monthly_summary(
    current_user=Depends(premium_user),
    month_offset: int = 0
):
    """Get monthly summary for tasks"""
    logger.info(f"User {current_user.email} (id={current_user.id}) requested monthly summary (offset={month_offset})")

    try:
        result = await call_mcp_tool("get_monthly_summary", {
            "user_id": current_user.id,
            "month_offset": month_offset
        })

        if isinstance(result, dict):
            logger.info(f"Monthly summary (offset={month_offset}) returned successfully for user {current_user.email}")
            return result
        else:
            try:
                parsed_result = json.loads(result)
                logger.info(f"Monthly summary parsed successfully for user {current_user.email}")
                return parsed_result
            except Exception as parse_err:
                logger.warning(
                    f"Failed to parse monthly summary JSON for user {current_user.email}: {str(parse_err)}"
                )
                return {"data": result}
    except Exception as e:
        logger.error(
            f"Failed to fetch monthly summary for user {current_user.email} (id={current_user.id}): {str(e)}",
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to fetch monthly summary")