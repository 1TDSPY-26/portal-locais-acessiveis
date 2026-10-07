export type Local = {
  id: number
  nome: string
  endereco: string
  categoria: string
  tiposAcessibilidade: string[]
  descricao: string
  notaAcessibilidade: number
}

export type NovoLocal = Omit<Local, 'id'>