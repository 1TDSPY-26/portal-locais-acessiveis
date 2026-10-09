export const NOTA_MINIMA = 1
export const NOTA_MAXIMA = 5

export function normalizarNota(nota: unknown): number | null {
  if (typeof nota !== 'number' || !Number.isFinite(nota)) return null
  if (nota < NOTA_MINIMA || nota > NOTA_MAXIMA) return null
  return nota
}