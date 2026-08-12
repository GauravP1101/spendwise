from datetime import date

from sqlalchemy import extract, func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction


def get_analytics_summary(
    db: Session,
    user_id: int,
) -> dict:
    current_date = date.today()

    monthly_rows = db.execute(
        select(
            extract("year", Transaction.transaction_date).label("year"),
            extract("month", Transaction.transaction_date).label("month"),
            Transaction.type,
            func.sum(Transaction.amount).label("amount"),
        )
        .where(
            Transaction.user_id == user_id,
            Transaction.transaction_date >= date(
                current_date.year - 1,
                current_date.month,
                1,
            ),
        )
        .group_by(
            extract("year", Transaction.transaction_date),
            extract("month", Transaction.transaction_date),
            Transaction.type,
        )
        .order_by(
            extract("year", Transaction.transaction_date),
            extract("month", Transaction.transaction_date),
        )
    ).all()

    monthly_data: dict[tuple[int, int], dict[str, object]] = {}

    for row in monthly_rows:
        key = (int(row.year), int(row.month))

        if key not in monthly_data:
            monthly_data[key] = {
                "income": 0,
                "expenses": 0,
            }

        monthly_data[key][row.type] = row.amount

    monthly = []

    for (year, month), values in monthly_data.items():
        monthly.append(
            {
                "month": date(year, month, 1).strftime("%b %Y"),
                "income": values.get("income", 0),
                "expenses": values.get("expenses", 0),
            }
        )

    category_rows = db.execute(
        select(
            Category.name,
            func.sum(Transaction.amount).label("amount"),
        )
        .join(
            Transaction,
            Transaction.category_id == Category.id,
        )
        .where(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )
        .group_by(Category.name)
        .order_by(func.sum(Transaction.amount).desc())
    ).all()

    categories = [
        {
            "category_name": row.name,
            "amount": row.amount,
        }
        for row in category_rows
    ]

    return {
        "monthly": monthly,
        "categories": categories,
    }