from datetime import datetime, timezone

from models.migration_run import MigrationRun
from services.report_service import generate_migration_report


def test_generate_migration_report():
    migration_run = MigrationRun(
        id=1,
        project_id=1,
        status="COMPLETED",
        source_sql="""
            CREATE TABLE users (
                id INT PRIMARY KEY,
                name VARCHAR(100)
            );
        """,
        analysis_result={
            "summary": {
                "table_count": 1,
                "column_count": 2,
                "primary_key_count": 1,
                "foreign_key_count": 0,
                "constraint_count": 0,
                "index_count": 0,
                "unsupported_feature_count": 0,
            },
            "risk": {
                "risk_level": "LOW",
            },
        },
        migration_result={
            "target_database": "postgresql",
            "sql": 'CREATE TABLE "users" ("id" INTEGER, "name" VARCHAR(100));',
            "transformations": [
                {
                    "type": "DATATYPE_MAPPING",
                    "table": "users",
                    "column": "id",
                    "target": "INTEGER",
                }
            ],
            "warnings": [],
        },
        ml_prediction={
            "complexity": "LOW",
        },
        ai_review={
            "summary": "Migration is straightforward.",
            "recommendations": [
                "Review the generated SQL before deployment."
            ],
        },
        created_at=datetime.now(timezone.utc),
    )

    pdf_bytes = generate_migration_report(migration_run)

    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes.startswith(b"%PDF")