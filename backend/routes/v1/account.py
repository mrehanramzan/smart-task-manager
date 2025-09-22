import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from Security.token import get_current_user
from schemas.account import ChangePasswordRequest, UpdateProfileRequest
from config.database import get_db
from crud.account import update_user_profile, change_password

router = APIRouter()
logger = logging.getLogger(__name__)


@router.patch("/profile")
async def change_profile(
    data: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logger.info(f"User {current_user.email} (id={current_user.id}) requested profile update")

    try:
        updated_user = await update_user_profile(db, current_user.id, data.fullname, data.email)
        logger.info(f"Profile updated successfully for user {current_user.email} (id={current_user.id})")
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Failed to update profile for user {current_user.email} (id={current_user.id}): {str(e)}",
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to update profile")


@router.patch("/password")
async def change_password_route(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logger.info(f"User {current_user.email} (id={current_user.id}) requested password change")

    try:
        result = await change_password(db, current_user.id, data.old_password, data.new_password)
        logger.info(f"Password changed successfully for user {current_user.email} (id={current_user.id})")
        return result
    except HTTPException as e:
        logger.warning(f"Password change failed for user {current_user.email} (id={current_user.id}): {e.detail}")
        raise
    except Exception as e:
        logger.error(
            f"Unexpected error while changing password for user {current_user.email} (id={current_user.id}): {str(e)}",
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to change password")
