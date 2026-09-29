import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.nutrition import router as nutrition_router
from app.api.routes.diet_plans import router as diet_plan_router
from app.api.routes.auth import router as auth_router


app = FastAPI(
    title="NutriPlan API",
    description="Personalized Daily Diet Planner API",
    version="1.0.0"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:8443"
)

origins = [
    FRONTEND_URL,
    "http://localhost:8443",
    "http://127.0.0.1:8443",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(nutrition_router)
app.include_router(diet_plan_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to NutriPlan API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }