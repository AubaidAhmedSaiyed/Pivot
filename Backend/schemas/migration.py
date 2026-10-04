from pydantic import BaseModel


class MigrationCreateRequest(BaseModel):
    source_sql: str


class MigrationRunResponse(BaseModel):
    id: int
    project_id: int
    status: str
    source_sql: str
    analysis_result: dict | None = None
    migration_result: dict | None = None
    ml_prediction: dict | None = None
    ai_review: dict | None = None
    error_message: str | None = None