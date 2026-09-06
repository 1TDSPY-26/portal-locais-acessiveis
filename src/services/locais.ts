import type { Local } from '../types/Local'
import { apiRequest } from './api'

export type FiltrosLocais = {
  categoria?: string
  acessibilidade?: string
  pagina?: number
  limite?: number
}

export async function listarLocais(filtros?: FiltrosLocais) {
  const params = new URLSearchParams()

  if (filtros?.categoria) {
    params.append('categoria', filtros.categoria)
  }

  if (filtros?.acessibilidade) {
    params.append('acessibilidade', filtros.acessibilidade)
  }

  if (filtros?.pagina) {
    params.append('pagina', String(filtros.pagina))
  }

  if (filtros?.limite) {
    params.append('limite', String(filtros.limite))
  }

  const query = params.toString()
  const endpoint = query ? `/locais?${query}` : '/locais'

  return apiRequest<Local[]>(endpoint)
}

export async function obterLocalPorId(id: number) {
  return apiRequest<Local>(`/locais/${id}`)
}

export async function criarLocal(local: Omit<Local, 'id'>) {
  return apiRequest<Local>('/locais', {
    method: 'POST',
    body: JSON.stringify(local),
  })
}

export async function atualizarLocal(id: number, local: Partial<Local>) {
  return apiRequest<Local>(`/locais/${id}`, {
    method: 'PUT',
    body: JSON.stringify(local),
  })
}

export async function removerLocal(id: number) {
  return apiRequest<void>(`/locais/${id}`, {
    method: 'DELETE',
  })
}