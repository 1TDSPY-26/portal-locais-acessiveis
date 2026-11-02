export const CONTEXTO_CARREGAR_LISTA =
  'Não foi possível carregar a lista de locais.'

export const CONTEXTO_CARREGAR_LOCAL =
  'Não foi possível carregar os dados do local.'

export const CONTEXTO_SALVAR_LOCAL =
  'Não foi possível salvar as alterações do local.'

export const ORIENTACAO_PADRAO = 'Tente novamente.'

export function montarMensagemComContexto(
  contexto: string,
  detalhe: string
): string {
  const detalheSemEspacos = detalhe.trim()

  if (detalheSemEspacos === '') {
    return `${contexto} ${ORIENTACAO_PADRAO}`
  }

  return `${contexto} ${detalheSemEspacos}`
}