// NOTE: nama field mengikuti asumsi sementara, sesuaikan saat kontrak BE sudah ada.
export interface RegisterPayload {
  name: string;
  email: string;
  identityNumber: string;
  password: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
