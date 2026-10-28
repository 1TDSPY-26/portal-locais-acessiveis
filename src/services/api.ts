import { mensagemPorFalha } from './mensagensFalha'
import { mensagemPorStatus } from './mensagensErro'

export const API_URL_PADRAO = 'http://localhost:3000'

function avisarFallback() {
  // O aviso aparece só no npm run dev, nunca no site publicado.
  if (import.meta.env.DEV) {
    console.warn(
      'VITE_API_URL não foi definida. Usando http://localhost:3000. ' +
        'Crie o arquivo .env.local com VITE_API_URL=<endereço da API>.'
    )
  }
}

export function resolverApiUrl(valor: string | undefined): string {
  if (valor === undefined || valor.trim() === '') {
    avisarFallback()
    return API_URL_PADRAO
  }

  let url = valor.trim()
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return url
}

const API_URL = resolverApiUrl(import.meta.env.VITE_API_URL)

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
          message: mensagemPorStatus(response.status),
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
    return {
      error: {
        message: mensagemPorFalha(error),
      },
    }
  } finally {
    clearTimeout(timeout)
  }
}