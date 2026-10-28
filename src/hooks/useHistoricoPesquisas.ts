import { useState, useEffect } from 'react';
import { lerHistorico, adicionarPesquisa, salvarHistorico, limparHistorico } from '../services/historicoPesquisas';

export const MENSAGEM_ERRO_CARREGAR_HISTORICO = 
  'Não foi possível carregar o histórico neste navegador. Você pode continuar pesquisando.';

export const MENSAGEM_ERRO_SALVAR_HISTORICO = 
  'Não foi possível salvar o histórico neste navegador. Você pode continuar pesquisando.';

export const MENSAGEM_ERRO_LIMPAR_HISTORICO =
  'Não foi possível apagar o histórico neste navegador. Tente novamente.';

export type RetornoHistoricoPesquisas = {
  pesquisas: string[];
  registrar: (texto: string) => void;
  limpar: () => boolean;
  erroPersistencia: string;
};

export function useHistoricoPesquisas(): RetornoHistoricoPesquisas {
  const [pesquisas, setPesquisas] = useState<string[]>([]);
  const [erroPersistencia, setErroPersistencia] = useState<string>('');

  useEffect(() => {
    try {
      const historicoInicial = lerHistorico();
      setPesquisas(historicoInicial);
    } catch {
      setPesquisas([]);
      setErroPersistencia(MENSAGEM_ERRO_CARREGAR_HISTORICO);
    }
  }, []);

  const registrar = (texto: string) => {
    const textoAparado = texto.trim();
    if (!textoAparado) return;

    const novaLista = adicionarPesquisa(pesquisas, textoAparado);
    setPesquisas(novaLista);

    const gravouComSucesso = salvarHistorico(novaLista);

    if (!gravouComSucesso) {
      setErroPersistencia(MENSAGEM_ERRO_SALVAR_HISTORICO);
    } else {
      setErroPersistencia('');
    }
  };

  const limpar = (): boolean => {
    const apagou = limparHistorico();

    if (!apagou) {
      setErroPersistencia(MENSAGEM_ERRO_LIMPAR_HISTORICO);
      return false;
    }

    setPesquisas([]);
    setErroPersistencia('');
    return true;
  };

  return {
    pesquisas,
    registrar,
    limpar,
    erroPersistencia,
  };
}