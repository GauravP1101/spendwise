from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)


def get_subscriptions(
    db: Session,
    user_id: int,
) -> list[Subscription]:
    statement = (
        select(Subscription)
        .where(Subscription.user_id == user_id)
        .order_by(Subscription.next_payment_date)
    )

    return list(db.scalars(statement).all())


def get_subscription(
    db: Session,
    subscription_id: int,
    user_id: int,
) -> Subscription | None:
    statement = select(Subscription).where(
        Subscription.id == subscription_id,
        Subscription.user_id == user_id,
    )

    return db.scalar(statement)


def create_subscription(
    db: Session,
    user_id: int,
    subscription_data: SubscriptionCreate,
) -> Subscription:
    subscription = Subscription(
        user_id=user_id,
        category_id=subscription_data.category_id,
        name=subscription_data.name,
        amount=subscription_data.amount,
        billing_cycle=subscription_data.billing_cycle,
        next_payment_date=subscription_data.next_payment_date,
        is_active=subscription_data.is_active,
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


def update_subscription(
    db: Session,
    subscription: Subscription,
    subscription_data: SubscriptionUpdate,
) -> Subscription:
    subscription.category_id = subscription_data.category_id
    subscription.name = subscription_data.name
    subscription.amount = subscription_data.amount
    subscription.billing_cycle = subscription_data.billing_cycle
    subscription.next_payment_date = subscription_data.next_payment_date
    subscription.is_active = subscription_data.is_active

    db.commit()
    db.refresh(subscription)

    return subscription


def delete_subscription(
    db: Session,
    subscription: Subscription,
) -> None:
    db.delete(subscription)
    db.commit()