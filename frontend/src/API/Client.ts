const BASE_URL = '/api'

function getToken(): string | null {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token")
}

//create error message
export class ApiError extends Error {
  public statusCode: number
  public isNetworkError: boolean
  constructor(
    message: string,
    statusCode: number,
    isNetworkError: boolean = false
  ) {
    super(message)
    this.name = "ServerError";
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError("Could not reach server. Please check your connection and try again",
      0,
      true
    )
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
      statusCode: response.status,
    }))
    throw error
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}


export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}