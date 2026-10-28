import { describe, expect, it } from 'vitest'
import { calcularDistanciaKm } from './distancia'

// Pontos inventados só para o teste: nenhum vem do catálogo real.
const ORIGEM_SINTETICA = { latitude: 0, longitude: 0 }
const PONTO_SINTETICO_A_4_99_KM = { latitude: 0.0449, longitude: 0 }
// Latitude escolhida para o cálculo dar exatamente 5 km a partir da origem.
const PONTO_SINTETICO_A_5_KM = { latitude: 0.04496608029593653, longitude: 0 }
const PONTO_SINTETICO_A_5_01_KM = { latitude: 0.0451, longitude: 0 }

// Na fórmula com raio 6371 km, 1 grau de meridiano mede 6371 × π / 180 km.
const KM_EM_UM_GRAU = (6371 * Math.PI) / 180
const MEIA_VOLTA_DA_TERRA_KM = 6371 * Math.PI

describe('calcularDistanciaKm', () => {
  it('com o mesmo ponto, devolve 0', () => {
    const ponto = { latitude: -12.5, longitude: -38.25 }

    expect(calcularDistanciaKm(ponto, ponto)).toBe(0)
  })

  it('1 grau de latitude no mesmo meridiano mede cerca de 111,19 km', () => {
    const destino = { latitude: 1, longitude: 0 }

    expect(calcularDistanciaKm(ORIGEM_SINTETICA, destino)).toBeCloseTo(KM_EM_UM_GRAU, 6)
  })

  it('1 grau de longitude na linha do Equador mede o mesmo que 1 grau de latitude', () => {
    const destino = { latitude: 0, longitude: 1 }

    expect(calcularDistanciaKm(ORIGEM_SINTETICA, destino)).toBeCloseTo(KM_EM_UM_GRAU, 6)
  })

  it('a distância de ida é igual à de volta', () => {
    const pontoA = { latitude: -10.5, longitude: -40.25 }
    const pontoB = { latitude: -10.55, longitude: -40.2 }

    expect(calcularDistanciaKm(pontoA, pontoB)).toBeCloseTo(calcularDistanciaKm(pontoB, pontoA), 10)
  })

  it('pontos em lados opostos da Terra dão meia volta, sem NaN', () => {
    const pontoA = { latitude: 10, longitude: 20 }
    const pontoOposto = { latitude: -10, longitude: -160 }

    expect(calcularDistanciaKm(pontoA, pontoOposto)).toBeCloseTo(MEIA_VOLTA_DA_TERRA_KM, 0)
    expect(calcularDistanciaKm(ORIGEM_SINTETICA, { latitude: 0, longitude: 180 })).toBeCloseTo(MEIA_VOLTA_DA_TERRA_KM, 6)
  })
})

describe('calcularDistanciaKm: fronteira de 5 km', () => {
  it('um ponto a exatamente 5 km dá 5', () => {
    expect(calcularDistanciaKm(ORIGEM_SINTETICA, PONTO_SINTETICO_A_5_KM)).toBe(5)
  })

  it('um ponto a 4,99 km fica abaixo de 5', () => {
    const distancia = calcularDistanciaKm(ORIGEM_SINTETICA, PONTO_SINTETICO_A_4_99_KM)

    expect(distancia).toBeLessThan(5)
    expect(distancia).toBeCloseTo(4.99, 2)
  })

  it('um ponto a 5,01 km fica acima de 5', () => {
    const distancia = calcularDistanciaKm(ORIGEM_SINTETICA, PONTO_SINTETICO_A_5_01_KM)

    expect(distancia).toBeGreaterThan(5)
    expect(distancia).toBeCloseTo(5.01, 2)
  })
})