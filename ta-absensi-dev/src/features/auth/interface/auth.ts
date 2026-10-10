// NOTE: nama field mengikuti asumsi sementara, sesuaikan saat kontrak BE sudah ada.
export interface RegisterPayload {
  name: string;
  email: string;
  identityNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
