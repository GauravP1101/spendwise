import apiClient from "./client";

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: string;
  type: "income" | "expense";
  description: string;
  transaction_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionRequest {
  category_id: number;
  amount: number;
  type: "income" | "expense";
  description: string;
  transaction_date: string;
  notes?: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient.get<Transaction[]>("/transactions");
  return response.data;
}

export async function createTransaction(
  data: CreateTransactionRequest,
): Promise<Transaction> {
  const response = await apiClient.post<Transaction>(
    "/transactions",
    data,
  );

  return response.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}