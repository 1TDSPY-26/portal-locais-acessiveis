import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeolocalizacao, type EstadoGeolocalizacao } from './useGeolocalizacao'

// Cada chamada a getCurrentPosition vira um pedido guardado aqui. O teste decide quando e como cada um responde.
type PedidoFalso = {
  sucesso: PositionCallback
  erro?: PositionErrorCallback | null
}

let pedidos: PedidoFalso[] = []

const getCurrentPosition = vi.fn((sucesso: PositionCallback, erro?: PositionErrorCallback | null) => {
  pedidos.push({ sucesso, erro })
})

// Posições inventadas só para o teste.
function criarPosicao(latitude: number, longitude: number): GeolocationPosition {
  const coords = {
    latitude,
    longitude,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON: () => ({}),
  }

  return { coords, timestamp: 0, toJSON: () => ({}) }
}

function criarErro(code: number): GeolocationPositionError {
  return { code, message: '', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }
}

function responderComSucesso(indice: number, latitude: number, longitude: number) {
  act(() => pedidos[indice].sucesso(criarPosicao(latitude, longitude)))
}

function responderComErro(indice: number, codigo: number) {
  const callbackDeErro = pedidos[indice].erro
  if (!callbackDeErro) throw new Error('O pedido foi feito sem callback de erro')
  act(() => callbackDeErro(criarErro(codigo)))
}

function definirGeolocalizacao(valor: unknown) {
  Object.defineProperty(navigator, 'geolocation', { value: valor, configurable: true })
}

beforeEach(() => {
  pedidos = []
  getCurrentPosition.mockClear()
  definirGeolocalizacao({ getCurrentPosition })
})

afterEach(() => {
  definirGeolocalizacao(undefined)
})

describe('useGeolocalizacao: pedido', () => {
  it('começa inativa, sem posição, e não pede a localização sozinho', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    expect(result.current.estado).toBe('inativa')
    expect(result.current.posicao).toBeNull()
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('ao solicitar, fica solicitando e pede com as opções da issue', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())

    expect(result.current.estado).toBe('solicitando')
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
      timeout: 10000,
      maximumAge: 0,
      enableHighAccuracy: false,
    })
  })

  it('com sucesso e coordenadas válidas, fica pronta com a posição', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(0, -10.5, -40.25)

    expect(result.current.estado).toBe('pronta')
    expect(result.current.posicao).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('com sucesso e coordenadas inválidas, fica indisponível e sem posição', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(0, Number.NaN, -40.25)

    expect(result.current.estado).toBe('indisponivel')
    expect(result.current.posicao).toBeNull()

    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(1, 91, -40.25)

    expect(result.current.estado).toBe('indisponivel')
    expect(result.current.posicao).toBeNull()
  })

  it('sem navigator.geolocation, fica indisponível sem quebrar', () => {
    definirGeolocalizacao(undefined)
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())

    expect(result.current.estado).toBe('indisponivel')
    expect(result.current.posicao).toBeNull()
  })
})

describe('useGeolocalizacao: erros do navegador', () => {
  const casos: [number, EstadoGeolocalizacao][] = [
    [1, 'negada'],
    [2, 'indisponivel'],
    [3, 'tempo-esgotado'],
  ]

  it.each(casos)('o erro com código %i vira o estado %s', (codigo, estadoEsperado) => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    responderComErro(0, codigo)

    expect(result.current.estado).toBe(estadoEsperado)
    expect(result.current.posicao).toBeNull()
  })
})

describe('useGeolocalizacao: nova tentativa e respostas antigas', () => {
  it('nova tentativa depois de um erro pede de novo e pode ficar pronta', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    responderComErro(0, 3)
    act(() => result.current.solicitarLocalizacao())

    expect(result.current.estado).toBe('solicitando')
    expect(getCurrentPosition).toHaveBeenCalledTimes(2)

    responderComSucesso(1, -10.5, -40.25)

    expect(result.current.estado).toBe('pronta')
  })

  it('nova tentativa apaga a posição anterior', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(0, -10.5, -40.25)
    act(() => result.current.solicitarLocalizacao())

    expect(result.current.estado).toBe('solicitando')
    expect(result.current.posicao).toBeNull()
  })

  it('um erro do pedido antigo, chegando depois, não muda o resultado do pedido novo', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(1, -10.5, -40.25)
    responderComErro(0, 1)

    expect(result.current.estado).toBe('pronta')
    expect(result.current.posicao).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('uma posição velha do pedido antigo, chegando depois, não troca a posição nova', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(1, -10.5, -40.25)
    responderComSucesso(0, -20, -50)

    expect(result.current.posicao).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('a resposta do pedido antigo não tira o pedido novo de solicitando', () => {
    const { result } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    act(() => result.current.solicitarLocalizacao())
    responderComSucesso(0, -20, -50)

    expect(result.current.estado).toBe('solicitando')
    expect(result.current.posicao).toBeNull()
  })

  it('depois de sair da tela, uma resposta pendente não muda o estado nem quebra', () => {
    const { result, unmount } = renderHook(() => useGeolocalizacao())

    act(() => result.current.solicitarLocalizacao())
    unmount()

    expect(() => responderComSucesso(0, -10.5, -40.25)).not.toThrow()
    expect(() => responderComErro(0, 1)).not.toThrow()
    expect(result.current.estado).toBe('solicitando')
    expect(result.current.posicao).toBeNull()
  })
})