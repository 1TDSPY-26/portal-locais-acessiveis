export const MENSAGEM_SEM_CONEXAO =
  'Sem conexão com o servidor. Verifique sua internet e tente novamente.'

export const MENSAGEM_TEMPO_ESGOTADO =
  'A resposta demorou mais que o esperado. Verifique sua internet e tente novamente em instantes.'

export const MENSAGEM_RESPOSTA_INVALIDA =
  'Recebemos uma resposta que não conseguimos entender. Tente novamente mais tarde.'

export function mensagemPorFalha(erro: unknown): string {
  if (erro instanceof Error && erro.name === 'AbortError') {
    return MENSAGEM_TEMPO_ESGOTADO
  }

  if (erro instanceof SyntaxError) {
    return MENSAGEM_RESPOSTA_INVALIDA
  }

  return MENSAGEM_SEM_CONEXAO
}