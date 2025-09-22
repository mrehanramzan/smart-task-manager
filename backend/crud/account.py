from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User
from Security.deps import verify_password, get_password_hash

async def update_user_profile(db: AsyncSession, user_id: str, fullname: str = None, email: str = None):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if fullname:
        user.fullname = fullname
    if email:
        user.email = email

    await db.commit()
    await db.refresh(user)
    return user


async def change_password(db: AsyncSession, user_id: str, old_password: str, new_password: str):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.hashed_password = get_password_hash(new_password)
    await db.commit()
    return {"message": "Password updated successfully"}