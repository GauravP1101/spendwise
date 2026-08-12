import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAnalyticsSummary, type AnalyticsSummary } from "../api/analytics";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function Analytics() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await getAnalyticsSummary();
        setData(response);
      } catch {
        setError("Unable to load analytics.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-4 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-4 text-red-600">
          {error || "Unable to load analytics."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

        <p className="mt-1 text-gray-500">
          Understand how your income and spending change over time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Income vs Expenses
          </h2>

          {data.monthly.length === 0 ? (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-gray-500">
                Add transactions to see monthly trends.
              </p>
            </div>
          ) : (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" />
                  <Bar dataKey="expenses" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Spending by Category
          </h2>

          {data.categories.length === 0 ? (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-gray-500">
                Add expense transactions to see category spending.
              </p>
            </div>
          ) : (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categories}
                    dataKey="amount"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Category Breakdown
        </h2>

        <div className="mt-5 space-y-3">
          {data.categories.length === 0 ? (
            <p className="text-sm text-gray-500">No expense data available.</p>
          ) : (
            data.categories.map((category) => (
              <div
                key={category.category_name}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="text-gray-700">{category.category_name}</span>

                <span className="font-medium text-gray-900">
                  {formatCurrency(category.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Analytics;
