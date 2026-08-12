import { useEffect, useMemo, useState } from "react";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  type Transaction,
} from "../api/transactions";
import { getCategories, type Category } from "../api/categories";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [transactionData, categoryData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);

      setTransactions(transactionData);
      setCategories(categoryData);
    } catch {
      setError("Unable to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        const [transactionData, categoryData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);

        if (cancelled) {
          return;
        }

        setTransactions(transactionData);
        setCategories(categoryData);
      } catch {
        if (!cancelled) {
          setError("Unable to load transactions.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return transactions;
    }

    return transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(query),
    );
  }, [transactions, search]);

  const availableCategories = categories.filter(
    (category) => category.type === type,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryId || !amount || !description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await createTransaction({
        category_id: Number(categoryId),
        amount: Number(amount),
        type,
        description: description.trim(),
        transaction_date: transactionDate,
        notes: notes.trim() || undefined,
      });

      setDescription("");
      setAmount("");
      setNotes("");

      await loadData();
    } catch {
      setError("Unable to create transaction.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTransaction(id);

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id),
      );
    } catch {
      setError("Unable to delete transaction.");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>

        <p className="mt-1 text-gray-500">Track your income and expenses.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Transaction
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>

              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value as "income" | "expense");
                  setCategoryId("");
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="e.g. Grocery Store"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Amount</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>

              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select category</option>

                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>

              <input
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Transaction"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h2>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">
              Loading transactions...
            </p>
          ) : filteredTransactions.length === 0 ? (
            <div className="mt-8 rounded-lg bg-gray-50 p-8 text-center">
              <p className="font-medium text-gray-900">No transactions found</p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first transaction using the form.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                    <th className="pb-3 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b last:border-0">
                      <td className="py-4">
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>

                        <p className="text-xs capitalize text-gray-500">
                          {transaction.type}
                        </p>
                      </td>

                      <td className="py-4 text-gray-500">
                        {new Date(
                          transaction.transaction_date,
                        ).toLocaleDateString()}
                      </td>

                      <td
                        className={`py-4 text-right font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-sm text-gray-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Transactions;
