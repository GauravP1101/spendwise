from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category


DEFAULT_CATEGORIES = [
    ("Food", "expense"),
    ("Housing", "expense"),
    ("Transportation", "expense"),
    ("Shopping", "expense"),
    ("Entertainment", "expense"),
    ("Health", "expense"),
    ("Utilities", "expense"),
    ("Other", "expense"),
    ("Salary", "income"),
    ("Freelance", "income"),
    ("Other Income", "income"),
]


def get_categories(
    db: Session,
    user_id: int,
) -> list[Category]:
    statement = (
        select(Category)
        .where(Category.user_id == user_id)
        .order_by(Category.name)
    )

    return list(db.scalars(statement).all())


def create_category(
    db: Session,
    user_id: int,
    name: str,
    category_type: str,
) -> Category:
    category = Category(
        user_id=user_id,
        name=name,
        type=category_type,
    )

    db.add(category)

    return category


def create_default_categories(
    db: Session,
    user_id: int,
) -> None:
    for name, category_type in DEFAULT_CATEGORIES:
        create_category(
            db=db,
            user_id=user_id,
            name=name,
            category_type=category_type,
        )