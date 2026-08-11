from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal
    month: int
    year: int


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BudgetBase):
    pass


class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)