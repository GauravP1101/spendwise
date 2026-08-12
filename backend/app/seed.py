from datetime import date
from decimal import Decimal

from sqlalchemy import select

from app.db.database import engine
from app.db.session import Session
from app.models.category import Category
from app.models.subscription import Subscription
from app.models.transaction import Transaction
from app.models.user import User
from app.core.security import hash_password

DEMO_EMAIL = "demo@spendwise.com"

def seed():
    with Session(engine) as db:
        existing_user = db.scalar(
            select(User).where(User.email == DEMO_EMAIL)
        )

        if existing_user:
            print("Demo user already exists.")
            return

        user = User(
            email=DEMO_EMAIL,
            password_hash=hash_password("DemoPassword123!"),
        )

        db.add(user)
        db.flush()

        categories = {}

        category_names = [
            ("Food", "expense"),
            ("Housing", "expense"),
            ("Transportation", "expense"),
            ("Shopping", "expense"),
            ("Entertainment", "expense"),
            ("Salary", "income"),
        ]

        for name, category_type in category_names:
            category = Category(
                user_id=user.id,
                name=name,
                type=category_type,
            )

            db.add(category)
            db.flush()

            categories[name] = category.id

        transactions = [
            (
                categories["Salary"],
                Decimal("4800.00"),
                "income",
                "Monthly Salary",
                date(2026, 8, 1),
            ),
            (
                categories["Housing"],
                Decimal("1450.00"),
                "expense",
                "Rent",
                date(2026, 8, 2),
            ),
            (
                categories["Food"],
                Decimal("84.32"),
                "expense",
                "Grocery Store",
                date(2026, 8, 5),
            ),
            (
                categories["Transportation"],
                Decimal("28.40"),
                "expense",
                "Uber",
                date(2026, 8, 7),
            ),
            (
                categories["Shopping"],
                Decimal("67.20"),
                "expense",
                "Amazon",
                date(2026, 8, 8),
            ),
            (
                categories["Entertainment"],
                Decimal("48.00"),
                "expense",
                "Restaurant",
                date(2026, 8, 9),
            ),
        ]

        for (
            category_id,
            amount,
            transaction_type,
            description,
            transaction_date,
        ) in transactions:
            db.add(
                Transaction(
                    user_id=user.id,
                    category_id=category_id,
                    amount=amount,
                    type=transaction_type,
                    description=description,
                    transaction_date=transaction_date,
                )
            )

        subscriptions = [
            ("Netflix", Decimal("22.99"), date(2026, 8, 15)),
            ("Spotify", Decimal("11.99"), date(2026, 8, 20)),
            ("GitHub", Decimal("10.00"), date(2026, 8, 22)),
            ("Gym", Decimal("35.00"), date(2026, 9, 1)),
        ]

        for name, amount, next_payment_date in subscriptions:
            db.add(
                Subscription(
                    user_id=user.id,
                    name=name,
                    amount=amount,
                    billing_cycle="monthly",
                    next_payment_date=next_payment_date,
                    is_active=True,
                )
            )

        db.commit()

        print("Demo data created successfully.")


if __name__ == "__main__":
    seed()