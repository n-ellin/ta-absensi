import api from "@/core/api/api";
import type { LoginPayload, RegisterPayload } from "../interface/auth";

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}
