from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.subscription import Subscription
from app.models.transaction import Transaction


def get_dashboard_summary(
    db: Session,
    user_id: int,
) -> dict:
    total_income = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "income",
        )
    )

    total_expenses = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )
    )

    subscription_cost = db.scalar(
        select(func.coalesce(func.sum(Subscription.amount), 0)).where(
            Subscription.user_id == user_id,
            Subscription.is_active.is_(True),
            Subscription.billing_cycle == "monthly",
        )
    )

    category_rows = db.execute(
        select(
            Category.id,
            Category.name,
            func.coalesce(func.sum(Transaction.amount), 0),
        )
        .join(
            Transaction,
            Transaction.category_id == Category.id,
        )
        .where(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )
        .group_by(Category.id, Category.name)
        .order_by(func.sum(Transaction.amount).desc())
    ).all()

    upcoming_rows = db.execute(
        select(
            Subscription.id,
            Subscription.name,
            Subscription.amount,
            Subscription.next_payment_date,
        )
        .where(
            Subscription.user_id == user_id,
            Subscription.is_active.is_(True),
            Subscription.next_payment_date >= date.today(),
        )
        .order_by(Subscription.next_payment_date)
        .limit(5)
    ).all()

    recent_transactions = db.execute(
        select(
            Transaction.id,
            Transaction.description,
            Transaction.amount,
            Transaction.type,
            Transaction.transaction_date,
        )
        .where(Transaction.user_id == user_id)
        .order_by(Transaction.transaction_date.desc())
        .limit(5)
    ).all()

    return {
        "total_income": Decimal(total_income),
        "total_expenses": Decimal(total_expenses),
        "remaining": Decimal(total_income) - Decimal(total_expenses),
        "subscription_cost": Decimal(subscription_cost),
        "category_spending": [
            {
                "category_id": row[0],
                "category_name": row[1],
                "amount": Decimal(row[2]),
            }
            for row in category_rows
        ],
        "upcoming_payments": [
            {
                "id": row[0],
                "name": row[1],
                "amount": Decimal(row[2]),
                "next_payment_date": row[3].isoformat(),
            }
            for row in upcoming_rows
        ],
        "recent_transactions": [
            {
                "id": row[0],
                "description": row[1],
                "amount": Decimal(row[2]),
                "type": row[3],
                "transaction_date": row[4].isoformat(),
            }
            for row in recent_transactions
        ],
    }