from fastapi import FastAPI
from sqlalchemy import text

from app.api.routes.auth import router as auth_router
from app.api.routes.transaction import router as transaction_router
from app.db.database import engine
from app.api.routes.category import router as category_router
from app.api.routes.subscription import router as subscription_router


app = FastAPI(
    title="SpendWise API",
    version="1.0.0",
)


app.include_router(auth_router)
app.include_router(category_router)
app.include_router(transaction_router)
app.include_router(subscription_router)


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": result.scalar(),
    }