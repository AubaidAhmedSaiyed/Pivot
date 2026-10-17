import pytest
from fastapi.testclient import TestClient

from app.main import app
from ml import model_predictor
from ml.model_predictor import ComplexityModelError, predict_complexity


SIMPLE_SCHEMA = """
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);
"""


def test_predict_complexity_uses_model_artifact_outside_backend_working_directory(
    monkeypatch,
    tmp_path,
):
    monkeypatch.chdir(tmp_path)

    prediction = predict_complexity(SIMPLE_SCHEMA)

    assert prediction in {"LOW", "MEDIUM", "HIGH"}
    assert model_predictor.MODEL_PATH.is_absolute()
    assert model_predictor.MODEL_PATH.is_file()


@pytest.mark.parametrize("artifact_contents", [None, b"not a valid joblib artifact"])
def test_predict_complexity_reports_missing_or_corrupt_artifact(
    monkeypatch,
    tmp_path,
    artifact_contents,
):
    artifact_path = tmp_path / "complexity_model.pkl"
    if artifact_contents is not None:
        artifact_path.write_bytes(artifact_contents)
    monkeypatch.setattr(model_predictor, "MODEL_PATH", artifact_path)

    with pytest.raises(ComplexityModelError, match="model is unavailable"):
        predict_complexity(SIMPLE_SCHEMA)


def test_prediction_endpoint_returns_sanitized_error_for_missing_artifact(
    monkeypatch,
    tmp_path,
):
    artifact_path = tmp_path / "private-model-path" / "missing.pkl"
    monkeypatch.setattr(model_predictor, "MODEL_PATH", artifact_path)

    response = TestClient(app).post(
        "/api/ml/predict-complexity",
        json={"sql": SIMPLE_SCHEMA},
    )

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Complexity prediction is currently unavailable."
    }
    assert str(tmp_path) not in response.text
