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


class SchemaAnalysisResponse(BaseModel):
    database: str
    summary: AnalysisSummary
    issues: list[AnalysisIssue] = Field(default_factory=list)
    tables: list[TableAnalysis]