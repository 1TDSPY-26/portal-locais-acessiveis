import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('apiRequest', () => {
  it('informa indisponibilidade sem disparar requisição quando a URL não está configurada', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.resetModules()
    const { apiRequest } = await import('./api')

    const result = await apiRequest('/locais', { method: 'POST' })

    expect(result.error?.message).toMatch(/indisponível/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
