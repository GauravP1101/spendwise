import apiClient from "./client";

export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: "income" | "expense";
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
}