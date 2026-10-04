from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.dependencies import get_current_user
from models.user import User
from schemas.migration import MigrationCreateRequest, MigrationRunResponse
from services.project_service import get_user_project
from services.migration_run_service import (
    create_migration_run,
    complete_migration_run,
    fail_migration_run,
    get_project_migration_runs,
    get_project_migration_run,
)
from ml.model_predictor import predict_complexity
from services.schema_analysis import analyze_schema
from services.sql_generator import generate_postgresql_sql
from services.ai_migration_reviewer import review_migration
from fastapi.responses import Response
from services.report_service import generate_migration_report

router = APIRouter(
    prefix="/api/projects",
    tags=["Migrations"],
)


@router.post(
    "/{project_id}/migrations",
    response_model=MigrationRunResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_migration_endpoint(
    project_id: int,
    request: MigrationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = get_user_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    migration_run = create_migration_run(
        db=db,
        project_id=project.id,
        source_sql=request.source_sql,
    )

    try:
        analysis_result = analyze_schema(request.source_sql)

        migration_result = generate_postgresql_sql(analysis_result)

        complexity = predict_complexity(request.source_sql)

        ml_prediction = {
            "complexity": complexity,
        }

        ai_review = review_migration(
            analysis_result,
            migration_result,
        )

        completed_run = complete_migration_run(
            db=db,
            migration_run=migration_run,
            analysis_result=analysis_result,
            migration_result=migration_result,
            ml_prediction=ml_prediction,
            ai_review=ai_review,
        )

        return completed_run

    except Exception as exc:
        failed_run = fail_migration_run(
            db=db,
            migration_run=migration_run,
            error_message=str(exc),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Migration processing failed.",
        ) from exc

@router.get(
    "/{project_id}/migrations",
    response_model=list[MigrationRunResponse],
)
def list_migrations_endpoint(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = get_user_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return get_project_migration_runs(
        db=db,
        project_id=project.id,
    )

@router.get(
    "/{project_id}/migrations/{migration_id}",
    response_model=MigrationRunResponse,
)
def get_migration_endpoint(
    project_id: int,
    migration_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = get_user_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    migration_run = get_project_migration_run(
        db=db,
        migration_run_id=migration_id,
        project_id=project.id,
    )

    if migration_run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Migration run not found.",
        )

    return migration_run

@router.get(
    "/{project_id}/migrations/{migration_id}/report",
)
def download_migration_report(
    project_id: int,
    migration_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = get_user_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    migration_run = get_project_migration_run(
        db=db,
        migration_run_id=migration_id,
        project_id=project.id,
    )

    if migration_run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Migration run not found.",
        )

    pdf_bytes = generate_migration_report(migration_run)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="pivot-migration-{migration_id}.pdf"'
            )
        },
    )
