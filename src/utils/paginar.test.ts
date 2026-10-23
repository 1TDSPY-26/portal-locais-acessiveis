import { describe, expect, it } from 'vitest'
import type { Local } from '../types/Local'
import { paginar } from './paginar'

function criarLocais(quantidade: number) {
  const locais: Local[] = []
  for (let id = 1; id <= quantidade; id++) {
    locais.push({ id, nome: `Local ${id}`, endereco: '', categoria: '', descricao: '', tiposAcessibilidade: [], notaAcessibilidade: 1 })
  }
  return locais
}

const vinteECincoLocais = criarLocais(25)

describe('paginar', () => {
  it('mostra os 9 primeiros na página 1', () => {
    const resultado = paginar(vinteECincoLocais, 1, 9)
    expect(resultado.itens).toEqual(vinteECincoLocais.slice(0, 9))
    expect(resultado.totalPaginas).toBe(3)
    expect(resultado.inicio).toBe(1)
    expect(resultado.fim).toBe(9)
    expect(resultado.total).toBe(25)
  })

  it('mostra os nove seguintes na página 2', () => {
    const resultado = paginar(vinteECincoLocais, 2, 9)
    expect(resultado.itens).toEqual(vinteECincoLocais.slice(9, 18))
    expect(resultado.inicio).toBe(10)
    expect(resultado.fim).toBe(18)
  })

  it('mostra o restante na última página', () => {
    const resultado = paginar(vinteECincoLocais, 3, 9)
    expect(resultado.itens).toEqual(vinteECincoLocais.slice(18))
    expect(resultado.inicio).toBe(19)
    expect(resultado.fim).toBe(25)
  })

  it('corrige uma página fora do intervalo', () => {
    expect(paginar(vinteECincoLocais, 99, 9).paginaAtual).toBe(3)
    expect(paginar(vinteECincoLocais, 0, 9).paginaAtual).toBe(1)
  })

  it('mantém uma página e posições zeradas para lista vazia', () => {
    expect(paginar([], 3, 9)).toEqual({
      itens: [], paginaAtual: 1, totalPaginas: 1, inicio: 0, fim: 0, total: 0,
    })
  })

  it('não altera a lista recebida', () => {
    const lista = criarLocais(12)
    const copia = [...lista]
    paginar(lista, 2, 9)
    expect(lista).toEqual(copia)
  })
})
