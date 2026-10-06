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
