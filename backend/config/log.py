import logging
import sys
import json
from pathlib import Path
from logging.handlers import RotatingFileHandler
from typing import Any, Dict


class JSONFormatter(logging.Formatter):
    """Structured JSON formatter for production logging"""

    def format(self, record: logging.LogRecord) -> str:
        log: Dict[str, Any] = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)
        return json.dumps(log)


def setup_logging(env: str = "development") -> None:
    """Configure logging for development or production"""
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.setLevel(logging.DEBUG)

    if env == "development":
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s "
            "[%(filename)s:%(lineno)d]"
        )
        handler = logging.StreamHandler(sys.stdout)

    else:  # production
        logs_dir = Path("logs")
        logs_dir.mkdir(exist_ok=True)
        formatter = JSONFormatter()

        # Console handler
        handler = logging.StreamHandler(sys.stdout)

        # File handler with rotation
        file_handler = RotatingFileHandler(
            logs_dir / "app.log", maxBytes=10 * 1024 * 1024, backupCount=5, encoding="utf-8"
        )
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

        root_logger.setLevel(logging.INFO)
        logging.getLogger("sqlalchemy").setLevel(logging.ERROR)
        logging.getLogger("uvicorn.access").setLevel(logging.INFO)

    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
