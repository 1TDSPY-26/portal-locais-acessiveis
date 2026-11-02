import { useEffect, useRef, useState } from 'react'
import type { Coordenadas } from '../services/coordenadasLocais'

export type EstadoGeolocalizacao =
  | 'inativa' | 'solicitando' | 'pronta'
  | 'negada' | 'indisponivel' | 'tempo-esgotado'

export type ResultadoGeolocalizacao = {
  estado: EstadoGeolocalizacao
  posicao: Coordenadas | null
  solicitarLocalizacao: () => void
}

const OPCOES_DO_PEDIDO: PositionOptions = {
  timeout: 10000,
  maximumAge: 0,
  enableHighAccuracy: false,
}

// Códigos de erro que o navegador manda no callback de erro.
const CODIGO_PERMISSAO_NEGADA = 1
const CODIGO_TEMPO_ESGOTADO = 3

const LATITUDE_MAXIMA = 90
const LONGITUDE_MAXIMA = 180

export function useGeolocalizacao(): ResultadoGeolocalizacao {
  const [estado, setEstado] = useState<EstadoGeolocalizacao>('inativa')
  const [posicao, setPosicao] = useState<Coordenadas | null>(null)
  // Número do pedido mais recente. Resposta com outro número é antiga e é ignorada.
  const pedidoAtualRef = useRef(0)

  useEffect(() => {
    return () => {
      // Ao sair da tela, avança o número: nenhuma resposta pendente é mais a atual.
      pedidoAtualRef.current += 1
    }
  }, [])

  function solicitarLocalizacao() {
    pedidoAtualRef.current += 1
    const numeroDoPedido = pedidoAtualRef.current

    setPosicao(null)

    if (!navigator.geolocation) {
      setEstado('indisponivel')
      return
    }

    setEstado('solicitando')

    navigator.geolocation.getCurrentPosition(
      (resposta) => {
        if (numeroDoPedido !== pedidoAtualRef.current) {
          return
        }

        const coordenadas = {
          latitude: resposta.coords.latitude,
          longitude: resposta.coords.longitude,
        }

        if (!ehCoordenadaValida(coordenadas)) {
          setEstado('indisponivel')
          return
        }

        setPosicao(coordenadas)
        setEstado('pronta')
      },
      (erro) => {
        if (numeroDoPedido !== pedidoAtualRef.current) {
          return
        }

        setEstado(converterErroEmEstado(erro.code))
      },
      OPCOES_DO_PEDIDO,
    )
  }

  return { estado, posicao, solicitarLocalizacao }
}

function converterErroEmEstado(codigo: number): EstadoGeolocalizacao {
  if (codigo === CODIGO_PERMISSAO_NEGADA) {
    return 'negada'
  }

  if (codigo === CODIGO_TEMPO_ESGOTADO) {
    return 'tempo-esgotado'
  }

  // Código 2 (posição indisponível) ou qualquer outro.
  return 'indisponivel'
}

// Number.isFinite recusa NaN e Infinity. Os limites (-90, 90, -180, 180) valem.
function ehCoordenadaValida(coordenadas: Coordenadas) {
  if (!ehNumeroNoIntervalo(coordenadas.latitude, LATITUDE_MAXIMA)) {
    return false
  }

  return ehNumeroNoIntervalo(coordenadas.longitude, LONGITUDE_MAXIMA)
}

function ehNumeroNoIntervalo(valor: number, limite: number) {
  return Number.isFinite(valor) && valor >= -limite && valor <= limite
}