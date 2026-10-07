import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import {
  TEMPO_CACHE_MS,
  ehCacheRecente,
  invalidarCacheLocais,
  lerCache,
  salvarCache,
} from './cachelocais'

describe('cacheLocais', () => {
  beforeEach(() => {
    invalidarCacheLocais()
  })

  it('começa vazio', () => {
    expect(lerCache()).toBeNull()
  })

  it('é recente logo depois de salvar', () => {
    salvarCache([])

    const cache = lerCache()

    expect(
      cache && ehCacheRecente(cache),
    ).toBe(true)
  })

  it(
    'deixa de ser recente depois do tempo limite',
    () => {
      salvarCache([])

      const cache = lerCache()

      const depoisDoLimite =
        Date.now() +
        TEMPO_CACHE_MS +
        1

      expect(
        cache &&
          ehCacheRecente(
            cache,
            depoisDoLimite,
          ),
      ).toBe(false)
    },
  )

  it('é apagado ao invalidar', () => {
    salvarCache([])

    invalidarCacheLocais()

    expect(lerCache()).toBeNull()
  })
})