import apiClient from "./client";

export interface MonthlyAnalytics {
  month: string;
  income: string;
  expenses: string;
}

export interface CategoryAnalytics {
  category_name: string;
  amount: string;
}

export interface AnalyticsSummary {
  monthly: MonthlyAnalytics[];
  categories: CategoryAnalytics[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await apiClient.get<AnalyticsSummary>(
    "/analytics/summary",
  );

  return response.data;
}