from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes.auth import router as auth_router
from app.api.routes.budget import router as budget_router
from app.api.routes.category import router as category_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.subscription import router as subscription_router
from app.api.routes.transaction import router as transaction_router
from app.db.database import engine


app = FastAPI(
    title="SpendWise API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(category_router)
app.include_router(transaction_router)
app.include_router(subscription_router)
app.include_router(budget_router)
app.include_router(dashboard_router)


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": result.scalar(),
    }