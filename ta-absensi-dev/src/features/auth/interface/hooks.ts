// Kontrak tipe yang dihasilkan/dipakai oleh hook pada fitur auth.

export type LoginAlert = { variant: "danger" | "warning"; message: string };

export type BootstrapStatus = "checking" | "ready";

export type CredentialHandler = (idToken: string) => void;
export type ErrorHandler = (message: string) => void;
