from fastapi import FastAPI

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
