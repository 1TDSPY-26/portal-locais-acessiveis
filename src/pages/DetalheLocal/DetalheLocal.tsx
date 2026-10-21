import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { Loading } from '../../components/Loading/Loading'
import LocalDetail from '../../components/LocalDetail/LocalDetail'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'

const MENSAGEM_ID_INVALIDO = 'Endereço inválido: o identificador do local precisa ser um número.'
const MENSAGEM_NAO_ENCONTRADO = 'Local não encontrado.'

const classeLink =
  'inline-flex min-h-11 items-center font-medium text-blue-700 underline hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

function ehIdValido(id: number) {
  return Number.isInteger(id) && id > 0
}

export default function DetalheLocal() {
  const { id } = useParams()
  const idLocal = Number(id)
  const idValido = ehIdValido(idLocal)

  const [local, setLocal] = useState<Local | null>(null)
  const [isLoading, setIsLoading] = useState(idValido)
  const [errorMessage, setErrorMessage] = useState(idValido ? '' : MENSAGEM_ID_INVALIDO)

  useEffect(() => {
    if (!idValido) return
    let active = true

    obterLocalPorId(idLocal)
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setErrorMessage(error.status === 404 ? MENSAGEM_NAO_ENCONTRADO : error.message)
          return
        }
        if (data) setLocal(data)
      })
      .catch(() => {
        if (active) setErrorMessage('Erro inesperado ao carregar o local.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [idLocal, idValido])

  if (isLoading) return <Loading message="Carregando informações do local..." />

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {local ? (
        <LocalDetail local={local} />
      ) : (
        <ErrorMessage message={errorMessage || MENSAGEM_NAO_ENCONTRADO} />
      )}

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