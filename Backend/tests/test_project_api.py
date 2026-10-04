def test_create_project_authenticated(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "project-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "project-test@pivot.dev",
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
            "name": "Test Migration Project",
            "description": "Automated API test project",
        },
    )

    assert project_response.status_code == 201

    data = project_response.json()

    assert data["name"] == "Test Migration Project"
    assert data["description"] == "Automated API test project"
    assert data["status"] == "DRAFT"
    assert "id" in data
    assert "user_id" in data

def test_create_project_without_authentication(client):
    response = client.post(
        "/api/projects",
        json={
            "name": "Unauthorized Project",
            "description": "This should not be created",
        },
    )

    assert response.status_code == 401

def test_user_cannot_access_another_users_project(client):
    # Create user 1
    register_user_1 = client.post(
        "/api/auth/register",
        json={
            "email": "owner@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_user_1.status_code == 201

    login_user_1 = client.post(
        "/api/auth/login",
        json={
            "email": "owner@pivot.dev",
            "password": "test_password_123",
        },
    )

    token_user_1 = login_user_1.json()["access_token"]

    # User 1 creates a project
    project_response = client.post(
        "/api/projects",
        headers={
            "Authorization": f"Bearer {token_user_1}",
        },
        json={
            "name": "Private Project",
            "description": "User 1 private project",
        },
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    # Create user 2
    register_user_2 = client.post(
        "/api/auth/register",
        json={
            "email": "other@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_user_2.status_code == 201

    login_user_2 = client.post(
        "/api/auth/login",
        json={
            "email": "other@pivot.dev",
            "password": "test_password_123",
        },
    )

    token_user_2 = login_user_2.json()["access_token"]

    # User 2 tries to access User 1's project
    response = client.get(
        f"/api/projects/{project_id}",
        headers={
            "Authorization": f"Bearer {token_user_2}",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found."

def test_create_project_rejects_empty_name(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "project-empty-name@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "project-empty-name@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.post(
        "/api/projects",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "   "},
    )

    assert response.status_code == 422


def test_create_project_rejects_name_over_255_characters(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "project-long-name@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "project-long-name@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.post(
        "/api/projects",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "a" * 256},
    )

    assert response.status_code == 422


def test_update_project_rejects_empty_name(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "project-update-validation@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    token = client.post(
        "/api/auth/login",
        json={
            "email": "project-update-validation@pivot.dev",
            "password": "test_password_123",
        },
    ).json()["access_token"]

    project_response = client.post(
        "/api/projects",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Valid Project"},
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    response = client.put(
        f"/api/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "   "},
    )

    assert response.status_code == 422