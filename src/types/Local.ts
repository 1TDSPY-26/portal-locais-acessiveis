import type { AccessibilityType } from '../constants/accessibilityTypes' 

export type Local = {
  id: number
  nome: string
  endereco: string
  categoria: string
  tiposAcessibilidade:  AccessibilityType[]
  descricao: string
  notaAcessibilidade: number
}