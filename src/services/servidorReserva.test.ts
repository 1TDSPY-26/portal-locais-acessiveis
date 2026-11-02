
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
    ehEnderecoVazio,
    estaUsandoServidorReserva,
} from './servidorReserva'

afterEach(() => {
    vi.unstubAllEnvs()
})

describe('ehEnderecoVazio', () => {
    it('retorna true para valores que não são texto', () => {
        expect(ehEnderecoVazio(undefined)).toBe(true)
        expect(ehEnderecoVazio(null)).toBe(true)
        expect(ehEnderecoVazio(123)).toBe(true)
    })

    it('retorna true para textos vazios', () => {
        expect(ehEnderecoVazio('')).toBe(true)
        expect(ehEnderecoVazio('   ')).toBe(true)
    })

    it('retorna false para endereço preenchido', () => {
        expect(ehEnderecoVazio('http://localhost:3000')).toBe(false)
    })
})

describe('estaUsandoServidorReserva', () => {
    it('identifica URL vazia', () => {
        vi.stubEnv('VITE_API_URL', '')
        expect(estaUsandoServidorReserva()).toBe(true)
    })

    it('identifica URL com espaços', () => {
        vi.stubEnv('VITE_API_URL', '   ')
        expect(estaUsandoServidorReserva()).toBe(true)
    })

    it('identifica URL configurada', () => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
        expect(estaUsandoServidorReserva()).toBe(false)
    })

    it('identifica URL ausente', () => {
        vi.stubEnv('VITE_API_URL', undefined)
        expect(estaUsandoServidorReserva()).toBe(true)
    })

    it('consulta a variável a cada chamada', () => {
        vi.stubEnv('VITE_API_URL', '')
        expect(estaUsandoServidorReserva()).toBe(true)

        vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
        expect(estaUsandoServidorReserva()).toBe(false)
    })
})
