import type { InternalAxiosRequestConfig } from "axios";

/** Config axios dengan penanda retry untuk alur refresh token. */
export type RequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
