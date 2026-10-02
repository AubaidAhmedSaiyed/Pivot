from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_generate_migration_sql():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    name VARCHAR(100),
                    active TINYINT(1),
                    created_at DATETIME
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["analysis"]["summary"]["table_count"] == 1
    assert data["analysis"]["summary"]["column_count"] == 4
    assert data["analysis"]["summary"]["mapped_column_count"] == 4
    assert data["analysis"]["summary"]["unsupported_column_count"] == 0

    migration = data["migration"]

    assert migration["target_database"] == "postgresql"
    assert migration["warnings"] == []

    sql = migration["sql"]

    assert '"id" INTEGER' in sql
    assert '"name" VARCHAR(100)' in sql
    assert '"active" BOOLEAN' in sql
    assert '"created_at" TIMESTAMP' in sql
    assert 'PRIMARY KEY ("id")' in sql

    assert len(migration["transformations"]) == 5

def test_schema_analysis_response_includes_column_metadata():
    response = client.post(
        "/api/schema/analyze",
        json={
            "sql": """
            CREATE TABLE users (
                id INT AUTO_INCREMENT NOT NULL,
                name VARCHAR(100) DEFAULT 'Guest',
                updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            """
        },
    )

    assert response.status_code == 200

    data = response.json()
    columns = {column["name"]: column for column in data["tables"][0]["columns"]}

    assert columns["id"]["nullable"] is False
    assert columns["id"]["auto_increment"] is True

    assert columns["name"]["default"] == "'Guest'"

    assert columns["updated_at"]["on_update"] == "CURRENT_TIMESTAMP()"


def test_generate_migration_sql_complex_schema():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE,
                    created_at DATETIME
                );

                CREATE TABLE orders (
                    user_id INT,
                    product_id BIGINT,
                    quantity INT,
                    price DECIMAL(10,2),
                    PRIMARY KEY (user_id, product_id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );

                CREATE INDEX idx_orders_quantity
                ON orders(quantity);
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    analysis = data["analysis"]
    migration = data["migration"]

    assert analysis["summary"]["table_count"] == 2
    assert analysis["summary"]["column_count"] == 7
    assert analysis["summary"]["primary_key_count"] == 3
    assert analysis["summary"]["foreign_key_count"] == 1
    assert analysis["summary"]["constraint_count"] == 1
    assert analysis["summary"]["index_count"] == 1
    assert analysis["summary"]["mapped_column_count"] == 7
    assert analysis["summary"]["unsupported_column_count"] == 0

    sql = migration["sql"]

    assert 'CREATE TABLE "users"' in sql
    assert 'CREATE TABLE "orders"' in sql

    assert 'PRIMARY KEY ("id")' in sql
    assert 'PRIMARY KEY ("user_id", "product_id")' in sql

    assert (
        'FOREIGN KEY ("user_id") '
        'REFERENCES "users"("id")'
    ) in sql

    assert 'UNIQUE ("email")' in sql

    assert (
        'CREATE INDEX "idx_orders_quantity" '
        'ON "orders"("quantity");'
    ) in sql

    assert '"price" NUMERIC(10, 2)' in sql

    assert migration["warnings"] == []
def test_generate_migration_sql_unsigned_types():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE inventory (
                    id INT UNSIGNED PRIMARY KEY,
                    quantity INT UNSIGNED,
                    price DECIMAL(10,2) UNSIGNED
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    analysis = data["analysis"]
    migration = data["migration"]

    assert analysis["summary"]["table_count"] == 1
    assert analysis["summary"]["column_count"] == 3
    assert analysis["summary"]["mapped_column_count"] == 3
    assert analysis["summary"]["unsupported_column_count"] == 0

    sql = migration["sql"]

    assert '"id" INTEGER' in sql
    assert '"quantity" INTEGER' in sql
    assert '"price" NUMERIC(10, 2)' in sql

    assert "UNSIGNED" not in sql
    assert migration["warnings"] == []

def test_generate_migration_sql_not_null_and_default():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    status VARCHAR(20) DEFAULT 'active',
                    score INT DEFAULT 0
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    migration = data["migration"]
    sql = migration["sql"]

    assert '"id" INTEGER NOT NULL' in sql
    assert '"name" VARCHAR(100) NOT NULL' in sql
    assert '"status" VARCHAR(20) DEFAULT \'active\'' in sql
    assert '"score" INTEGER DEFAULT 0' in sql

    assert migration["warnings"] == []

def test_generate_migration_sql_auto_increment():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100)
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    migration = data["migration"]
    sql = migration["sql"]

    assert '"id" INTEGER GENERATED BY DEFAULT AS IDENTITY' in sql
    assert '"name" VARCHAR(100)' in sql
    assert "AUTO_INCREMENT" not in sql
    assert migration["warnings"] == []

def test_generate_migration_sql_auto_increment_not_null():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    migration = data["migration"]
    sql = migration["sql"]

    assert (
        '"id" INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL'
        in sql
    )
    assert '"name" VARCHAR(100) NOT NULL' in sql
    assert "AUTO_INCREMENT" not in sql
    assert migration["warnings"] == []

def test_generate_migration_sql_on_update_timestamp():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    updated_at TIMESTAMP
                        DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    migration = data["migration"]
    sql = migration["sql"]

    assert 'DEFAULT CURRENT_TIMESTAMP' in sql
    assert 'DEFAULT CURRENT_TIMESTAMP()' not in sql

    assert 'CREATE OR REPLACE FUNCTION "users_set_on_update"()' in sql
    assert 'NEW."updated_at" = CURRENT_TIMESTAMP;' in sql
    assert 'CREATE TRIGGER "users_set_on_update_trigger"' in sql
    assert 'BEFORE UPDATE ON "users"' in sql
    assert 'EXECUTE FUNCTION "users_set_on_update"();' in sql

    assert "ON UPDATE" not in sql
    assert migration["warnings"] == []

def test_generate_migration_sql_unsigned_variants():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE inventory (
                    id INT UNSIGNED,
                    quantity BIGINT UNSIGNED,
                    price DECIMAL(10,2) UNSIGNED
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    migration = data["migration"]
    sql = migration["sql"]

    assert '"id" INTEGER' in sql
    assert '"quantity" BIGINT' in sql
    assert '"price" NUMERIC(10, 2)' in sql

    assert "UNSIGNED" not in sql
    assert migration["warnings"] == []

def test_generate_migration_sql_unsigned_warnings():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE inventory (
                    id INT UNSIGNED,
                    quantity BIGINT UNSIGNED,
                    price DECIMAL(10,2) UNSIGNED
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()

    issues = data["analysis"]["issues"]
    migration = data["migration"]

    unsigned_issues = [
        issue
        for issue in issues
        if issue["type"] == "UNSIGNED_TYPE"
    ]

    assert len(unsigned_issues) == 3

    assert [issue["column"] for issue in unsigned_issues] == [
        "id",
        "quantity",
        "price",
    ]

    assert all(
        issue["severity"] == "warning"
        for issue in unsigned_issues
    )

    assert '"id" INTEGER' in migration["sql"]
    assert '"quantity" BIGINT' in migration["sql"]
    assert '"price" NUMERIC(10, 2)' in migration["sql"]

    assert migration["warnings"] == []

def test_generate_migration_sql_check_constraint():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
            CREATE TABLE users (
                id INT PRIMARY KEY,
                age INT,
                CONSTRAINT chk_age CHECK (age >= 18)
            );
            """
        },
    )

    assert response.status_code == 200

    data = response.json()
    sql = data["migration"]["sql"]

    assert 'CONSTRAINT "chk_age" CHECK (age >= 18)' in sql
    assert data["migration"]["warnings"] == []

def test_schema_analysis_response_includes_check_constraint_name():
    response = client.post(
        "/api/schema/analyze",
        json={
            "sql": """
                CREATE TABLE users (
                    age INT,
                    CONSTRAINT chk_age CHECK (age >= 18)
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()
    constraints = data["tables"][0]["constraints"]

    check_constraints = [
        constraint
        for constraint in constraints
        if constraint["type"] == "CHECK"
    ]

    assert len(check_constraints) == 1
    assert check_constraints[0]["name"] == "chk_age"
    assert check_constraints[0]["condition"] == "age >= 18"

def test_generate_migration_sql_reports_unsupported_features():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    name VARCHAR(100)
                );

                CREATE TRIGGER trg_users
                BEFORE INSERT ON users
                FOR EACH ROW
                SET NEW.name = UPPER(NEW.name);
            """
        }
    )

    assert response.status_code == 200

    data = response.json()
    warnings = data["migration"]["warnings"]

    trigger_warnings = [
        warning
        for warning in warnings
        if warning["type"] == "TRIGGER_NOT_GENERATED"
    ]

    assert len(trigger_warnings) == 1
    assert trigger_warnings[0]["table"] == "users"
    assert trigger_warnings[0]["trigger"] == "trg_users"

def test_generate_migration_sql_reports_unsupported_datatype():
    response = client.post(
        "/api/migration/generate-sql",
        json={
            "sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    custom_data INVALID_TYPE
                );
            """
        }
    )

    assert response.status_code == 200

    data = response.json()
    migration = data["migration"]

    unsupported_warnings = [
        warning
        for warning in migration["warnings"]
        if warning["type"] == "UNSUPPORTED_COLUMN"
    ]

    assert len(unsupported_warnings) == 1
    assert unsupported_warnings[0]["table"] == "users"
    assert unsupported_warnings[0]["column"] == "custom_data"

    sql = migration["sql"]

    assert '"id" INTEGER' in sql
    assert "custom_data" not in sql