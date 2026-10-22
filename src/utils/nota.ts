export const NOTA_MINIMA = 1
export const NOTA_MAXIMA = 5

/**
 * Converte o valor recebido da API em uma nota válida (1 a 5) ou `null`.
 * Trata null, undefined, 0, NaN e valores fora da faixa como "sem avaliação".
 */
export function normalizarNota(nota: unknown): number | null {
  if (typeof nota !== 'number' || !Number.isFinite(nota)) return null
  if (nota < NOTA_MINIMA || nota > NOTA_MAXIMA) return null
  return nota
}