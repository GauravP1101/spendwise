from decimal import Decimal

from pydantic import BaseModel


class MonthlyAnalytics(BaseModel):
    month: str
    income: Decimal
    expenses: Decimal


class CategoryAnalytics(BaseModel):
    category_name: str
    amount: Decimal


class AnalyticsSummary(BaseModel):
    monthly: list[MonthlyAnalytics]
    categories: list[CategoryAnalytics]