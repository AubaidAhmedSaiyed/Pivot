from sqlalchemy import select
from sqlalchemy.orm import Session

from models.user import User
from services.auth_service import hash_password


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)


def create_user(
    db: Session,
    email: str,
    password: str,
) -> User:
    existing_user = get_user_by_email(db, email)

    if existing_user is not None:
        raise ValueError("Email is already registered.")

    user = User(
        email=email,
        password_hash=hash_password(password),
        role="USER",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user