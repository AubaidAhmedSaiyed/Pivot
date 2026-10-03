from sqlalchemy import select
from sqlalchemy.orm import Session

from models.project import Project


def create_project(
    db: Session,
    user_id: int,
    name: str,
    description: str | None = None,
) -> Project:
    project = Project(
        user_id=user_id,
        name=name,
        description=description,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_user_projects(
    db: Session,
    user_id: int,
) -> list[Project]:
    statement = (
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_user_project(
    db: Session,
    project_id: int,
    user_id: int,
) -> Project | None:
    statement = select(Project).where(
        Project.id == project_id,
        Project.user_id == user_id,
    )

    return db.scalar(statement)


def update_project(
    db: Session,
    project: Project,
    name: str | None = None,
    description: str | None = None,
    status: str | None = None,
) -> Project:
    if name is not None:
        project.name = name

    if description is not None:
        project.description = description

    if status is not None:
        project.status = status

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    project: Project,
) -> None:
    db.delete(project)
    db.commit()