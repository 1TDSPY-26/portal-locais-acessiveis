import type { Local } from '../types/Local'

export type ResultadoPaginado = {
  itens: Local[]
  paginaAtual: number
  totalPaginas: number
  inicio: number
  fim: number
  total: number
}

export function paginar(lista: Local[], pagina: number, porPagina: number): ResultadoPaginado {
  const total = lista.length
  const totalPaginas = total === 0 ? 1 : Math.ceil(total / porPagina)
  
  const paginaAtual = Math.max(1, Math.min(pagina, totalPaginas))
  
  if (total === 0) {
    return {
      itens: [],
      paginaAtual: 1,
      totalPaginas: 1,
      inicio: 0,
      fim: 0,
      total: 0
    }
  }

  const inicioIndice = (paginaAtual - 1) * porPagina
  const fimIndice = Math.min(inicioIndice + porPagina, total)
  const itens = lista.slice(inicioIndice, fimIndice)

  return {
    itens,
    paginaAtual,
    totalPaginas,
    inicio: inicioIndice + 1,
    fim: fimIndice,
    total
  }
}