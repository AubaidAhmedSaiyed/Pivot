from unittest.mock import patch

from services.schema_analysis import analyze_schema
from services.ai_migration_reviewer import review_migration


def test_summary_counts_only_unsupported_columns():
    schema = analyze_schema("""
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            active TINYINT(1)
        );
        """)

    summary = schema["summary"]

    assert summary["column_count"] == 3
    assert summary["mapped_column_count"] == 3
    assert summary["unsupported_column_count"] == 0
    assert schema["issues"] == []


def test_parser_preserves_on_update_current_timestamp():
    schema = analyze_schema("""
        CREATE TABLE users (
            id INT,
            updated_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        );
        """)

    column = schema["tables"][0]["columns"][1]

    assert column["default"] == "CURRENT_TIMESTAMP()"
    assert column["on_update"] == "CURRENT_TIMESTAMP()"


def test_unsigned_columns_generate_migration_warning():
    schema = analyze_schema("""
        CREATE TABLE inventory (
            id INT UNSIGNED,
            quantity BIGINT UNSIGNED,
            price DECIMAL(10,2) UNSIGNED
        );
        """)

    unsigned_issues = [
        issue for issue in schema["issues"] if issue["type"] == "UNSIGNED_TYPE"
    ]

    assert len(unsigned_issues) == 3

    assert unsigned_issues[0]["column"] == "id"
    assert unsigned_issues[1]["column"] == "quantity"
    assert unsigned_issues[2]["column"] == "price"

    assert all(issue["severity"] == "warning" for issue in unsigned_issues)


def test_named_check_constraint_is_preserved():
    schema = analyze_schema("""
        CREATE TABLE users (
            age INT,
            CONSTRAINT chk_age CHECK (age >= 18)
        );
        """)

    constraints = schema["tables"][0]["constraints"]

    check_constraints = [
        constraint for constraint in constraints if constraint["type"] == "CHECK"
    ]

    assert len(check_constraints) == 1
    assert check_constraints[0]["name"] == "chk_age"
    assert check_constraints[0]["condition"] == "age >= 18"


def test_risk_engine_detects_foreign_keys_and_triggers():
    schema = analyze_schema("""
        CREATE TABLE orders (
            id INT PRIMARY KEY,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TRIGGER before_insert_orders
        BEFORE INSERT ON orders
        FOR EACH ROW
        SET NEW.user_id = 1;
        """)

    risk = schema["risk"]

    assert risk["risk_level"] == "MEDIUM"
    assert risk["risk_count"] == 2

    risk_types = {item["type"] for item in risk["risks"]}

    assert "FOREIGN_KEYS" in risk_types
    assert "TRIGGER" in risk_types


def test_risk_engine_detects_unsupported_migration_features():
    schema = analyze_schema("""
        CREATE TABLE users (
            id INT PRIMARY KEY,
            custom_data INVALID_TYPE
        );

        CREATE FULLTEXT INDEX idx_users_name
        ON users(name);
        """)

    risk = schema["risk"]

    assert risk["risk_level"] == "HIGH"
    assert risk["risk_count"] == 2

    risk_types = {item["type"] for item in risk["risks"]}

    assert "UNSUPPORTED_DATATYPE" in risk_types
    assert "UNSUPPORTED_FEATURE" in risk_types


@patch("services.ai_migration_reviewer._generate_ai_review")
def test_ai_migration_reviewer_returns_structured_review(mock_ai_review):
    mock_ai_review.return_value = {
        "summary": "Mock AI migration review.",
        "issues": [],
        "recommendations": [],
    }

    analysis = {
        "issues": [
            {
                "type": "UNSIGNED_TYPE",
                "severity": "warning",
                "table": "users",
                "column": "age",
                "message": "Unsigned type requires review.",
            }
        ],
        "risk": {
            "risk_level": "MEDIUM",
            "risk_count": 1,
            "risks": [
                {
                    "type": "UNSIGNED_TYPES",
                    "severity": "medium",
                    "message": "Unsigned types detected.",
                }
            ],
        },
    }

    migration = {
        "warnings": [],
        "transformations": [
            {
                "type": "DATATYPE_MAPPING",
                "table": "users",
                "column": "age",
                "source": "UINT",
                "target": "INTEGER",
                "rule": "MYSQL_UNSIGNED_INT_TO_POSTGRES_INTEGER",
            }
        ],
    }

    result = review_migration(analysis, migration)

    assert result["overall_assessment"] == "MEDIUM"
    assert result["manual_review_required"] is True

    assert len(result["issues"]) == 1
    assert result["issues"][0]["type"] == "UNSIGNED_TYPE"

    assert len(result["migration_decisions"]) == 1
    assert (
        result["migration_decisions"][0]["rule"]
        == "MYSQL_UNSIGNED_INT_TO_POSTGRES_INTEGER"
    )

    assert len(result["recommendations"]) >= 1
    mock_ai_review.assert_called_once()


@patch("services.ai_migration_reviewer._generate_ai_review")

def test_ai_migration_reviewer_detects_migration_warnings(mock_ai_review):
    mock_ai_review.return_value = {
        "summary": "Mock AI migration review.",
        "issues": [],
        "recommendations": [],
    }

    analysis = {
        "issues": [],
        "risk": {"risk_level": "HIGH", "risk_count": 1, "risks": []},
    }

    migration = {
        "warnings": [
            {
                "type": "TRIGGER_NOT_GENERATED",
                "table": "users",
                "trigger": "before_insert_users",
                "message": "MySQL trigger was detected but was not generated.",
            }
        ],
        "transformations": [],
    }

    result = review_migration(analysis, migration)

    assert result["overall_assessment"] == "HIGH"
    assert result["manual_review_required"] is True

    assert len(result["issues"]) == 1
    assert result["issues"][0]["type"] == "TRIGGER_NOT_GENERATED"
    assert result["issues"][0]["severity"] == "warning"

    assert any(
        "warnings" in recommendation.lower()
        for recommendation in result["recommendations"]
    )

    mock_ai_review.assert_called_once()
