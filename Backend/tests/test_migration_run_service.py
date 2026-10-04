from models.project import Project
from services.migration_run_service import (
    complete_migration_run,
    create_migration_run,
    fail_migration_run,
    get_project_migration_run,
    get_project_migration_runs,
)
from models.user import User


def create_test_project(db_session, name="Test Project"):
    user = User(
        email=f"{name.lower().replace(' ', '_')}@example.com",
        password_hash="test-password-hash",
        role="USER",
    )

    db_session.add(user)
    db_session.flush()

    project = Project(
        user_id=user.id,
        name=name,
        description="Migration run test project",
        status="DRAFT",
    )

    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)

    return project


def test_create_migration_run(db_session):
    project = create_test_project(db_session)

    migration_run = create_migration_run(
        db=db_session,
        project_id=project.id,
        source_sql="CREATE TABLE users (id INT PRIMARY KEY);",
    )

    assert migration_run.id is not None
    assert migration_run.project_id == project.id
    assert migration_run.status == "RUNNING"
    assert migration_run.source_sql == (
        "CREATE TABLE users (id INT PRIMARY KEY);"
    )


def test_complete_migration_run(db_session):
    project = create_test_project(db_session)

    migration_run = create_migration_run(
        db=db_session,
        project_id=project.id,
        source_sql="CREATE TABLE users (id INT PRIMARY KEY);",
    )

    analysis_result = {
        "tables": 1,
        "columns": 1,
    }

    migration_result = {
        "postgresql_sql": "CREATE TABLE users (id INTEGER PRIMARY KEY);"
    }

    ml_prediction = {
        "complexity": "LOW",
    }

    ai_review = {
        "summary": "Migration is straightforward.",
    }

    completed_run = complete_migration_run(
        db=db_session,
        migration_run=migration_run,
        analysis_result=analysis_result,
        migration_result=migration_result,
        ml_prediction=ml_prediction,
        ai_review=ai_review,
    )

    assert completed_run.status == "COMPLETED"
    assert completed_run.analysis_result == analysis_result
    assert completed_run.migration_result == migration_result
    assert completed_run.ml_prediction == ml_prediction
    assert completed_run.ai_review == ai_review
    assert completed_run.error_message is None


def test_fail_migration_run(db_session):
    project = create_test_project(db_session)

    migration_run = create_migration_run(
        db=db_session,
        project_id=project.id,
        source_sql="INVALID SQL",
    )

    failed_run = fail_migration_run(
        db=db_session,
        migration_run=migration_run,
        error_message="Schema parsing failed.",
    )

    assert failed_run.status == "FAILED"
    assert failed_run.error_message == "Schema parsing failed."


def test_get_project_migration_runs(db_session):
    project = create_test_project(db_session)

    first_run = create_migration_run(
        db=db_session,
        project_id=project.id,
        source_sql="CREATE TABLE first_table (id INT);",
    )

    second_run = create_migration_run(
        db=db_session,
        project_id=project.id,
        source_sql="CREATE TABLE second_table (id INT);",
    )

    runs = get_project_migration_runs(
        db=db_session,
        project_id=project.id,
    )

    run_ids = {run.id for run in runs}

    assert first_run.id in run_ids
    assert second_run.id in run_ids
    assert len(runs) == 2


def test_get_project_migration_run_is_project_scoped(db_session):
    project_one = create_test_project(db_session, "Project One")
    project_two = create_test_project(db_session, "Project Two")

    migration_run = create_migration_run(
        db=db_session,
        project_id=project_one.id,
        source_sql="CREATE TABLE users (id INT);",
    )

    found_run = get_project_migration_run(
        db=db_session,
        migration_run_id=migration_run.id,
        project_id=project_one.id,
    )

    wrong_project_run = get_project_migration_run(
        db=db_session,
        migration_run_id=migration_run.id,
        project_id=project_two.id,
    )

    assert found_run is not None
    assert found_run.id == migration_run.id
    assert wrong_project_run is None