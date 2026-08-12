import { useEffect, useState } from "react";

import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  type Subscription,
} from "../api/subscriptions";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadSubscriptions() {
    try {
      setIsLoading(true);

      const data = await getSubscriptions();

      setSubscriptions(data);
    } catch {
      setError("Unable to load subscriptions.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialSubscriptions() {
      try {
        const data = await getSubscriptions();

        if (!cancelled) {
          setSubscriptions(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load subscriptions.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSubscriptions();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !amount) {
      setError("Name and amount are required.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await createSubscription({
        name: name.trim(),
        amount: Number(amount),
        billing_cycle: billingCycle,
        next_payment_date: nextPaymentDate,
        is_active: true,
      });

      setName("");
      setAmount("");

      await loadSubscriptions();
    } catch {
      setError("Unable to create subscription.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteSubscription(id);

      setSubscriptions((current) =>
        current.filter((subscription) => subscription.id !== id),
      );
    } catch {
      setError("Unable to delete subscription.");
    }
  }

  const monthlyCost = subscriptions
    .filter(
      (subscription) =>
        subscription.is_active && subscription.billing_cycle === "monthly",
    )
    .reduce((total, subscription) => total + Number(subscription.amount), 0);

  const yearlyOnlyCost = subscriptions
    .filter(
      (subscription) =>
        subscription.is_active && subscription.billing_cycle === "yearly",
    )
    .reduce(
      (total, subscription) => total + Number(subscription.amount) / 12,
      0,
    );

  const estimatedMonthlyCost = monthlyCost + yearlyOnlyCost;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>

        <p className="mt-1 text-gray-500">Keep track of recurring payments.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">
          Estimated monthly recurring cost
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatCurrency(estimatedMonthlyCost)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Subscription
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Netflix"
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
              <label className="mb-1 block text-sm font-medium">
                Billing Cycle
              </label>

              <select
                value={billingCycle}
                onChange={(event) => setBillingCycle(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Next Payment
              </label>

              <input
                type="date"
                value={nextPaymentDate}
                onChange={(event) => setNextPaymentDate(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Subscription"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Subscriptions
          </h2>

          {isLoading ? (
            <p className="mt-6 text-sm text-gray-500">
              Loading subscriptions...
            </p>
          ) : subscriptions.length === 0 ? (
            <div className="mt-6 rounded-lg bg-gray-50 p-8 text-center">
              <p className="font-medium text-gray-900">No subscriptions yet</p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first recurring payment.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {subscription.name}
                    </p>

                    <p className="mt-1 text-sm capitalize text-gray-500">
                      {subscription.billing_cycle} · Next payment{" "}
                      {new Date(
                        subscription.next_payment_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(subscription.amount)}
                    </p>

                    <button
                      onClick={() => handleDelete(subscription.id)}
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

export default Subscriptions;
