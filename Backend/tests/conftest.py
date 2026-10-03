import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text

from app.database import get_db
from app.main import app


TEST_DATABASE_URL = (
    "postgresql://postgres:pivot_password@localhost:5432/pivot_test_db"
)

test_engine = create_engine(
    TEST_DATABASE_URL,
    pool_pre_ping=True,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()

    try:
        db.execute(
            text(
                "TRUNCATE TABLE projects, users "
                "RESTART IDENTITY CASCADE"
            )
        )
        db.commit()

        yield db

    finally:
        db.rollback()
        db.execute(
            text(
                "TRUNCATE TABLE projects, users "
                "RESTART IDENTITY CASCADE"
            )
        )
        db.commit()
        db.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()