import api from "@/core/api/api";
import type {
  ApiResponse,
  AuthData,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RefreshPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "../interface/auth";

// Semua endpoint BE memakai envelope { success, code, message, data }
async function request<T>(
  req: Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> {
  const { data } = await req;
  return data;
}

export const register = (payload: RegisterPayload) =>
  request<User>(api.post<ApiResponse<User>>("/auth/register", payload));

export const login = (payload: LoginPayload) =>
  request<AuthData>(api.post<ApiResponse<AuthData>>("/auth/login", payload));

export const googleLogin = (payload: GoogleLoginPayload) =>
  request<AuthData>(api.post<ApiResponse<AuthData>>("/auth/google", payload));

export const refresh = (payload: RefreshPayload) =>
  request<AuthData>(api.post<ApiResponse<AuthData>>("/auth/refresh", payload));

export const logout = (payload: RefreshPayload) =>
  request<null>(api.post<ApiResponse<null>>("/auth/logout", payload));

export const logoutAll = () =>
  request<{ revoked_sessions: number }>(
    api.post<ApiResponse<{ revoked_sessions: number }>>("/auth/logout-all"),
  );

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  request<null>(api.post<ApiResponse<null>>("/auth/forgot-password", payload));

export const resendForgotPassword = (payload: ForgotPasswordPayload) =>
  request<null>(
    api.post<ApiResponse<null>>("/auth/forgot-password/resend", payload),
  );

export const resetPassword = (payload: ResetPasswordPayload) =>
  request<null>(
    api.post<ApiResponse<null>>("/auth/forgot-password/verify", payload),
  );

export const requestChangePassword = () =>
  request<null>(api.post<ApiResponse<null>>("/auth/change-password/request"));

export const resendChangePassword = () =>
  request<null>(api.post<ApiResponse<null>>("/auth/change-password/resend"));

export const changePassword = (payload: ChangePasswordPayload) =>
  request<null>(
    api.post<ApiResponse<null>>("/auth/change-password/verify", payload),
  );
