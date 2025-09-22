import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from Security.token import get_current_user
from config.database import get_db
from schemas.subscription import SubscriptionUpdateRequest
from crud.subscription import change_subscription

router = APIRouter()
logger = logging.getLogger(__name__)


@router.put("/tier")
async def update_subscription(
    data: SubscriptionUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logger.info(f"User {current_user.email} (id={current_user.id}) requested subscription change to tier: {data.tier}")
    try:
        updated_subscription = await change_subscription(db, current_user.id, data.tier)
        logger.info(f"Subscription updated successfully for user {current_user.email} "
                    f"(id={current_user.id}) -> New tier: {data.tier}")
        return updated_subscription
    except Exception as e:
        logger.error(f"Failed to update subscription for user {current_user.email} "
                     f"(id={current_user.id}) to tier {data.tier}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update subscription")
 