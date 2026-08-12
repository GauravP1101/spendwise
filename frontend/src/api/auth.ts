import apiClient from "./client";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function registerUser(data: RegisterRequest) {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await apiClient.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
}