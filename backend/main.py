"""
Entry point for Railway deployment.
This module imports the FastAPI app from server.py for use with Uvicorn.
"""

from server import app

__all__ = ["app"]
