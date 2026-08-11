from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
    SubscriptionUpdate,
)
from app.services.subscription import (
    create_subscription,
    delete_subscription,
    get_subscription,
    get_subscriptions,
    update_subscription,
)

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


@router.get(
    "",
    response_model=list[SubscriptionResponse],
)
def list_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_subscriptions(
        db=db,
        user_id=current_user.id,
    )


@router.post(
    "",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_subscription(
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_subscription(
        db=db,
        user_id=current_user.id,
        subscription_data=subscription_data,
    )


@router.get(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
)
def read_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscription = get_subscription(
        db=db,
        subscription_id=subscription_id,
        user_id=current_user.id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )

    return subscription


@router.put(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
)
def edit_subscription(
    subscription_id: int,
    subscription_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscription = get_subscription(
        db=db,
        subscription_id=subscription_id,
        user_id=current_user.id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )

    return update_subscription(
        db=db,
        subscription=subscription,
        subscription_data=subscription_data,
    )


@router.delete(
    "/{subscription_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscription = get_subscription(
        db=db,
        subscription_id=subscription_id,
        user_id=current_user.id,
    )

    if subscription is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found",
        )

    delete_subscription(
        db=db,
        subscription=subscription,
    )