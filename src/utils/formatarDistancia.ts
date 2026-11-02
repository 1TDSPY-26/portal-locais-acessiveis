export function formatarDistancia(
    distanciaKm: number | null | undefined,
): string | null {
    if (distanciaKm === null || distanciaKm === undefined) return null
    if (!Number.isFinite(distanciaKm) || distanciaKm < 0) return null

    if (distanciaKm < 1) {
        // `|| 0` evita o "-0" que o arredondamento de -0 produziria.
        const metros = Math.round(distanciaKm * 1000) || 0
        return `${metros.toLocaleString('pt-BR')} m`
    }

    const quilometros = distanciaKm.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })
    return `${quilometros} km`
}