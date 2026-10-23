import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistoricoPesquisas, MENSAGEM_ERRO_CARREGAR_HISTORICO, MENSAGEM_ERRO_SALVAR_HISTORICO, MENSAGEM_ERRO_LIMPAR_HISTORICO } from './useHistoricoPesquisas';
import * as historicoService from '../services/historicoPesquisas';

vi.mock('../services/historicoPesquisas', () => ({
  lerHistorico: vi.fn(),
  adicionarPesquisa: vi.fn(),
  salvarHistorico: vi.fn(),
  limparHistorico: vi.fn()
}));

describe('useHistoricoPesquisas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
    
    it('Carrega a lista de pesquisas do histórico ao inicializar o hook', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue(['biblioteca']);

      const { result } = renderHook(() => useHistoricoPesquisas());

      expect(historicoService.lerHistorico).toHaveBeenCalledTimes(1);
      expect(result.current.pesquisas).toEqual(['biblioteca']);
      expect(result.current.erroPersistencia).toBe('');
    });

    it('Exibe mensagem de erro e mantém a lista vazia se falhar ao carregar o histórico', () => {
      vi.mocked(historicoService.lerHistorico).mockImplementation(() => {
        throw new Error('Erro de leitura');
      });

      const { result } = renderHook(() => useHistoricoPesquisas());

      expect(result.current.pesquisas).toEqual([]);
      expect(result.current.erroPersistencia).toBe(MENSAGEM_ERRO_CARREGAR_HISTORICO);
    });

    it('Deve registrar nova pesquisa com sucesso', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue([]);
      vi.mocked(historicoService.adicionarPesquisa).mockReturnValue(['Museu']);
      vi.mocked(historicoService.salvarHistorico).mockReturnValue(true);

      const { result } = renderHook(() => useHistoricoPesquisas());

      act(() => {
        result.current.registrar('Museu');
      });

      expect(historicoService.adicionarPesquisa).toHaveBeenCalledWith([], 'Museu');
      expect(historicoService.salvarHistorico).toHaveBeenCalledWith(['Museu']);
      expect(result.current.pesquisas).toEqual(['Museu']);
      expect(result.current.erroPersistencia).toBe('');
    });

    it('Ignora tentativas de registrar textos vazios ou compostos apenas por espaços', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue([]);

      const { result } = renderHook(() => useHistoricoPesquisas());

      act(() => {
        result.current.registrar(' ');
      });

      expect(historicoService.adicionarPesquisa).not.toHaveBeenCalled();
      expect(historicoService.salvarHistorico).not.toHaveBeenCalled();
      expect(result.current.pesquisas).toEqual([]);
    });

    it('Define mensagem de erro caso o salvamento do histórico falhe', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue([]);
      vi.mocked(historicoService.adicionarPesquisa).mockReturnValue(['Museu']);
      vi.mocked(historicoService.salvarHistorico).mockReturnValue(false);

      const { result } = renderHook(() => useHistoricoPesquisas());

      act(() => {
        result.current.registrar('Museu');
      });

      expect(historicoService.salvarHistorico).toHaveBeenCalledWith(['Museu']);
      expect(result.current.pesquisas).toEqual(['Museu']);
      expect(result.current.erroPersistencia).toBe(MENSAGEM_ERRO_SALVAR_HISTORICO);
    });

    it('Limpa o histórico com sucesso', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue(['Museu']);
      vi.mocked(historicoService.limparHistorico).mockReturnValue(true);

      const { result } = renderHook(() => useHistoricoPesquisas());

      let apagou = false;

      act(() => {
        apagou = result.current.limpar();
      });

      expect(historicoService.limparHistorico).toHaveBeenCalledTimes(1);
      expect(apagou).toBe(true);
      expect(result.current.pesquisas).toEqual([]);
      expect(result.current.erroPersistencia).toBe('');
    });

    it('Mantém o histórico e exibe erro quando não consegue apagá-lo', () => {
      vi.mocked(historicoService.lerHistorico).mockReturnValue(['Museu']);
      vi.mocked(historicoService.limparHistorico).mockReturnValue(false);

      const { result } = renderHook(() => useHistoricoPesquisas());

      let apagou = true;

      act(() => {
        apagou = result.current.limpar();
      });

      expect(historicoService.limparHistorico).toHaveBeenCalledTimes(1);
      expect(apagou).toBe(false);
      expect(result.current.pesquisas).toEqual(['Museu']);
      expect(result.current.erroPersistencia).toBe(MENSAGEM_ERRO_LIMPAR_HISTORICO);
    });
  });