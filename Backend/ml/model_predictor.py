import logging
from pathlib import Path

import joblib
import pandas as pd
from services.schema_parser import parse_schema
from ml.feature_extractor import extract_features

logger = logging.getLogger(__name__)
MODEL_PATH = Path(__file__).resolve().with_name("complexity_model.pkl")


class ComplexityModelError(RuntimeError):
    """Raised when the trained complexity model cannot be loaded."""


def predict_complexity(sql_script: str) -> str :
    """
    Predict migration complexity for a new MySQL schema.
    """

    # Parse MySQL schema
    schema = parse_schema(sql_script)

    # Extract ML features
    features = extract_features(schema)

    features_columns = [
       "table_count",
       "column_count",
       "foreign_key_count",
       "constraint_count",
       "index_count",
       "trigger_count",
       "unsupported_feature_count",
       "unsigned_type_count",
       "auto_increment_count",
       "default_value_count",
       "check_constraint_count",
       "unique_constraint_count"
    ]


    # Prepare model input
    model_input = pd.DataFrame(
    [[features[column] for column in features_columns]],
    columns = features_columns
)

    # Load trained model
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as exc:
        logger.error(
            "Could not load complexity model artifact (%s)",
            type(exc).__name__,
        )
        raise ComplexityModelError(
            "The complexity prediction model is unavailable."
        ) from exc

    # Predict
    prediction = model.predict(model_input)[0]

    return prediction

if __name__ == "__main__":

    test_schema = """

     CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE
    );

    CREATE TABLE orders (
        id INT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(10,2),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """

    result = predict_complexity(test_schema)

    print("\n PREDICTION")

    print("Migration Complexity:" , result)