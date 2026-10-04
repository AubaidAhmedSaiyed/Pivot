from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MigrationRun(Base):
    __tablename__ = "migration_runs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="COMPLETED",
    )

    source_sql: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    analysis_result: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    migration_result: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    ml_prediction: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    ai_review: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    project: Mapped["Project"] = relationship(
        back_populates="migration_runs",
    )