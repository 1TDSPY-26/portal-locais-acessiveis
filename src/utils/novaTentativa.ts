// Status em que o servidor pode voltar a responder se a pessoa tentar de novo.
export const STATUS_RECUPERAVEIS = [408, 429]

export const FALHAS_PARA_MOSTRAR_DICA = 3

export const DICA_FALHAS_SEGUIDAS = 'Verifique sua conexão ou tente mais tarde.'

export function ehErroRecuperavel(status?: number): boolean {
  // Sem status, a falha foi de conexão ou de tempo esgotado.
  if (status === undefined) {
    return true
  }

  return STATUS_RECUPERAVEIS.includes(status) || (status >= 500 && status <= 599)
}

export function acrescentarDica(mensagem: string, falhasSeguidas: number): string {
  if (falhasSeguidas < FALHAS_PARA_MOSTRAR_DICA) {
    return mensagem
  }

  return `${mensagem} ${DICA_FALHAS_SEGUIDAS}`
}