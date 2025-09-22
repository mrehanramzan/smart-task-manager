from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db
from config.api import settings
from crud import auth as crud_auth


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await crud_auth.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    return user


async def premium_user(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    premium_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access restricted to premium users"
    )

    # Fetch subscription info (await required if async)
    active_subscription = await crud_auth.get_user_with_subscription(db, current_user.id)

    # Handle missing subscription or free plan
    if not active_subscription or active_subscription.tier == "free":
        raise premium_exception

    return current_user