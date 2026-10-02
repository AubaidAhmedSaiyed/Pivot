from services.schema_analysis import analyze_schema


def test_summary_counts_only_unsupported_columns():
    schema = analyze_schema(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            active TINYINT(1)
        );
        """
    )

    summary = schema["summary"]

    assert summary["column_count"] == 3
    assert summary["mapped_column_count"] == 3
    assert summary["unsupported_column_count"] == 0
    assert schema["issues"] == []

def test_parser_preserves_on_update_current_timestamp():
    schema = analyze_schema(
        """
        CREATE TABLE users (
            id INT,
            updated_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        );
        """
    )

    column = schema["tables"][0]["columns"][1]

    assert column["default"] == "CURRENT_TIMESTAMP()"
    assert column["on_update"] == "CURRENT_TIMESTAMP()"

def test_unsigned_columns_generate_migration_warning():
    schema = analyze_schema(
        """
        CREATE TABLE inventory (
            id INT UNSIGNED,
            quantity BIGINT UNSIGNED,
            price DECIMAL(10,2) UNSIGNED
        );
        """
    )

    unsigned_issues = [
        issue
        for issue in schema["issues"]
        if issue["type"] == "UNSIGNED_TYPE"
    ]

    assert len(unsigned_issues) == 3

    assert unsigned_issues[0]["column"] == "id"
    assert unsigned_issues[1]["column"] == "quantity"
    assert unsigned_issues[2]["column"] == "price"

    assert all(
        issue["severity"] == "warning"
        for issue in unsigned_issues
    )

def test_named_check_constraint_is_preserved():
    schema = analyze_schema(
        """
        CREATE TABLE users (
            age INT,
            CONSTRAINT chk_age CHECK (age >= 18)
        );
        """
    )

    constraints = schema["tables"][0]["constraints"]

    check_constraints = [
        constraint
        for constraint in constraints
        if constraint["type"] == "CHECK"
    ]

    assert len(check_constraints) == 1
    assert check_constraints[0]["name"] == "chk_age"
    assert check_constraints[0]["condition"] == "age >= 18"