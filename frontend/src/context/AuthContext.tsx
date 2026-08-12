import { useEffect, useState, type ReactNode } from "react";

import apiClient from "../api/client";
import { AuthContext, type User } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<User>("/auth/me");
        setUser(response.data);
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadUser();
  }, []);

  async function login(token: string) {
    localStorage.setItem("access_token", token);

    const response = await apiClient.get<User>("/auth/me");

    setUser(response.data);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
