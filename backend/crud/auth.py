import uuid
from models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.user import UserCreate
from Security.deps import get_password_hash, verify_password


from sqlalchemy.exc import SQLAlchemyError
from models.user import User
from models.subscription import Subscription
from sqlalchemy.future import select



async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Fetch user by email"""
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()



async def create_user_with_subscription(db: AsyncSession, user: UserCreate) -> User:
    """Create a new user and automatically assign a free subscription"""
    try:
        db_user = User(
            id=uuid.uuid4(),
            email=user.email,
            fullname=user.fullname,
            hashed_password=get_password_hash(user.password),
        )
        db.add(db_user)
        await db.flush()  # ensures db_user.id is available

        subscription = Subscription(user_id=db_user.id, tier="free")
        db.add(subscription)

        await db.commit()
        await db.refresh(db_user)
        return db_user

    except SQLAlchemyError:
        await db.rollback()
        raise


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user



async def get_user_with_subscription(db: AsyncSession, user_id: str) -> Subscription | None:
    result = await db.execute(select(Subscription).filter(Subscription.user_id == user_id))
    return result.scalars().first()


async def get_user_by_id(db: AsyncSession, user_id: str | uuid.UUID):
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            return None 
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalars().first()