from decimal import Decimal

from pydantic import BaseModel


class CategorySpending(BaseModel):
    category_id: int
    category_name: str
    amount: Decimal


class UpcomingPayment(BaseModel):
    id: int
    name: str
    amount: Decimal
    next_payment_date: str


class DashboardSummary(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    remaining: Decimal
    subscription_cost: Decimal
    category_spending: list[CategorySpending]
    upcoming_payments: list[UpcomingPayment]
    recent_transactions: list[dict]