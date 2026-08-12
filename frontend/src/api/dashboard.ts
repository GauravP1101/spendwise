import apiClient from "./client";

export interface CategorySpending {
  category_id: number;
  category_name: string;
  amount: string;
}

export interface UpcomingPayment {
  id: number;
  name: string;
  amount: string;
  next_payment_date: string;
}

export interface RecentTransaction {
  id: number;
  description: string;
  amount: string;
  type: "income" | "expense";
  transaction_date: string;
}

export interface DashboardSummary {
  total_income: string;
  total_expenses: string;
  remaining: string;
  subscription_cost: string;
  category_spending: CategorySpending[];
  upcoming_payments: UpcomingPayment[];
  recent_transactions: RecentTransaction[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiClient.get<DashboardSummary>(
    "/dashboard/summary",
  );

  return response.data;
}