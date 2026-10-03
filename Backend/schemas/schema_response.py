from pydantic import BaseModel, Field
from typing import Optional


class ColumnAnalysis(BaseModel):
    name: str
    source_type: str
    target_type: Optional[str] = None
    migration_rule: Optional[str] = None
    unsigned: bool = False
    mapping_error: Optional[str] = None
    nullable: bool = True
    default: Optional[str] = None
    auto_increment: bool = False
    on_update: Optional[str] = None


class ForeignKeyAnalysis(BaseModel):
    column: str
    references_table: str
    references_column: str


class ConstraintAnalysis(BaseModel):
    type: str
    column: Optional[str] = None
    condition: Optional[str] = None
    name: Optional[str] = None


class IndexAnalysis(BaseModel):
    name: str
    columns: list[str]
    unique: bool = False
    primary: bool = False


class TriggerAnalysis(BaseModel):
    name: str


class UnsupportedFeatureAnalysis(BaseModel):
    type: str
    name: Optional[str] = None


class TableAnalysis(BaseModel):
    name: str
    columns: list[ColumnAnalysis]
    primary_keys: list[str] = Field(default_factory=list)
    foreign_keys: list[ForeignKeyAnalysis] = Field(default_factory=list)
    constraints: list[ConstraintAnalysis] = Field(default_factory=list)
    indexes: list[IndexAnalysis] = Field(default_factory=list)
    triggers: list[TriggerAnalysis] = Field(default_factory=list)
    unsupported_features: list[UnsupportedFeatureAnalysis] = Field(
        default_factory=list
    )

class AnalysisIssue(BaseModel):
    type: str
    severity: str
    table: Optional[str] = None
    column: Optional[str] = None
    message: str

class AnalysisSummary(BaseModel):
    table_count: int = 0
    column_count: int = 0
    primary_key_count: int = 0
    foreign_key_count: int = 0
    constraint_count: int = 0
    index_count: int = 0
    trigger_count: int = 0
    unsupported_feature_count: int = 0
    mapped_column_count: int = 0
    unsupported_column_count: int = 0

class RiskAnalysis(BaseModel):
    risk_level: str
    risk_count: int = 0
    risks: list[dict] = Field(default_factory=list)

class SchemaAnalysisResponse(BaseModel):
    database: str
    summary: AnalysisSummary
    issues: list[AnalysisIssue] = Field(default_factory=list)
    risk: RiskAnalysis
    tables: list[TableAnalysis]

class SchemaDiffSummary(BaseModel):

    added_tables: int = 0
    removed_tables: int = 0

    added_columns: int = 0
    removed_columns: int = 0
    changed_columns: int = 0

    changed_primary_keys: int = 0
    added_primary_keys: int = 0
    removed_primary_keys: int = 0

    changed_foreign_keys: int = 0
    added_foreign_keys: int = 0
    removed_foreign_keys: int = 0

    changed_unique_constraints: int = 0
    added_unique_constraints: int = 0
    removed_unique_constraints: int = 0

    changed_checks: int = 0
    added_checks: int = 0
    removed_checks: int = 0

    changed_indexes: int = 0
    added_indexes: int = 0
    removed_indexes: int = 0


class SchemaDiffResponse(BaseModel):

    summary: SchemaDiffSummary
    changes: list[dict] = Field(default_factory=list)