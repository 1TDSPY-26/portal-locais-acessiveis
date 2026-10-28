export type Local = {
  id: number
  nome: string
  endereco: string
  categoria: string
  tiposAcessibilidade: string[]
  descricao: string
  /** Nota de 1 a 5. `null` (ou ausente) quando o local ainda não foi avaliado. */
  notaAcessibilidade: number | null
}