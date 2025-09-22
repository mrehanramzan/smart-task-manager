from fastapi import APIRouter
from routes.v1 import router as v1_router

router = APIRouter(prefix="/api")

# include v1 router under /api
router.include_router(v1_router)