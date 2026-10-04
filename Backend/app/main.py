from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from pydantic import BaseModel

from services.schema_analysis import analyze_schema
from ml.model_predictor import predict_complexity
from schemas.schema_response import SchemaAnalysisResponse
from services.sql_generator import generate_postgresql_sql
from services.ai_migration_reviewer import review_migration
from services.schema_diff import diff_schemas
from schemas.schema_response import SchemaDiffResponse
from services.schema_parser import parse_schema

from routers.auth import router as auth_router
from routers.projects import router as projects_router
from routers.migrations import router as migrations_router

app = FastAPI(
    title = "Pivot API",
    description = "AI-Powered Database Schema Migration",
    version = "1.0.0"
)

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(migrations_router)

@app.get("/")
def root():
    return {
        "message":"Pivot Backend is running"
    }

@app.get("/health")
def health_check():
    return{
        "status" : "healthy"
    }

@app.get("/health/db")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return{
            "Status" : "healthy",
            "database" : "connected"
        }

    except Exception as e:
        return{
            "status" : "unhealthy",
            "database" : "disconnected",
            "error" : str(e)
        }

class SchemaRequest(BaseModel):
    sql: str

class SchemaDiffRequest(BaseModel):
    source_sql: str
    target_sql: str

@app.post(
    "/api/schema/analyze",
    response_model=SchemaAnalysisResponse
)
def analyze_schema_endpoint(request: SchemaRequest):
    return analyze_schema(request.sql)

@app.post(
    "/api/schema/diff",
    response_model=SchemaDiffResponse
)
def schema_diff_endpoint(request: SchemaDiffRequest):
    source_schema = parse_schema(
        request.source_sql,
        dialect="mysql"
    )

    target_schema = parse_schema(
        request.target_sql,
        dialect="postgres"
    )

    return diff_schemas(
        source_schema,
        target_schema
    )

@app.post("/api/ml/predict-complexity")
def predict_schema_complexity(request: SchemaRequest):
    """
    Predict migration complexity using the trained ML model.
    """

    prediction = predict_complexity(request.sql)

    return {
        "complexity": prediction
    }

@app.post("/api/migration/generate-sql")
def generate_migration_sql(request: SchemaRequest):
    analyzed_schema = analyze_schema(request.sql)
    migration_result = generate_postgresql_sql(analyzed_schema)
    complexity = predict_complexity(request.sql)

    return {
        "analysis": analyzed_schema,
        "migration": migration_result,
        "ml_prediction": {
            "complexity": complexity
        }
    }

@app.post("/api/migration/review")
def review_migration_endpoint(request: SchemaRequest):
    analyzed_schema = analyze_schema(request.sql)
    migration_result = generate_postgresql_sql(analyzed_schema)

    review = review_migration(
        analyzed_schema,
        migration_result
    )

    return {
        "analysis": analyzed_schema,
        "migration": migration_result,
        "review": review
    }
