import axios, { isAxiosError, type AxiosRequestConfig } from "axios"

/**
 * The ONLY place the app talks HTTP. Feature `api.ts` files call `request()`;
 * components and hooks never import axios directly.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: "application/json" },
})

/** Normalized error every caller (and React Query) receives. */
export class ApiError extends Error {
  readonly status: number | undefined
  readonly code: string | undefined
  readonly details: unknown

  constructor(message: string, options: { status?: number; code?: string; details?: unknown } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return new ApiError(data?.message ?? error.message, {
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    })
  }
  return new ApiError(error instanceof Error ? error.message : "Unknown error")
}

api.interceptors.request.use((config) => {
  // Attach auth here when the project gets an auth provider, e.g.:
  // const token = getAccessToken(); if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)

/** Typed helper returning only the response body. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<T>(config)
  return response.data
}
