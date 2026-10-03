def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "auth-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "auth-test@pivot.dev"
    assert data["role"] == "USER"
    assert "id" in data
    assert "password" not in data
    assert "password_hash" not in data

def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@pivot.dev",
        "password": "test_password_123",
    }

    first_response = client.post(
        "/api/auth/register",
        json=payload,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/auth/register",
        json=payload,
    )

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Email is already registered."

def test_login_user(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "login-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "login-test@pivot.dev",
            "password": "test_password_123",
        },
    )

    assert login_response.status_code == 200

    data = login_response.json()

    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "login-test@pivot.dev"
    assert data["user"]["role"] == "USER"

def test_login_wrong_password(client):
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "wrong-password@pivot.dev",
            "password": "correct_password_123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong-password@pivot.dev",
            "password": "wrong_password_123",
        },
    )

    assert login_response.status_code == 401
    assert login_response.json()["detail"] == "Invalid email or password."