import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { apiRequest as ApiRequest } from './api'

const API_URL = 'https://api.teste.local'

let apiRequest: typeof ApiRequest
const fetchMock = vi.fn<typeof fetch>()

function respostaJson(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function opcoesEnviadas(): RequestInit {
  return fetchMock.mock.calls[0][1] ?? {}
}

beforeEach(async () => {
  // API_URL é lido quando o módulo carrega, então o módulo é reimportado
  // depois de definir a variável de ambiente.
  vi.stubEnv('VITE_API_URL', API_URL)
  vi.stubGlobal('fetch', fetchMock)
  vi.resetModules()
  ;({ apiRequest } = await import('./api'))
})

afterEach(() => {
  vi.useRealTimers()
  fetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('apiRequest - sucesso', () => {
  it('monta a URL com a base configurada e o endpoint informado', async () => {
    fetchMock.mockResolvedValue(respostaJson([]))

    await apiRequest('/locais?categoria=museu')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_URL}/locais?categoria=museu`)
  })

  it('devolve os dados convertidos do JSON quando a resposta é bem-sucedida', async () => {
    const locais = [{ id: 1, nome: 'Biblioteca Mário de Andrade' }]
    fetchMock.mockResolvedValue(respostaJson(locais))

    const resultado = await apiRequest<typeof locais>('/locais')

    expect(resultado).toEqual({ data: locais })
    expect(resultado.error).toBeUndefined()
  })

  it('envia Content-Type JSON por padrão', async () => {
    fetchMock.mockResolvedValue(respostaJson({}))

    await apiRequest('/locais')

    expect(opcoesEnviadas().headers).toEqual({ 'Content-Type': 'application/json' })
  })

  it('repassa método, corpo e cabeçalhos extras, permitindo sobrescrever o Content-Type', async () => {
    fetchMock.mockResolvedValue(respostaJson({ id: 7 }, 201))
    const corpo = JSON.stringify({ nome: 'Parque Ibirapuera' })

    await apiRequest('/locais', {
      method: 'POST',
      body: corpo,
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'X-Origem': 'portal',
      },
    })

    const opcoes = opcoesEnviadas()
    expect(opcoes.method).toBe('POST')
    expect(opcoes.body).toBe(corpo)
    expect(opcoes.headers).toEqual({
      'Content-Type': 'application/merge-patch+json',
      'X-Origem': 'portal',
    })
  })

  it('anexa um AbortSignal ainda não abortado à requisição', async () => {
    fetchMock.mockResolvedValue(respostaJson({}))

    await apiRequest('/locais')

    const { signal } = opcoesEnviadas()
    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal?.aborted).toBe(false)
  })

  it('devolve data indefinido em 204 sem tentar ler o corpo', async () => {
    const resposta = new Response(null, { status: 204 })
    const leituraJson = vi.spyOn(resposta, 'json')
    fetchMock.mockResolvedValue(resposta)

    const resultado = await apiRequest<void>('/locais/1', { method: 'DELETE' })

    expect(resultado).toEqual({ data: undefined })
    expect(resultado.error).toBeUndefined()
    expect(leituraJson).not.toHaveBeenCalled()
  })
})

describe('apiRequest - erros', () => {
  it.each([400, 404, 500, 503])(
    'devolve erro com o status %i quando a resposta não é ok, sem ler o corpo',
    async (status) => {
      const resposta = respostaJson({ detalhe: 'falhou' }, status)
      const leituraJson = vi.spyOn(resposta, 'json')
      fetchMock.mockResolvedValue(resposta)

      const resultado = await apiRequest('/locais')

      expect(resultado).toEqual({
        error: { message: 'Erro na requisição', status },
      })
      expect(resultado.data).toBeUndefined()
      expect(leituraJson).not.toHaveBeenCalled()
    }
  )

  it('devolve erro de conexão quando o fetch é rejeitado', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const resultado = await apiRequest('/locais')

    expect(resultado).toEqual({
      error: { message: 'Erro de conexão com a API' },
    })
  })

  it('aborta a requisição após 10 segundos e devolve erro de tempo limite', async () => {
    vi.useFakeTimers()
    // Como o fetch real, rejeita com o motivo do abort (DOMException AbortError).
    fetchMock.mockImplementation(
      (_url, opcoes) =>
        new Promise((_resolve, reject) => {
          const signal = opcoes?.signal
          signal?.addEventListener('abort', () => reject(signal.reason))
        })
    )

    const requisicao = apiRequest('/locais')
    const { signal } = opcoesEnviadas()

    await vi.advanceTimersByTimeAsync(9999)
    expect(signal?.aborted).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    expect(signal?.aborted).toBe(true)

    await expect(requisicao).resolves.toEqual({
      error: { message: 'Tempo limite da requisição excedido' },
    })
  })

  it.each([
    ['sucesso', () => fetchMock.mockResolvedValue(respostaJson({}))],
    ['erro HTTP', () => fetchMock.mockResolvedValue(respostaJson({}, 500))],
    ['falha de rede', () => fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))],
  ])('limpa o timer de tempo limite após %s', async (_cenario, prepararFetch) => {
    vi.useFakeTimers()
    prepararFetch()

    await apiRequest('/locais')

    expect(vi.getTimerCount()).toBe(0)
  })
})
