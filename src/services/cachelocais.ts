import type { Local } from '../types/Local'

export const TEMPO_CACHE_MS = 60_000

type EntradaCache = {
  dados: Local[]
  salvoEm: number
}

let cache: EntradaCache | null = null

export function lerCache(): EntradaCache | null {
  return cache
}

export function ehCacheRecente(
  entrada: EntradaCache,
  agora = Date.now()
): boolean {
  return agora - entrada.salvoEm < TEMPO_CACHE_MS
}

export function salvarCache(dados: Local[]): void {
  cache = {
    dados,
    salvoEm: Date.now(),
  }
}

export function invalidarCacheLocais(): void {
  cache = null
}