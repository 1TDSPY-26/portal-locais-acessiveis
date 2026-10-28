import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { Loading } from '../../components/Loading/Loading'
import LocalDetail from '../../components/LocalDetail/LocalDetail'
import { useTituloDocumento } from '../../hooks/useTituloDocumento'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'
import { acrescentarDica, ehErroRecuperavel } from '../../utils/novaTentativa'

const MENSAGEM_ID_INVALIDO = 'Endereço inválido: o identificador do local precisa ser um número.'
const MENSAGEM_NAO_ENCONTRADO = 'Local não encontrado.'

const classeLink =
  'inline-flex min-h-11 items-center font-medium text-blue-700 underline hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

type EstadoDaNavegacao = {
  mensagem?: string
}

function ehIdValido(id: number) {
  return Number.isInteger(id) && id > 0
}

export default function DetalheLocal() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const idLocal = Number(id)
  const idValido = ehIdValido(idLocal)

  const [local, setLocal] = useState<Local | null>(null)
  const [isLoading, setIsLoading] = useState(idValido)
  const [errorMessage, setErrorMessage] = useState(idValido ? '' : MENSAGEM_ID_INVALIDO)
  const [erroRecuperavel, setErroRecuperavel] = useState(false)
  const [falhasSeguidas, setFalhasSeguidas] = useState(0)
  const [tentativa, setTentativa] = useState(0)
  const resultadoRef = useRef<HTMLDivElement>(null)
  // Guardada em estado para continuar na tela depois que o state da navegação for limpo.
  const [avisoSucesso] = useState(
    () => (location.state as EstadoDaNavegacao | null)?.mensagem ?? '',
  )
  const avisoRef = useRef<HTMLParagraphElement>(null)

  // O título da aba acompanha o estado da página.
  let tituloDaAba = 'Local não encontrado'
  if (isLoading) {
    tituloDaAba = 'Carregando local'
  } else if (local) {
    tituloDaAba = local.nome
  }
  useTituloDocumento(tituloDaAba)

  useEffect(() => {
    if (!idValido) return
    let active = true

    obterLocalPorId(idLocal)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setErrorMessage(error.status === 404 ? MENSAGEM_NAO_ENCONTRADO : error.message)
          setErroRecuperavel(ehErroRecuperavel(error.status))
          setFalhasSeguidas((falhas) => falhas + 1)
          return
        }
        if (data) {
          setLocal(data)
          setFalhasSeguidas(0)
        }
      })
      .catch(() => {
        if (!active) return
        setErrorMessage('Erro inesperado ao carregar o local.')
        setErroRecuperavel(true)
        setFalhasSeguidas((falhas) => falhas + 1)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [idLocal, idValido, tentativa])

  function tentarNovamente() {
    setErrorMessage('')
    setErroRecuperavel(false)
    setIsLoading(true)
    setTentativa((n) => n + 1)
  }

  // Depois de cada nova tentativa (não no primeiro carregamento), leva o foco para o resultado.
  useEffect(() => {
    if (tentativa > 0 && !isLoading) {
      resultadoRef.current?.focus()
    }
  }, [tentativa, isLoading])

  // Quando a página termina de carregar, leva o foco para o aviso e limpa o state
  // (para a mensagem não voltar a aparecer com F5).
  useEffect(() => {
    if (!avisoSucesso || isLoading || !local) return
    if (tentativa === 0) avisoRef.current?.focus()
    navigate(location.pathname, { replace: true })
  }, [avisoSucesso, isLoading, local, navigate, location.pathname, tentativa])

  if (isLoading) return <Loading message="Carregando informações do local..." />

  const mensagemErro = errorMessage || MENSAGEM_NAO_ENCONTRADO

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {avisoSucesso && local && (
        <p
          ref={avisoRef}
          tabIndex={-1}
          role="status"
          className="mb-6 rounded-md bg-green-50 p-3 text-sm text-green-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          <strong>Sucesso:</strong> {avisoSucesso}
        </p>
      )}

      <div
        id="resultado-detalhe"
        ref={resultadoRef}
        tabIndex={-1}
        className="focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
      >
        {local ? (
          <LocalDetail local={local} />
        ) : (
          <ErrorMessage
            message={erroRecuperavel ? acrescentarDica(mensagemErro, falhasSeguidas) : mensagemErro}
            onRetry={erroRecuperavel ? tentarNovamente : undefined}
          />
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        <Link to="/locais" className={classeLink}>
          Voltar para a lista de locais
        </Link>

        {local && (
          <Link to={`/locais/editar/${local.id}`} className={classeLink}>
            Editar local<span className="sr-only"> {local.nome}</span>
          </Link>
        )}
      </div>
    </div>
  )
}