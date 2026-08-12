import { useEffect, useState } from "react";

import { getDashboardSummary, type DashboardSummary } from "../api/dashboard";

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-4 text-gray-500">Loading your finances...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-4 text-red-600">
          {error || "Unable to load dashboard."}
        </p>
      </div>
    );
  }

  const maxCategoryAmount = Math.max(
    ...data.category_spending.map((item) => Number(item.amount)),
    1,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-gray-500">
          Here's an overview of your finances.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data.total_income)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data.total_expenses)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data.remaining)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Subscriptions</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data.subscription_cost)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Monthly recurring cost</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Spending by Category
          </h2>

          <div className="mt-5 space-y-4">
            {data.category_spending.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses recorded yet.</p>
            ) : (
              data.category_spending.map((item) => {
                const percentage =
                  (Number(item.amount) / maxCategoryAmount) * 100;

                return (
                  <div key={item.category_id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.category_name}
                      </span>

                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Payments
          </h2>

          <div className="mt-5 space-y-3">
            {data.upcoming_payments.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming payments.</p>
            ) : (
              data.upcoming_payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{payment.name}</p>

                    <p className="text-sm text-gray-500">
                      {new Date(payment.next_payment_date).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>

        <div className="mt-4 overflow-x-auto">
          {data.recent_transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                </tr>
              </thead>

              <tbody>
                {data.recent_transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-900">
                      {transaction.description}
                    </td>

                    <td className="py-3 text-gray-500">
                      {new Date(
                        transaction.transaction_date,
                      ).toLocaleDateString()}
                    </td>

                    <td
                      className={`py-3 text-right font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
