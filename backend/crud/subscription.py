from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.subscription import Subscription
from datetime import datetime, timedelta

async def change_subscription(db: AsyncSession, user_id: str, new_tier: str):
    result = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    subscription = result.scalar_one_or_none()

    if not subscription:
        # Create new subscription
        if new_tier == "premium":
            start = datetime.utcnow()
            end = start + timedelta(days=30)
        else:
            start = None
            end = None
        subscription = Subscription(
            user_id=user_id,
            tier=new_tier,
            start_date=start,
            end_date=end
        )
        db.add(subscription)
    else:
        if subscription.tier == new_tier:
            return subscription  # No change

        subscription.tier = new_tier
        if new_tier == "free":
            # Cancel premium
            subscription.start_date = None
            subscription.end_date = None
        else:
            # Upgrade to premium
            subscription.start_date = datetime.utcnow()
            subscription.end_date = datetime.utcnow() + timedelta(days=30)

    await db.commit()
    await db.refresh(subscription)
    return subscription
