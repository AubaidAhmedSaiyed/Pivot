from models.migration_run import MigrationRun


def test_create_migration_for_project(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "migration-project-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "migration-project-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    project_response = client.post(
        "/api/projects",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Migration API Test Project",
            "description": "Project migration endpoint test",
        },
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    migration_response = client.post(
        f"/api/projects/{project_id}/migrations",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={"source_sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY,
                    name VARCHAR(100),
                    email VARCHAR(255) UNIQUE
                );
            """},
    )

    assert migration_response.status_code == 201

    data = migration_response.json()

    assert data["project_id"] == project_id
    assert data["status"] == "COMPLETED"
    assert data["source_sql"].strip().startswith("CREATE TABLE users")
    assert data["analysis_result"] is not None
    assert data["migration_result"] is not None
    assert data["ml_prediction"] is not None
    assert data["ai_review"] is not None

    assert data["migration_result"]["target_database"] == "postgresql"
    assert data["ml_prediction"]["complexity"] in {
        "LOW",
        "MEDIUM",
        "HIGH",
    }


def test_migration_failure_is_persisted(client, monkeypatch, db_session):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "migration-failure-test@pivot.dev",
            "password": "test_password_123",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "migration-failure-test@pivot.dev",
            "password": "test_password_123",
        },
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    project_response = client.post(
        "/api/projects",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Migration Failure Test Project",
            "description": "Failure persistence test",
        },
    )
    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    def failing_generate_sql(*args, **kwargs):
        raise RuntimeError("Intentional migration failure")

    monkeypatch.setattr(
        "routers.migrations.generate_postgresql_sql",
        failing_generate_sql,
    )

    migration_response = client.post(
        f"/api/projects/{project_id}/migrations",
        headers={"Authorization": f"Bearer {token}"},
        json={"source_sql": """
                CREATE TABLE users (
                    id INT PRIMARY KEY
                );
            """},
    )

    assert migration_response.status_code == 500
    assert migration_response.json()["detail"] == "Migration processing failed."

    migration_run = (
        db_session.query(MigrationRun)
        .filter(MigrationRun.project_id == project_id)
        .first()
    )


    assert migration_run is not None
    assert migration_run.status == "FAILED"
    assert migration_run.error_message == "Intentional migration failure"

def test_list_and_get_project_migrations(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "migration-retrieval-test@pivot.dev",
            "password": "test_password_123",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "migration-retrieval-test@pivot.dev",
            "password": "test_password_123",
        },
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    project_response = client.post(
        "/api/projects",
        headers=headers,
        json={
            "name": "Migration Retrieval Test Project",
            "description": "Migration retrieval API test",
        },
    )
    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    migration_response = client.post(
        f"/api/projects/{project_id}/migrations",
        headers=headers,
        json={
            "source_sql": """
                CREATE TABLE products (
                    id INT PRIMARY KEY,
                    name VARCHAR(100)
                );
            """
        },
    )
    assert migration_response.status_code == 201

    migration_id = migration_response.json()["id"]

    list_response = client.get(
        f"/api/projects/{project_id}/migrations",
        headers=headers,
    )

    assert list_response.status_code == 200

    migrations = list_response.json()

    assert len(migrations) == 1
    assert migrations[0]["id"] == migration_id
    assert migrations[0]["project_id"] == project_id
    assert migrations[0]["status"] == "COMPLETED"

    detail_response = client.get(
        f"/api/projects/{project_id}/migrations/{migration_id}",
        headers=headers,
    )

    assert detail_response.status_code == 200

    detail = detail_response.json()

    assert detail["id"] == migration_id
    assert detail["project_id"] == project_id
    assert detail["status"] == "COMPLETED"
    assert detail["analysis_result"] is not None
    assert detail["migration_result"] is not None
    assert detail["ml_prediction"] is not None
    assert detail["ai_review"] is not None
