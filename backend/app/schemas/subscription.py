from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class SubscriptionBase(BaseModel):
    category_id: int | None = None
    name: str
    amount: Decimal
    billing_cycle: str
    next_payment_date: date
    is_active: bool = True


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(SubscriptionBase):
    pass


class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)