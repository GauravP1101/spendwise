from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.services.budget import (
    create_budget,
    delete_budget,
    get_budget,
    get_budgets,
    update_budget,
)

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"],
)


@router.get(
    "",
    response_model=list[BudgetResponse],
)
def list_budgets(
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_budgets(
        db=db,
        user_id=current_user.id,
        month=month,
        year=year,
    )


@router.post(
    "",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_budget(
        db=db,
        user_id=current_user.id,
        budget_data=budget_data,
    )


@router.get(
    "/{budget_id}",
    response_model=BudgetResponse,
)
def read_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = get_budget(
        db=db,
        budget_id=budget_id,
        user_id=current_user.id,
    )

    if budget is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    return budget


@router.put(
    "/{budget_id}",
    response_model=BudgetResponse,
)
def edit_budget(
    budget_id: int,
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = get_budget(
        db=db,
        budget_id=budget_id,
        user_id=current_user.id,
    )

    if budget is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    return update_budget(
        db=db,
        budget=budget,
        budget_data=budget_data,
    )


@router.delete(
    "/{budget_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = get_budget(
        db=db,
        budget_id=budget_id,
        user_id=current_user.id,
    )

    if budget is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    delete_budget(
        db=db,
        budget=budget,
    )