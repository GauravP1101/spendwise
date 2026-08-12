import apiClient from "./client";

export interface Subscription {
  id: number;
  user_id: number;
  category_id: number | null;
  name: string;
  amount: string;
  billing_cycle: string;
  next_payment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  category_id?: number;
  name: string;
  amount: number;
  billing_cycle: string;
  next_payment_date: string;
  is_active: boolean;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const response = await apiClient.get<Subscription[]>(
    "/subscriptions",
  );

  return response.data;
}

export async function createSubscription(
  data: CreateSubscriptionRequest,
): Promise<Subscription> {
  const response = await apiClient.post<Subscription>(
    "/subscriptions",
    data,
  );

  return response.data;
}

export async function deleteSubscription(
  id: number,
): Promise<void> {
  await apiClient.delete(`/subscriptions/${id}`);
}