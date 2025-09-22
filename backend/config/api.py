from typing import ClassVar, List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables (.env file or system env).
    Uses Pydantic Settings for automatic parsing and validation.
    """

    # API config
    API_V1_STR: str = "/api"
    VERSION: str = "1.0.0"
    PROJECT_NAME : str = "Task Backend"
    DESCRIPTION: str = "Task Manager backend services"

    # Security
    SECRET_KEY: str  
    ALGORITHM: ClassVar[str] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 2  # 2 days

    # Server
    APP_PORT: int = 8000  
    APP_ENV : str = "development"
    MCP_SERVER_URL: str

    # CORS 
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    #Postgres
    PG_HOST: str = "db"
    PG_PORT : int
    PG_USER : str
    PG_PASSWORD : str
    PG_DB : str

    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        """Async SQLAlchemy URL for asyncpg"""
        return (
            f"postgresql+asyncpg://{self.PG_USER}:{self.PG_PASSWORD}"
            f"@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"
        )

    # Load environment variables from .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
