from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.dependencies import get_current_user
from models.user import User
from schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectResponse,
)
from services.project_service import (
    create_project,
    get_user_projects,
    get_user_project,
    update_project,
    delete_project,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_endpoint(
    request: ProjectCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_project(
        db=db,
        user_id=current_user.id,
        name=request.name,
        description=request.description,
    )


@router.get(
    "",
    response_model=list[ProjectResponse],
)
def list_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_projects(
        db=db,
        user_id=current_user.id,
    )

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
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

    return project

@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project_endpoint(
    project_id: int,
    request: ProjectUpdateRequest,
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

    return update_project(
        db=db,
        project=project,
        name=request.name,
        description=request.description,
        status=request.status,
    )

@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project_endpoint(
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

    delete_project(
        db=db,
        project=project,
    )

    return None