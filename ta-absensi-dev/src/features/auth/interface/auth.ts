// Kontrak BE: setiap respons memakai envelope { success, code, message, data }
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  errors?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  nisn?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  roles: string[];
}

export interface AuthData {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  nisn: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // email (login FE hanya lewat email)
  password: string;
  device_info?: string;
}

export interface RefreshPayload {
  refresh_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

export interface ChangePasswordPayload {
  code: string;
  new_password: string;
}

export interface GoogleLoginPayload {
  id_token: string;
  device_info?: string;
}
