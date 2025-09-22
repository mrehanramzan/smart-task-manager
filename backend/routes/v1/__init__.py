from fastapi import APIRouter

from routes.v1.auth import router as auth_router
from routes.v1.tasks import router as task_router
from routes.v1.subscriptions import router as subscription_router
from routes.v1.account import router as account_router
from routes.v1.process import router as mcp_client_router

router = APIRouter(prefix="/v1")

# include sub-routers
router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(task_router, prefix="/tasks", tags=["Tasks"])
router.include_router(subscription_router, prefix="/subscriptions", tags=["Subscriptions"])
router.include_router(account_router, prefix="/account", tags=["Account"])
router.include_router(mcp_client_router, prefix="/process", tags=["MCP"])