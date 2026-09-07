const API_URL = import.meta.env.VITE_API_URL

export type ApiError = {
  message: string
  status?: number
}

export type ApiResult<T> = {
  data?: T
  error?: ApiError
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      return {
        error: {
          message: 'Erro na requisição',
          status: response.status,
        },
      }
    }

    if (response.status === 204) {
      return {
        data: undefined as T,
      }
    }

    const data: T = await response.json()

    return {
      data,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        error: {
          message: 'Tempo limite da requisição excedido',
        },
      }
    }

    return {
      error: {
        message: 'Erro de conexão com a API',
      },
    }
  } finally {
    clearTimeout(timeout)
  }
}