import apiClient from "./client";

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetRequest {
  category_id: number;
  amount: number;
  month: number;
  year: number;
}

export async function getBudgets(
  month?: number,
  year?: number,
): Promise<Budget[]> {
  const response = await apiClient.get<Budget[]>("/budgets", {
    params: {
      month,
      year,
    },
  });

  return response.data;
}

export async function createBudget(
  data: CreateBudgetRequest,
): Promise<Budget> {
  const response = await apiClient.post<Budget>("/budgets", data);

  return response.data;
}

export async function deleteBudget(id: number): Promise<void> {
  await apiClient.delete(`/budgets/${id}`);
}