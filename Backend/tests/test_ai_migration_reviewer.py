import json
import os
from types import SimpleNamespace
from unittest.mock import Mock, patch

import httpx
from fastapi.testclient import TestClient
from openai import APITimeoutError

from app.main import app
from services import ai_migration_reviewer


ANALYSIS = {
    "issues": [{"type": "UNSIGNED_TYPE", "message": "Synthetic unsigned column"}],
    "risk": {"risk_level": "MEDIUM"},
}
MIGRATION = {
    "sql": "CREATE TABLE demo (id INTEGER);",
    "transformations": [{"source": "INT UNSIGNED", "target": "INTEGER"}],
}
AI_RESULT = {
    "summary": "Mocked migration review.",
    "issues": [
        {
            "type": "range_change",
            "severity": "medium",
            "explanation": "The source column is unsigned.",
            "recommendation": "Review its accepted range.",
        }
    ],
    "recommendations": ["Validate the source value range."],
}


def test_ai_review_calls_provider_with_analysis_and_generated_sql():
    responses = Mock()
    responses.create.return_value = SimpleNamespace(output_text=json.dumps(AI_RESULT))
    client = SimpleNamespace(responses=responses)

    with patch.object(ai_migration_reviewer, "OpenAI", return_value=client):
        result = ai_migration_reviewer._generate_ai_review(ANALYSIS, MIGRATION)

    assert result == {
        **AI_RESULT,
        "source": "ai",
        "status": "complete",
    }
    provider_call = responses.create.call_args.kwargs
    assert provider_call["model"] == ai_migration_reviewer.AI_MODEL
    assert "Synthetic unsigned column" in provider_call["input"]
    assert "CREATE TABLE demo" in provider_call["input"]


def test_ai_review_missing_api_key_returns_deterministic_fallback():
    with patch.dict(os.environ, {"OPENAI_API_KEY": ""}):
        result = ai_migration_reviewer._generate_ai_review(ANALYSIS, MIGRATION)

    assert result["source"] == "deterministic"
    assert result["status"] == "fallback"
    assert result["error"]
    assert result["summary"]


def test_ai_review_provider_timeout_returns_deterministic_fallback():
    request = httpx.Request("POST", "https://api.openai.com/v1/responses")
    responses = Mock()
    responses.create.side_effect = APITimeoutError(request=request)
    client = SimpleNamespace(responses=responses)

    with patch.object(ai_migration_reviewer, "OpenAI", return_value=client):
        result = ai_migration_reviewer._generate_ai_review(ANALYSIS, MIGRATION)

    assert result["source"] == "deterministic"
    assert result["status"] == "fallback"
    assert "api.openai.com" not in result["error"]


def test_review_endpoint_remains_available_without_ai_configuration():
    with patch.dict(os.environ, {"OPENAI_API_KEY": ""}):
        response = TestClient(app).post(
            "/api/migration/review",
            json={
                "sql": """
                    CREATE TABLE users (
                        id INT PRIMARY KEY,
                        age INT UNSIGNED
                    );
                """
            },
        )

    assert response.status_code == 200
    data = response.json()
    review = data["review"]

    assert review["ai_review"]["source"] == "deterministic"
    assert review["ai_review"]["status"] == "fallback"
    assert review["overall_assessment"] == "MEDIUM"
    assert any(issue["type"] == "UNSIGNED_TYPE" for issue in review["issues"])
