import type { Coordenadas } from '../services/coordenadasLocais'

const RAIO_DA_TERRA_KM = 6371

export function calcularDistanciaKm(origem: Coordenadas, destino: Coordenadas): number {
  const latitudeOrigem = converterParaRadianos(origem.latitude)
  const latitudeDestino = converterParaRadianos(destino.latitude)
  const diferencaLatitude = converterParaRadianos(destino.latitude - origem.latitude)
  const diferencaLongitude = converterParaRadianos(destino.longitude - origem.longitude)

  const senoMeiaLatitude = Math.sin(diferencaLatitude / 2)
  const senoMeiaLongitude = Math.sin(diferencaLongitude / 2)

  const termo =
    senoMeiaLatitude * senoMeiaLatitude +
    Math.cos(latitudeOrigem) * Math.cos(latitudeDestino) * senoMeiaLongitude * senoMeiaLongitude

  // O arredondamento pode deixar o termo um pouco fora de [0, 1], e aí a raiz ou o asin dariam NaN.
  const termoLimitado = Math.min(1, Math.max(0, termo))

  return 2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(termoLimitado))
}

function converterParaRadianos(graus: number) {
  return (graus * Math.PI) / 180
}