from services.schema_diff import diff_schemas
from services.schema_parser import parse_schema
from services.schema_analysis import analyze_schema
from services.sql_generator import generate_postgresql_sql


def test_schema_diff_detects_added_column():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "name", "type": "VARCHAR(100)"},
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "name", "type": "VARCHAR(100)"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_columns"] == 1
    assert result["summary"]["removed_columns"] == 0

    assert result["changes"][0]["type"] == "ADDED_COLUMN"
    assert result["changes"][0]["table"] == "users"
    assert result["changes"][0]["column"] == "email"


def test_schema_diff_detects_column_type_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_columns"] == 1

    assert result["changes"][0]["type"] == "COLUMN_TYPE_CHANGED"
    assert result["changes"][0]["table"] == "users"
    assert result["changes"][0]["column"] == "id"
    assert result["changes"][0]["source_type"] == "INT"
    assert result["changes"][0]["target_type"] == "INTEGER"


def test_schema_diff_detects_added_and_removed_tables():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                ],
            },
            {
                "name": "orders",
                "columns": [
                    {"name": "id", "type": "INT"},
                ],
            },
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                ],
            },
            {
                "name": "products",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                ],
            },
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_tables"] == 1
    assert result["summary"]["removed_tables"] == 1

    change_types = {change["type"] for change in result["changes"]}

    assert "ADDED_TABLE" in change_types
    assert "REMOVED_TABLE" in change_types


def test_schema_diff_detects_primary_key_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                ],
                "primary_key": ["id"],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": ["email"],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_primary_keys"] == 1

    primary_key_change = next(
        change
        for change in result["changes"]
        if change["type"] == "PRIMARY_KEY_CHANGED"
    )

    assert primary_key_change["table"] == "users"
    assert primary_key_change["source_columns"] == ["id"]
    assert primary_key_change["target_columns"] == ["email"]


def test_schema_diff_detects_foreign_key_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "orders",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "user_id", "type": "INT"},
                ],
                "foreign_keys": [
                    {
                        "columns": ["user_id"],
                        "referenced_table": "users",
                        "referenced_columns": ["id"],
                    }
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "orders",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "user_id", "type": "INTEGER"},
                ],
                "foreign_keys": [
                    {
                        "columns": ["user_id"],
                        "referenced_table": "customers",
                        "referenced_columns": ["id"],
                    }
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_foreign_keys"] == 1

    foreign_key_change = next(
        change
        for change in result["changes"]
        if change["type"] == "FOREIGN_KEY_CHANGED"
    )

    assert foreign_key_change["table"] == "orders"
    assert foreign_key_change["source"]["referenced_table"] == "users"
    assert foreign_key_change["target"]["referenced_table"] == "customers"


def test_schema_diff_detects_unique_constraint_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "unique_constraints": [
                    ["email"],
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "unique_constraints": [
                    ["id"],
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_unique_constraints"] == 1

    unique_change = next(
        change
        for change in result["changes"]
        if change["type"] == "UNIQUE_CONSTRAINT_CHANGED"
    )

    assert unique_change["table"] == "users"
    assert unique_change["source"] == [["email"]]
    assert unique_change["target"] == [["id"]]


def test_schema_diff_detects_check_constraint_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "products",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "price", "type": "DECIMAL(10,2)"},
                ],
                "checks": [
                    "price > 0",
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "products",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "price", "type": "NUMERIC(10,2)"},
                ],
                "checks": [
                    "price >= 0",
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_checks"] == 1

    check_change = next(
        change
        for change in result["changes"]
        if change["type"] == "CHECK_CONSTRAINT_CHANGED"
    )

    assert check_change["table"] == "products"
    assert check_change["source"] == ["price > 0"]
    assert check_change["target"] == ["price >= 0"]


def test_schema_diff_detects_index_change():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "indexes": [
                    {
                        "name": "idx_users_email",
                        "columns": ["email"],
                    }
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "indexes": [
                    {
                        "name": "idx_users_email",
                        "columns": ["id"],
                    }
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["changed_indexes"] == 1

    index_change = next(
        change for change in result["changes"] if change["type"] == "INDEX_CHANGED"
    )

    assert index_change["table"] == "users"
    assert index_change["source"]["name"] == "idx_users_email"
    assert index_change["source"]["columns"] == ["email"]
    assert index_change["target"]["columns"] == ["id"]

def test_schema_diff_returns_no_changes_for_identical_schemas():
    schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": ["id"],
                "foreign_keys": [],
                "unique_constraints": [["email"]],
                "checks": ["id > 0"],
                "indexes": [
                    {
                        "name": "idx_users_email",
                        "columns": ["email"],
                    }
                ],
            }
        ],
    }

    result = diff_schemas(schema, schema)

    assert result["summary"] == {
        "added_tables": 0,
        "removed_tables": 0,
        "added_columns": 0,
        "removed_columns": 0,
        "changed_columns": 0,
        "changed_primary_keys": 0,
        "added_primary_keys" : 0,
        "removed_primary_keys":0,
        "changed_foreign_keys": 0,
        "added_foreign_keys": 0,
        "removed_foreign_keys": 0,
        "changed_unique_constraints": 0,
        "added_unique_constraints": 0,
        "removed_unique_constraints": 0,
        "changed_checks": 0,
        "added_checks": 0,
        "removed_checks": 0,
        "changed_indexes": 0,
        "added_indexes": 0,
        "removed_indexes": 0,
    }

    assert result["changes"] == []

def test_schema_diff_detects_added_and_removed_indexes():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "indexes": [
                    {
                        "name": "idx_users_email",
                        "columns": ["email"],
                    }
                ],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "indexes": [
                    {
                        "name": "idx_users_id",
                        "columns": ["id"],
                    }
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_indexes"] == 1
    assert result["summary"]["removed_indexes"] == 1

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "INDEX_ADDED" in change_types
    assert "INDEX_REMOVED" in change_types

def test_schema_diff_detects_added_and_removed_foreign_keys():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "orders",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "user_id", "type": "INT"},
                ],
                "foreign_keys": [],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "orders",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "user_id", "type": "INTEGER"},
                ],
                "foreign_keys": [
                    {
                        "columns": ["user_id"],
                        "referenced_table": "users",
                        "referenced_columns": ["id"],
                    }
                ],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_foreign_keys"] == 1
    assert result["summary"]["removed_foreign_keys"] == 0

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "FOREIGN_KEY_ADDED" in change_types

def test_schema_diff_detects_added_and_removed_unique_constraints():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "unique_constraints": [["email"]],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "unique_constraints": [["username"]],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_unique_constraints"] == 1
    assert result["summary"]["removed_unique_constraints"] == 1

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "UNIQUE_CONSTRAINT_ADDED" in change_types
    assert "UNIQUE_CONSTRAINT_REMOVED" in change_types

def test_schema_diff_detects_added_and_removed_check_constraints():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "products",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "price", "type": "DECIMAL(10,2)"},
                ],
                "checks": ["price > 0"],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "products",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "price", "type": "DECIMAL(10,2)"},
                ],
                "checks": ["price >= 0"],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_checks"] == 1
    assert result["summary"]["removed_checks"] == 1

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "CHECK_ADDED" in change_types
    assert "CHECK_REMOVED" in change_types

def test_schema_diff_detects_added_and_removed_primary_keys():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": [],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": ["id"],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_primary_keys"] == 1
    assert result["summary"]["removed_primary_keys"] == 0

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "PRIMARY_KEY_ADDED" in change_types

def test_schema_diff_detects_removed_primary_key():
    source_schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INT"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": ["id"],
            }
        ],
    }

    target_schema = {
        "database": "postgres",
        "tables": [
            {
                "name": "users",
                "columns": [
                    {"name": "id", "type": "INTEGER"},
                    {"name": "email", "type": "VARCHAR(255)"},
                ],
                "primary_key": [],
            }
        ],
    }

    result = diff_schemas(source_schema, target_schema)

    assert result["summary"]["added_primary_keys"] == 0
    assert result["summary"]["removed_primary_keys"] == 1

    change_types = {
        change["type"]
        for change in result["changes"]
    }

    assert "PRIMARY_KEY_REMOVED" in change_types

def test_schema_diff_with_generated_postgresql_migration():
    source_sql = """
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            created_at DATETIME
        );
    """

    source_schema = analyze_schema(source_sql)

    migration = generate_postgresql_sql(source_schema)

    target_schema = parse_schema(
        migration["sql"],
        dialect="postgres",
    )

    result = diff_schemas(
        source_schema,
        target_schema,
    )

    assert "summary" in result
    assert "changes" in result

    summary = result["summary"]

    assert summary["added_tables"] == 0
    assert summary["removed_tables"] == 0
    assert summary["added_columns"] == 0
    assert summary["removed_columns"] == 0

    assert summary["added_primary_keys"] == 0
    assert summary["removed_primary_keys"] == 0

    assert summary["added_unique_constraints"] == 0
    assert summary["removed_unique_constraints"] == 0