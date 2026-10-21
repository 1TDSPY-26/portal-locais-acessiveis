
const MENSAGENS_POR_STATUS: Record<number, string> = {
  400: 'Os dados enviados não estão corretos. Confira as informações e tente novamente.',
  401: 'Você precisa entrar na sua conta para continuar. Faça login e tente novamente.',
  403: 'Você não tem permissão para realizar esta ação. Confira suas permissões ou fale com o suporte.',
  404: 'Não encontramos o que você procurou. Ele pode ter sido removido.',
  408: 'A operação demorou demais para responder. Tente novamente.',
  409: 'Não foi possível concluir a operação porque há um conflito com os dados existentes. Confira as informações e tente novamente.',
  422: 'Alguns dados não foram aceitos. Revise as informações e tente novamente.',
  429: 'Você fez muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.',
  500: 'Ocorreu um problema no servidor. Tente novamente mais tarde.',
  502: 'O servidor recebeu uma resposta inesperada. Tente novamente em instantes.',
  503: 'O serviço está temporariamente indisponível. Tente novamente em alguns minutos.',
  504: 'O servidor demorou para responder. Tente novamente em instantes.',
}

export const MENSAGEM_PADRAO =
  'Não foi possível concluir a operação. Tente novamente.'

export function mensagemPorStatus(status: number): string {
  const mensagem = MENSAGENS_POR_STATUS[status]

  if (mensagem) {
    return mensagem
  }

  if (status >= 500 && status <= 599) {
    return MENSAGENS_POR_STATUS[500]
  }

  return MENSAGEM_PADRAO
}
