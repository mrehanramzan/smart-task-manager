import logging
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from config.api import settings
from config.log import setup_logging
from routes.api import router as api_router


# Setup logging based on environment
setup_logging(env=settings.APP_ENV)
logger = logging.getLogger(__name__)
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.BACKEND_CORS_ORIGINS,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health",  tags=["Health"])
def get_server_health() -> JSONResponse:
    """
    Health check endpoint.
    Returns 200 OK if the server is up and running.
    """
    logger.info("Health check endpoint called - returning 200 OK")
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Server is healthy"},
    )
app.include_router(api_router)