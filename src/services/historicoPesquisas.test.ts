import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CHAVE_HISTORICO, lerHistorico } from './historicoPesquisas';

describe('lerHistorico', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });

    it('Retorna uma lista vazia se não tiver um histórico', () => {
        expect(lerHistorico()).toEqual([]);
    });

    it('Retorna uma lista vazia se o histórico salvo esteja inválido ou corrompido', () => {
        localStorage.setItem(CHAVE_HISTORICO, '{quebrado}');
        expect(lerHistorico()).toEqual([]);
    });

    it('Retorna uma lista vazia caso o histórico salvo não seja uma lista (array)', () => {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify({chave: 'valor'}));
        expect(lerHistorico()).toEqual([]);
    });

    it('Retorna a lista de pesquisas salvas do histórico devidamente formatada e sem repetições', () => {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(['Biblioteca', 'Museu', 'biblioteca']));
        expect(lerHistorico()).toEqual(['Museu', 'biblioteca']);
    });

    it('Lança excessão de erro caso o armazenamento local esteja inacessivel', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Acesso negado!');
        });
        expect(() => lerHistorico()).toThrow('Acesso negado!');
    });
});