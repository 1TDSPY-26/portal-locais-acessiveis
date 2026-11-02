import { describe, expect, it } from 'vitest'
import { formatarDistancia } from './formatarDistancia'

describe('formatarDistancia', () => {
    it('mostra zero como 0 m', () => {
        expect(formatarDistancia(0)).toBe('0 m')
    })

    it('trata -0 como 0 m, sem sinal', () => {
        expect(formatarDistancia(-0)).toBe('0 m')
    })

    it('mostra metros inteiros abaixo de 1 km', () => {
        expect(formatarDistancia(0.5)).toBe('500 m')
        expect(formatarDistancia(0.0004)).toBe('0 m')
        expect(formatarDistancia(0.9994)).toBe('999 m')
    })

    it('usa a medida original no corte: 0,9996 km ainda é metros', () => {
        expect(formatarDistancia(0.9996)).toBe('1.000 m')
    })

    it('mostra quilômetros com uma casa a partir de 1 km', () => {
        expect(formatarDistancia(1)).toBe('1,0 km')
        expect(formatarDistancia(12.34)).toBe('12,3 km')
    })

    it('usa o separador de milhar e a vírgula do pt-BR', () => {
        expect(formatarDistancia(1234.5)).toBe('1.234,5 km')
    })

    it.each([
        ['null', null],
        ['undefined', undefined],
        ['negativo', -1],
        ['negativo pequeno', -0.0001],
        ['NaN', Number.NaN],
        ['infinito', Number.POSITIVE_INFINITY],
        ['infinito negativo', Number.NEGATIVE_INFINITY],
    ])('não gera texto para %s', (_nome, valor) => {
        expect(formatarDistancia(valor)).toBeNull()
    })
})
