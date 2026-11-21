import os
from pathlib import Path


def test_backend_env_defaults_are_railway_friendly():
    server_path = Path(__file__).resolve().parents[1] / "backend" / "server.py"
    content = server_path.read_text(encoding="utf-8")

    assert "PORT" in content
    assert "ALLOWED_ORIGINS" in content
    assert 'uvicorn.run' in content
