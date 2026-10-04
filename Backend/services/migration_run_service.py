from sqlalchemy import select
from sqlalchemy.orm import Session

from models.migration_run import MigrationRun


def create_migration_run(
    db: Session,
    project_id: int,
    source_sql: str,
) -> MigrationRun:
    migration_run = MigrationRun(
        project_id=project_id,
        source_sql=source_sql,
        status="RUNNING",
    )

    db.add(migration_run)
    db.commit()
    db.refresh(migration_run)

    return migration_run


def complete_migration_run(
    db: Session,
    migration_run: MigrationRun,
    analysis_result: dict,
    migration_result: dict,
    ml_prediction: dict,
    ai_review: dict | None = None,
) -> MigrationRun:
    migration_run.status = "COMPLETED"
    migration_run.analysis_result = analysis_result
    migration_run.migration_result = migration_result
    migration_run.ml_prediction = ml_prediction
    migration_run.ai_review = ai_review
    migration_run.error_message = None

    db.commit()
    db.refresh(migration_run)

    return migration_run


def fail_migration_run(
    db: Session,
    migration_run: MigrationRun,
    error_message: str,
) -> MigrationRun:
    migration_run.status = "FAILED"
    migration_run.error_message = error_message

    db.commit()
    db.refresh(migration_run)

    return migration_run


def get_project_migration_runs(
    db: Session,
    project_id: int,
) -> list[MigrationRun]:
    statement = (
        select(MigrationRun)
        .where(MigrationRun.project_id == project_id)
        .order_by(MigrationRun.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_project_migration_run(
    db: Session,
    migration_run_id: int,
    project_id: int,
) -> MigrationRun | None:
    statement = select(MigrationRun).where(
        MigrationRun.id == migration_run_id,
        MigrationRun.project_id == project_id,
    )

    return db.scalar(statement)