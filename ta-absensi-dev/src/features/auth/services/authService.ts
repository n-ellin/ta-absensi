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
export const AuthServices = {
  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async googleLogin(
    payload: GoogleLoginPayload,
  ): Promise<ApiResponse<AuthData>> {
    const response = await api.post("/auth/google", payload);
    return response.data;
  },

  async refresh(payload: RefreshPayload): Promise<ApiResponse<AuthData>> {
    const response = await api.post("/auth/refresh", payload);
    return response.data;
  },

  async logout(payload: RefreshPayload): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/logout", payload);
    return response.data;
  },

  async logoutAll(): Promise<ApiResponse<{ revoked_sessions: number }>> {
    const response = await api.post("/auth/logout-all");
    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  },

  async resendForgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/forgot-password/resend", payload);
    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/forgot-password/verify", payload);
    return response.data;
  },

  async requestChangePassword(): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/change-password/request");
    return response.data;
  },

  async resendChangePassword(): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/change-password/resend");
    return response.data;
  },

  async changePassword(
    payload: ChangePasswordPayload,
  ): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/change-password/verify", payload);
    return response.data;
  },
};
