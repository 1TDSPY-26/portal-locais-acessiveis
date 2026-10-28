import { describe, expect, it } from 'vitest'
import { criarEstadoOrigem, montarCaminhoDaLista } from './caminhoDaLista'

describe('criarEstadoOrigem', () => {
    it('cria o estado com caminho e parâmetros', () => {
        expect(criarEstadoOrigem('/locais', '?busca=bib')).toEqual({ origem: '/locais?busca=bib' })
    })

    it('cria o estado sem parâmetros', () => {
        expect(criarEstadoOrigem('/locais', '')).toEqual({ origem: '/locais' })
    })
})

describe('montarCaminhoDaLista', () => {
    it('devolve a origem da listagem com filtros', () => {
        const origem = '/locais?busca=bib&recurso=Rampa&recurso=Elevador'

        expect(montarCaminhoDaLista({ origem })).toBe(origem)
    })

    it('devolve a listagem sem filtros', () => {
        expect(montarCaminhoDaLista({ origem: '/locais' })).toBe('/locais')
    })

    it('usa a listagem quando não há estado', () => {
        expect(montarCaminhoDaLista(null)).toBe('/locais')
        expect(montarCaminhoDaLista(undefined)).toBe('/locais')
    })

    it('ignora origem de outra página', () => {
        expect(montarCaminhoDaLista({ origem: '/sobre' })).toBe('/locais')
        expect(montarCaminhoDaLista({ origem: '/locais/editar/1' })).toBe('/locais')
        expect(montarCaminhoDaLista({ origem: '/locaisx' })).toBe('/locais')
        expect(montarCaminhoDaLista({ origem: '//outro-site' })).toBe('/locais')
    })

    it('ignora estado em outro formato', () => {
        expect(montarCaminhoDaLista({ origem: 42 })).toBe('/locais')
        expect(montarCaminhoDaLista({ mensagem: 'x' })).toBe('/locais')
        expect(montarCaminhoDaLista('texto')).toBe('/locais')
    })
})