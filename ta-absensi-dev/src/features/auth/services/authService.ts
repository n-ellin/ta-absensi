import api from "@/core/api/api";
import type { LoginPayload, LoginResponse } from "../interface/auth";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/login", payload);

  return data;
};
