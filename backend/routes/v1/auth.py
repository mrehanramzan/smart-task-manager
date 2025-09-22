import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from models.user import User
from config.database import get_db
from schemas.user import UserResponse, UserCreate, TokenResponse
from crud import auth as crud_auth
from Security.token import create_access_token, get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"Login attempt for username: {form_data.username}")

    try:
        user = await crud_auth.authenticate_user(db, form_data.username, form_data.password)
        if not user:
            logger.warning(f"Failed login for username: {form_data.username}")
            raise HTTPException(status_code=401, detail="Invalid email or password")

        subscription = await crud_auth.get_user_with_subscription(db, user.id)
        access_token = create_access_token(data={"sub": str(user.id)})

        logger.info(f"User {user.email} logged in successfully with subscription: "
                    f"{subscription.tier if subscription else 'free'}")

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
            "subscription_tier": subscription.tier if subscription else "free"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login for username {form_data.username}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"Registration attempt for email: {user.email}")

    try:
        existing_user = await crud_auth.get_user_by_email(db, user.email)
        if existing_user:
            logger.warning(f"Registration failed - email already exists: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = await crud_auth.create_user_with_subscription(db, user)
        logger.info(f"User registered successfully: {new_user.email}")
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration for email {user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Registration failed")


@router.get("/me", response_model=TokenResponse)
async def get_current_user_info(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Fetching profile for user: {current_user.email}")

    try:
        subscription = await crud_auth.get_user_with_subscription(db, current_user.id)
        access_token = create_access_token(data={"sub": str(current_user.id)})

        logger.info(f"Profile data returned for user: {current_user.email}, "
                    f"subscription: {subscription.tier if subscription else 'free'}")

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": current_user,
            "subscription_tier": subscription.tier if subscription else "free"
        }
    except Exception as e:
        logger.error(f"Failed to fetch profile for user {current_user.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch profile")