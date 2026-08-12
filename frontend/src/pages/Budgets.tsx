import { useEffect, useMemo, useState } from "react";

import {
  createBudget,
  deleteBudget,
  getBudgets,
  type Budget,
} from "../api/budgets";
import { getCategories, type Category } from "../api/categories";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function Budgets() {
  const today = new Date();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setError("");

      const [budgetData, categoryData] = await Promise.all([
        getBudgets(month, year),
        getCategories(),
      ]);

      setBudgets(budgetData);
      setCategories(categoryData);
    } catch {
      setError("Unable to load budgets.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [month, year]);

  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryId || !amount) {
      setError("Category and amount are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await createBudget({
        category_id: Number(categoryId),
        amount: Number(amount),
        month,
        year,
      });

      setCategoryId("");
      setAmount("");

      await loadData();
    } catch {
      setError(
        "Unable to create budget. A budget may already exist for this category and month.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setError("");

      await deleteBudget(id);

      setBudgets((current) => current.filter((budget) => budget.id !== id));
    } catch {
      setError("Unable to delete budget.");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>

        <p className="mt-1 text-gray-500">
          Set monthly spending limits by category.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Monthly Budget</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(totalBudget)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <label className="text-sm text-gray-500">Month</label>

          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(2000, index).toLocaleString("en-US", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <label className="text-sm text-gray-500">Year</label>

          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {[year - 1, year, year + 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Budget</h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>

              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select category</option>

                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Monthly Limit
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="500.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Budget"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Category Budgets
          </h2>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <div className="mt-6 rounded-lg bg-gray-50 p-8 text-center">
              <p className="font-medium text-gray-900">
                No budgets for this month
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add a spending limit for one of your categories.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {categoryMap.get(budget.category_id) ?? "Category"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Monthly spending limit
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(budget.amount)}
                    </p>

                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Budgets;
