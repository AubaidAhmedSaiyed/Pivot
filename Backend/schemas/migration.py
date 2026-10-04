from pydantic import BaseModel, Field
from schemas.schema_response import SchemaAnalysisResponse


class MigrationCreateRequest(BaseModel):
    source_sql: str


class MLPredictionResponse(BaseModel):
    complexity: str


class MigrationTransformationResponse(BaseModel):
    type: str
    table: str | None = None
    column: str | None = None
    source: str | None = None
    target: str | None = None
    rule: str | None = None
    action: str | None = None


class MigrationResultResponse(BaseModel):
    target_database: str
    sql: str
    transformations: list[MigrationTransformationResponse]
    warnings: list[str]


class AIReviewIssueResponse(BaseModel):
    type: str
    severity: str
    explanation: str
    recommendation: str


class AIReviewResponse(BaseModel):
    summary: str
    issues: list[AIReviewIssueResponse] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    error: str | None = None


class MigrationDecisionResponse(BaseModel):
    type: str
    table: str | None = None
    column: str | None = None
    source: str | None = None
    target: str | None = None
    rule: str | None = None
    action: str | None = None


class MigrationReviewResponse(BaseModel):
    summary: str
    overall_assessment: str
    issues: list[dict] = Field(default_factory=list)
    migration_decisions: list[MigrationDecisionResponse] = Field(
        default_factory=list
    )
    manual_review_required: bool
    recommendations: list[str] = Field(default_factory=list)
    ai_review: AIReviewResponse


class MigrationRunResponse(BaseModel):
    id: int
    project_id: int
    status: str
    source_sql: str
    analysis_result: SchemaAnalysisResponse | None = None
    migration_result: MigrationResultResponse | None = None
    ml_prediction: MLPredictionResponse | None = None
    ai_review: MigrationReviewResponse | None = None
    