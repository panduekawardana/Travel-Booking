import { apiClient } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "costumer";
  isActive: boolean;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

interface AuthResponseLogin {
  success: boolean;
  message: string;
  data: {
    user: User;
    time: {
      date: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function loginApi(email: string, password: string) {
  const res = await apiClient<AuthResponseLogin>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
  phone?: string
) {
  const res = await apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
  return res.data;
}

export async function getProfileApi() {
  const res = await apiClient<{
    success: boolean;
    data: { user: User };
  }>("/auth/profile");
  return res.data.user;
}

export async function loginAdminApi(email: string, password: string) {
  const res = await apiClient<AuthResponse>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export type { User };
