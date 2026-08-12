# SpendWise

SpendWise is a full-stack personal finance application for tracking income, expenses, recurring subscriptions, monthly budgets, and spending trends from a single dashboard.

The project focuses on providing a simple alternative to spreadsheets and disconnected financial tracking tools while maintaining a clean architecture that can support future automation features.

## Problem Statement

Personal financial information is often spread across bank applications, spreadsheets, notes, and subscription services. This makes basic questions harder to answer:

* How much did I spend this month?
* Which categories account for most of my spending?
* How much am I paying for recurring subscriptions?
* Am I staying within my monthly budgets?
* How does my income compare with my expenses?

SpendWise provides a centralized dashboard where users can manually organize and analyze this information without requiring access to their bank accounts.

## Features

### Authentication

* User registration and login
* Secure password hashing using Argon2
* JWT-based authentication
* Protected frontend routes
* User-specific financial data
* Automatic creation of default financial categories

### Dashboard

* Total income
* Total expenses
* Remaining balance
* Monthly subscription costs
* Spending by category
* Upcoming subscription payments
* Recent transactions

### Transactions

* Record income and expenses
* Assign transactions to categories
* Search transaction history
* Track transaction dates and notes
* Delete transactions
* Separate income and expense categories

### Subscriptions

* Track recurring payments
* Monthly, yearly, and weekly billing cycles
* Upcoming payment dates
* Estimated monthly recurring cost
* Active subscription tracking

### Budgets

* Create monthly category budgets
* Select budget month and year
* Track category-specific spending limits
* Prevent duplicate budgets for the same category and period

### Analytics

* Income vs. expense visualization
* Spending by category
* Historical financial trends
* Interactive charts using Recharts

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* Recharts

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Alembic
* PyJWT
* pwdlib / Argon2

### Database

* PostgreSQL

### Development

* VS Code
* Git
* GitHub
* pytest
* ESLint

## Architecture

```text
                     Browser
                        |
                        v
               React + TypeScript
                        |
                   Axios / REST
                        |
                 JWT Bearer Token
                        |
                        v
                     FastAPI
                        |
              ---------------------
              |         |         |
              v         v         v
          Routes     Services   Pydantic
              |
              v
          SQLAlchemy
              |
              v
          PostgreSQL
```

The frontend communicates with FastAPI through REST endpoints.

Authenticated requests include a JWT bearer token. FastAPI identifies the current user from the token and scopes financial records to that user before querying PostgreSQL through SQLAlchemy.

## Project Structure

```text
spendwise/
|
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
|
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── main.py
│   │   └── seed.py
│   ├── alembic/
│   ├── tests/
│   ├── .env.example
│   └── alembic.ini
|
├── .gitignore
└── README.md
```

## Database Design

The application uses five primary entities:

```text
User
 |
 +---- Category
 |
 +---- Transaction
 |
 +---- Subscription
 |
 +---- Budget
```

### User

Stores account information and authentication credentials.

```text
id
email
password_hash
created_at
updated_at
```

Passwords are never stored directly. Only Argon2 password hashes are persisted.

### Category

Stores user-specific income and expense categories.

Examples:

```text
Food             expense
Housing          expense
Transportation   expense
Shopping         expense
Salary           income
Freelance        income
```

Default categories are automatically created when a user registers.

### Transaction

Stores individual income and expense records.

```text
id
user_id
category_id
amount
type
description
transaction_date
notes
created_at
updated_at
```

Financial amounts use PostgreSQL numeric values instead of floating-point values.

### Subscription

Stores recurring payments.

```text
id
user_id
category_id
name
amount
billing_cycle
next_payment_date
is_active
created_at
updated_at
```

### Budget

Stores monthly spending limits.

```text
id
user_id
category_id
amount
month
year
created_at
updated_at
```

A database constraint prevents users from creating multiple budgets for the same category, month, and year.

## API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Categories

```text
GET  /categories
POST /categories
```

### Transactions

```text
GET    /transactions
POST   /transactions
GET    /transactions/{id}
PUT    /transactions/{id}
DELETE /transactions/{id}
```

### Subscriptions

```text
GET    /subscriptions
POST   /subscriptions
GET    /subscriptions/{id}
PUT    /subscriptions/{id}
DELETE /subscriptions/{id}
```

### Budgets

```text
GET    /budgets
POST   /budgets
GET    /budgets/{id}
PUT    /budgets/{id}
DELETE /budgets/{id}
```

### Dashboard

```text
GET /dashboard/summary
```

### Analytics

```text
GET /analytics/summary
```

## Security

SpendWise implements several basic security controls:

* Passwords are hashed using Argon2 before storage.
* Authentication uses signed JWT access tokens.
* Protected API endpoints resolve the authenticated user from the token.
* Financial queries are scoped using the authenticated user's ID.
* Clients cannot specify another user's ID when creating financial records.
* Category ownership is validated before transactions are created.
* Database credentials and JWT secrets are stored in environment variables.
* `.env` files are excluded from Git.

## Running Locally

### Prerequisites

Install:

* Node.js
* npm
* Python
* PostgreSQL
* Git

### 1. Clone the repository

```bash
git clone https://github.com/GauravP1101/spendwise.git
cd spendwise
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named:

```text
spendwise
```

### 3. Configure the backend

Navigate to:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies required by the project.

Create:

```text
backend/.env
```

using `backend/.env.example` as the template.

Example:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/spendwise
JWT_SECRET=YOUR_SECURE_RANDOM_SECRET
```

Do not commit `.env`.

### 4. Run database migrations

From `backend`:

```bash
alembic upgrade head
```

### 5. Start FastAPI

```bash
python -m fastapi dev app/main.py
```

The API runs locally at:

```text
http://localhost:8000
```

FastAPI API documentation is available at:

```text
http://localhost:8000/docs
```

### 6. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

## Demo Data

A development seed script is included:

```text
backend/app/seed.py
```

From the backend directory:

```bash
python -m app.seed
```

This creates realistic sample transactions, subscriptions, and categories for local development and UI testing.

## Testing

### Backend

Run:

```bash
python -m pytest -v
```

The test suite currently covers critical security behavior and required API route registration.

### Frontend linting

```bash
npm run lint
```

### Frontend production build

```bash
npm run build
```

## Key Engineering Decisions

### User-scoped financial data

Financial records are always queried using the authenticated user's ID. This prevents users from retrieving another user's transactions, subscriptions, or budgets by modifying request identifiers.

### Decimal financial values

Financial amounts are stored using PostgreSQL `NUMERIC` values rather than floating-point values to avoid precision issues with monetary data.

### Backend aggregation

Dashboard and analytics calculations are performed by the backend rather than repeatedly recalculated by individual React components.

This keeps aggregation logic centralized and reduces unnecessary client-side processing.

### Database migrations

Alembic manages database schema changes so the database structure can evolve through version-controlled migrations instead of manual modifications.

### Default categories

Standard expense and income categories are automatically created during registration so new users can immediately begin entering transactions.

## Future AI Automation

The current version intentionally does not depend on AI.

The architecture leaves room for automation features that could reduce manual financial organization in future versions.

### Automatic Transaction Categorization

Given a transaction such as:

```text
CHIPOTLE 1832
$18.42
```

a future model could suggest:

```text
Category: Food
```

with the user confirming or changing the suggestion.

### Recurring Payment Detection

Transaction history could be analyzed for repeated merchants, amounts, and dates to identify potential subscriptions automatically.

### Receipt Extraction

Users could upload a receipt and have structured fields extracted:

```text
Merchant
Date
Amount
Suggested Category
```

The user would review the extracted information before creating the transaction.

### Spending Summaries

Financial activity could be summarized into observations such as:

```text
Dining expenses increased compared with your recent monthly average.
```

AI would assist with organization and interpretation rather than making financial decisions for the user.

## Scope

SpendWise is intentionally designed as a focused personal finance tracker.

The project does not currently include:

* Bank account integrations
* Payment processing
* Investment management
* Credit monitoring
* Financial advice
* Tax preparation
* Mobile applications
* Automated AI financial decisions

This keeps the project focused on transaction management, budgeting, subscriptions, analytics, and full-stack application development.

## Author

**Gaurav Patel**

GitHub: `GauravP1101`
