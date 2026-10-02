from services.schema_analysis import analyze_schema
from services.sql_generator import generate_postgresql_sql


def generate(sql: str) -> dict:
    """Analyze MySQL SQL and generate PostgreSQL migration output."""
    schema = analyze_schema(sql)
    return generate_postgresql_sql(schema)


def test_basic_create_table_and_datatypes():
    result = generate(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            active TINYINT(1),
            created_at DATETIME,
            metadata JSON,
            price DECIMAL(10,2)
        );
        """
    )

    sql = result["sql"]

    assert 'CREATE TABLE "users"' in sql
    assert '"id" INTEGER' in sql
    assert '"name" VARCHAR(100)' in sql
    assert '"active" BOOLEAN' in sql
    assert '"created_at" TIMESTAMP' in sql
    assert '"metadata" JSONB' in sql
    assert '"price" NUMERIC(10, 2)' in sql
    assert 'PRIMARY KEY ("id")' in sql
    assert result["warnings"] == []


def test_composite_primary_key():
    result = generate(
        """
        CREATE TABLE order_items (
            order_id INT,
            product_id INT,
            quantity INT,
            PRIMARY KEY (order_id, product_id)
        );
        """
    )

    assert (
        'PRIMARY KEY ("order_id", "product_id")'
        in result["sql"]
    )


def test_foreign_key_generation():
    result = generate(
        """
        CREATE TABLE customers (
            id INT PRIMARY KEY
        );

        CREATE TABLE orders (
            id INT PRIMARY KEY,
            customer_id INT,
            CONSTRAINT fk_customer
            FOREIGN KEY (customer_id)
            REFERENCES customers(id)
        );
        """
    )

    assert (
        'FOREIGN KEY ("customer_id") '
        'REFERENCES "customers"("id")'
        in result["sql"]
    )


def test_unique_constraint_generation():
    result = generate(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            email VARCHAR(255) UNIQUE
        );
        """
    )

    assert 'UNIQUE ("email")' in result["sql"]


def test_index_generation():
    result = generate(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE INDEX idx_users_name
        ON users(name);
        """
    )

    assert (
        'CREATE INDEX "idx_users_name" '
        'ON "users"("name");'
        in result["sql"]
    )


def test_unique_index_generation():
    result = generate(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            email VARCHAR(255)
        );

        CREATE UNIQUE INDEX idx_users_email
        ON users(email);
        """
    )

    assert (
        'CREATE UNIQUE INDEX "idx_users_email" '
        'ON "users"("email");'
        in result["sql"]
    )


def test_composite_index_generation():
    result = generate(
        """
        CREATE TABLE order_items (
            order_id INT,
            product_id INT
        );

        CREATE INDEX idx_order_product
        ON order_items(order_id, product_id);
        """
    )

    assert (
        'CREATE INDEX "idx_order_product" '
        'ON "order_items"("order_id", "product_id");'
        in result["sql"]
    )


def test_identifier_quoting():
    result = generate(
        """
        CREATE TABLE "order" (
            "select" INT PRIMARY KEY,
            "user-name" VARCHAR(100)
        );
        """
    )

    sql = result["sql"]

    assert 'CREATE TABLE "order"' in sql
    assert '"select" INTEGER' in sql
    assert '"user-name" VARCHAR(100)' in sql


def test_unsupported_column_generates_warning():
    schema = {
        "database": "mysql",
        "tables": [
            {
                "name": "legacy_data",
                "columns": [
                    {
                        "name": "id",
                        "source_type": "INT",
                        "target_type": "INTEGER",
                        "migration_rule": (
                            "MYSQL_INT_TO_POSTGRES_INTEGER"
                        ),
                    },
                    {
                        "name": "legacy_field",
                        "source_type": "UNKNOWN_TYPE",
                        "target_type": None,
                        "migration_rule": "UNSUPPORTED_TYPE",
                        "mapping_error": (
                            "Unsupported MySQL datatype: UNKNOWN_TYPE"
                        ),
                    },
                ],
                "primary_keys": ["id"],
                "foreign_keys": [],
                "constraints": [],
                "indexes": [],
                "triggers": [],
                "unsupported_features": [],
            }
        ],
    }

    result = generate_postgresql_sql(schema)

    assert '"id" INTEGER' in result["sql"]
    assert '"legacy_field"' not in result["sql"]

    assert len(result["warnings"]) == 1
    assert result["warnings"][0]["type"] == "UNSUPPORTED_COLUMN"
    assert result["warnings"][0]["table"] == "legacy_data"
    assert result["warnings"][0]["column"] == "legacy_field"


def test_transformation_log_contains_datatype_mapping():
    result = generate(
        """
        CREATE TABLE products (
            id INT PRIMARY KEY,
            price DECIMAL(10,2)
        );
        """
    )

    datatype_transformations = [
        item
        for item in result["transformations"]
        if item["type"] == "DATATYPE_MAPPING"
    ]

    assert len(datatype_transformations) == 2

    price_mapping = next(
        item
        for item in datatype_transformations
        if item["column"] == "price"
    )

    assert price_mapping["source"] == "DECIMAL(10, 2)"
    assert price_mapping["target"] == "NUMERIC(10, 2)"
    assert (
        price_mapping["rule"]
        == "MYSQL_DECIMAL_TO_POSTGRES_NUMERIC"
    )

def test_current_timestamp_default_is_postgresql_compatible():
    result = generate(
        """
        CREATE TABLE users (
            id INT PRIMARY KEY,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    sql = result["sql"]

    assert (
        '"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        in sql
    )

    assert (
        '"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP()'
        not in sql
    )