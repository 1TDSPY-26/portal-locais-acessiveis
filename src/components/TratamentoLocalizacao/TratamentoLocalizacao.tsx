import type { EstadoGeolocalizacao } from '../../hooks/useGeolocalizacao'

export type TratamentoLocalizacaoProps = {
  estado: EstadoGeolocalizacao
  onSolicitar: () => void
  onDesligarProximidade: () => void
}

const MENSAGEM_SOLICITANDO = 'Obtendo sua localização...'
const MENSAGEM_LOCALIZACAO_NEGADA =
  'Erro: localização negada. Continue pela busca ou verifique as permissões do navegador.'
const MENSAGEM_LOCALIZACAO_INDISPONIVEL =
  'Erro: não foi possível descobrir sua localização. Continue pela busca ou tente de novo mais tarde.'
const MENSAGEM_TEMPO_ESGOTADO =
  'Erro: a localização demorou demais para responder. Continue pela busca ou tente de novo.'

// onSolicitar e onDesligarProximidade já chegam da página: a #186 usa os dois nos botões da negação.
export default function TratamentoLocalizacao(props: TratamentoLocalizacaoProps) {
  const { estado } = props

  if (estado === 'solicitando') {
    return (
      <p role="status" className="text-sm text-gray-700">
        {MENSAGEM_SOLICITANDO}
      </p>
    )
  }

  const mensagemDeErro = obterMensagemDeErro(estado)

  if (!mensagemDeErro) {
    return null
  }

  return (
    <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      {mensagemDeErro}
    </p>
  )
}

function obterMensagemDeErro(estado: EstadoGeolocalizacao) {
  if (estado === 'negada') {
    return MENSAGEM_LOCALIZACAO_NEGADA
  }

  if (estado === 'indisponivel') {
    return MENSAGEM_LOCALIZACAO_INDISPONIVEL
  }

  if (estado === 'tempo-esgotado') {
    return MENSAGEM_TEMPO_ESGOTADO
  }

  // 'inativa' e 'pronta' não têm erro para mostrar.
  return ''
}