from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from pydantic import BaseModel
from services.schema_analysis import analyze_schema
from ml.model_predictor import predict_complexity
from schemas.schema_response import SchemaAnalysisResponse
from services.sql_generator import generate_postgresql_sql

app = FastAPI(
    title = "Pivot API",
    description = "AI-Powered Database Schema Migration",
    version = "1.0.0"
)

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


@app.post(
    "/api/schema/analyze",
    response_model=SchemaAnalysisResponse
)
def analyze_schema_endpoint(request: SchemaRequest):
    return analyze_schema(request.sql)

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
    """
    Analyze MySQL schema and generate PostgreSQL migration SQL.
    """

    analyzed_schema = analyze_schema(request.sql)

    migration_result = generate_postgresql_sql(analyzed_schema)

    return {
        "analysis": analyzed_schema,
        "migration": migration_result
    }