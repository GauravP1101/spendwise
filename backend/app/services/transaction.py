from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_transactions(
    db: Session,
    user_id: int,
) -> list[Transaction]:
    statement = (
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .order_by(Transaction.transaction_date.desc())
    )

    return list(db.scalars(statement).all())


def get_transaction(
    db: Session,
    transaction_id: int,
    user_id: int,
) -> Transaction | None:
    statement = select(Transaction).where(
        Transaction.id == transaction_id,
        Transaction.user_id == user_id,
    )

    return db.scalar(statement)


def create_transaction(
    db: Session,
    user_id: int,
    transaction_data: TransactionCreate,
) -> Transaction:
    transaction = Transaction(
        user_id=user_id,
        category_id=transaction_data.category_id,
        amount=transaction_data.amount,
        type=transaction_data.type,
        description=transaction_data.description,
        transaction_date=transaction_data.transaction_date,
        notes=transaction_data.notes,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def update_transaction(
    db: Session,
    transaction: Transaction,
    transaction_data: TransactionUpdate,
) -> Transaction:
    transaction.category_id = transaction_data.category_id
    transaction.amount = transaction_data.amount
    transaction.type = transaction_data.type
    transaction.description = transaction_data.description
    transaction.transaction_date = transaction_data.transaction_date
    transaction.notes = transaction_data.notes

    db.commit()
    db.refresh(transaction)

    return transaction


def delete_transaction(
    db: Session,
    transaction: Transaction,
) -> None:
    db.delete(transaction)
    db.commit()