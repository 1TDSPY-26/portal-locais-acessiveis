import type { Local } from '../types/Local'
import { COORDENADAS_LOCAIS } from '../data/coordenadasLocais'

export type Coordenadas = { latitude: number; longitude: number }

export type CoordenadaVerificada = Coordenadas & {
  idLocal: number
  enderecoVerificado: string
  fonte: string
  dataVerificacao: string
}

const LATITUDE_MAXIMA = 90
const LONGITUDE_MAXIMA = 180

export function obterCoordenadasDoLocal(local: Local, catalogo: CoordenadaVerificada[] = COORDENADAS_LOCAIS): Coordenadas | null {
  const enderecoDoLocal = normalizarEndereco(local.endereco)

  // Confere id E endereço: outra base pode reaproveitar o mesmo id para outro lugar.
  const registro = catalogo.find(
    (item) => item.idLocal === local.id && normalizarEndereco(item.enderecoVerificado) === enderecoDoLocal,
  )

  if (!registro) {
    return null
  }

  if (!ehRegistroValido(registro)) {
    return null
  }

  return { latitude: registro.latitude, longitude: registro.longitude }
}

// Tira os espaços das pontas, junta espaços repetidos e passa para minúsculas.
// Números e complementos ficam: "Rua Vergueiro, 1000" e "Rua Vergueiro, 100" são lugares diferentes.
function normalizarEndereco(endereco: string) {
  const palavras = endereco.trim().split(' ').filter((palavra) => palavra !== '')
  return palavras.join(' ').toLocaleLowerCase('pt-BR')
}

function ehRegistroValido(registro: CoordenadaVerificada) {
  if (!ehNumeroNoIntervalo(registro.latitude, LATITUDE_MAXIMA)) {
    return false
  }

  if (!ehNumeroNoIntervalo(registro.longitude, LONGITUDE_MAXIMA)) {
    return false
  }

  if (!ehLinkValido(registro.fonte)) {
    return false
  }

  return ehDataValida(registro.dataVerificacao)
}

// Number.isFinite recusa NaN e Infinity. Os limites (-90, 90, -180, 180) valem.
function ehNumeroNoIntervalo(valor: number, limite: number) {
  return Number.isFinite(valor) && valor >= -limite && valor <= limite
}

function ehLinkValido(fonte: string) {
  if (fonte.trim() === '') {
    return false
  }

  try {
    const link = new URL(fonte)
    return link.protocol === 'http:' || link.protocol === 'https:'
  } catch {
    // new URL lança erro quando o texto não é um link.
    return false
  }
}

// Converte a data e volta para texto: só uma data real em AAAA-MM-DD volta igual.
function ehDataValida(data: string) {
  const dataConvertida = new Date(`${data}T00:00:00Z`)

  if (Number.isNaN(dataConvertida.getTime())) {
    return false
  }

  return dataConvertida.toISOString().slice(0, 10) === data
}
