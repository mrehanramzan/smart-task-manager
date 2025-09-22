from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

from config.api import settings


# Create async engine with connection pooling
engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    echo=(settings.APP_ENV == "development"),  # SQL logs only in dev
    pool_pre_ping=True,        # test connections before using
    pool_size=20,              # default pool size
    max_overflow=10,           # extra connections beyond pool_size
    pool_recycle=3600,         # recycle connections every hour
    connect_args={"timeout": 30},
    future=True,               # ensure SQLAlchemy 2.0 style
)


# Async session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()


async def get_db():
    """
    Yield a database session for dependency injection.
    Ensures session is properly closed after use.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()