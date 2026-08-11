from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate


def get_budgets(
    db: Session,
    user_id: int,
    month: int | None = None,
    year: int | None = None,
) -> list[Budget]:
    statement = select(Budget).where(Budget.user_id == user_id)

    if month is not None:
        statement = statement.where(Budget.month == month)

    if year is not None:
        statement = statement.where(Budget.year == year)

    statement = statement.order_by(Budget.year.desc(), Budget.month.desc())

    return list(db.scalars(statement).all())


def get_budget(
    db: Session,
    budget_id: int,
    user_id: int,
) -> Budget | None:
    statement = select(Budget).where(
        Budget.id == budget_id,
        Budget.user_id == user_id,
    )

    return db.scalar(statement)


def create_budget(
    db: Session,
    user_id: int,
    budget_data: BudgetCreate,
) -> Budget:
    budget = Budget(
        user_id=user_id,
        category_id=budget_data.category_id,
        amount=budget_data.amount,
        month=budget_data.month,
        year=budget_data.year,
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return budget


def update_budget(
    db: Session,
    budget: Budget,
    budget_data: BudgetUpdate,
) -> Budget:
    budget.category_id = budget_data.category_id
    budget.amount = budget_data.amount
    budget.month = budget_data.month
    budget.year = budget_data.year

    db.commit()
    db.refresh(budget)

    return budget


def delete_budget(
    db: Session,
    budget: Budget,
) -> None:
    db.delete(budget)
    db.commit()