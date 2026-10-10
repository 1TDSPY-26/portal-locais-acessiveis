import { describe, expect, it } from 'vitest'
import type { Local } from '../types/Local'
import { ordenarLocais } from './ordenarLocais'

const camposComuns = { endereco: '', categoria: '', descricao: '' }

const locais: Local[] = [
    { ...camposComuns, id: 1, nome: 'Zoológico', notaAcessibilidade: 3, tiposAcessibilidade: ['Rampa'] },
    { ...camposComuns, id: 2, nome: 'Ágora Cultural', notaAcessibilidade: 5, tiposAcessibilidade: ['Rampa', 'Libras'] },
    { ...camposComuns, id: 3, nome: 'biblioteca', notaAcessibilidade: 5, tiposAcessibilidade: [] },
]

function nomes(lista: Local[]) {
    return lista.map((local) => local.nome)
}

describe('ordenarLocais', () => {
    it('ordena de A a Z respeitando acentos e maiúsculas', () => {
        expect(nomes(ordenarLocais(locais, 'nome-asc'))).toEqual(['Ágora Cultural', 'biblioteca', 'Zoológico'])
    })

    it('ordena de Z a A', () => {
        expect(nomes(ordenarLocais(locais, 'nome-desc'))).toEqual(['Zoológico', 'biblioteca', 'Ágora Cultural'])
    })

    it('ordena pela maior nota e desempata pelo nome', () => {
        expect(nomes(ordenarLocais(locais, 'nota-desc'))).toEqual(['Ágora Cultural', 'biblioteca', 'Zoológico'])
    })

    it('ordena por mais recursos e desempata pelo nome', () => {
        expect(nomes(ordenarLocais(locais, 'recursos-desc'))).toEqual(['Ágora Cultural', 'Zoológico', 'biblioteca'])
    })

    it('não altera a lista original', () => {
        const original = [...locais]

        ordenarLocais(locais, 'nome-desc')

        expect(locais).toEqual(original)
    })
})