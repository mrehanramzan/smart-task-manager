import logging
from sqlalchemy import text
from utils.log import setup_logging
from utils.database import engine
from utils.api import settings
from server import mcp, model


setup_logging(settings.APP_ENV)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Smart Task Manager MCP Server...")
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")

    if settings.GEMINI_API_KEY:
        try:
            response = model.generate_content("Hello, this is a test.")
            logger.info("Gemini API connection successful")
        except Exception as e:
            logger.warning(f"Gemini API connection failed: {e}")
    else:
        logger.warning("GEMINI_API_KEY not provided. Using fallback responses.")

    
    # mcp.run(transport="sse")
    mcp.run(transport="sse")