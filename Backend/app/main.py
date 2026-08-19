from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from pydantic import BaseModel
from services.schema_parser import parse_schema

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


@app.post("/api/schema/analyze")
def analyze_schema(request: SchemaRequest):
    return parse_schema(request.sql)