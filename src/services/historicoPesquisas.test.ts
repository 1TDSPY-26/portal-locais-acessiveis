import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CHAVE_HISTORICO, lerHistorico, adicionarPesquisa, salvarHistorico } from './historicoPesquisas';

describe('Serviço de Histórico de Pesquisas', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('lerHistorico', () => {

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
          localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(['biblioteca', 'Museu', 'biblioteca']));
          expect(lerHistorico()).toEqual(['biblioteca', 'Museu']);
      });

      it('Mantém a ordem salva e fica com as cinco pesquisas mais recentes', () => {
          localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(['Museu', 'Biblioteca', 'Praça', 'Parque', 'Teatro', 'Cinema', 'Escola']));
          expect(lerHistorico()).toEqual(['Museu', 'Biblioteca', 'Praça', 'Parque', 'Teatro']);
      });

      it('Retorna uma lista vazia se algum item salvo não for texto', () => {
          localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(['biblioteca', 1]));
          expect(lerHistorico()).toEqual([]);
      });

      it('Lança excessão de erro caso o armazenamento local esteja inacessivel', () => {
          vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
              throw new Error('Acesso negado!');
          });
          expect(() => lerHistorico()).toThrow('Acesso negado!');
      });
});

describe('adicionarPesquisa', () => {
    it('Deve aparar espaços das pontas e ignorar texto vazio', () => {
      const resultado = adicionarPesquisa(['biblioteca'], ' ');
      expect(resultado).toEqual(['biblioteca']);
    });

    it('Adiciona o novo texto no inicio do historico', () => {
      const resultado = adicionarPesquisa(['biblioteca'], 'Museu');
      expect(resultado).toEqual(['Museu', 'biblioteca']);
    });

    it('Remove opções duplicadas do histórico, sem diferenciar maiúsculas e minúsculas', () => {
      const resultado = adicionarPesquisa(['Museu', 'biblioteca'], 'Biblioteca');
      expect(resultado).toEqual(['Biblioteca', 'Museu']);
    });

    it('Filtra a lista para no máximo 5 itens', () => {
      const inicial = ['1', '2', '3', '4', '5'];
      const resultado = adicionarPesquisa(inicial, '6');
      expect(resultado).toEqual(['6', '1', '2', '3', '4']);
    });
});

describe('salvarHistorico', () => {

    it('Deve salvar o histórico no localStorage e retornar true', () => {
      const gravou = salvarHistorico(['biblioteca']);
      expect(gravou).toBe(true);
      expect(localStorage.getItem(CHAVE_HISTORICO)).toBe(JSON.stringify(['biblioteca']));
    });

    it('Deve retornar false caso o localStorage esteja inacessível', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage cheio!');
    });
    
    const gravou = salvarHistorico(['biblioteca']);
    expect(gravou).toBe(false);
    
    });
  });
});