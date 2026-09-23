import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { Loading } from '../../components/Loading/Loading'
import { LocalDetail } from '../../components/LocalDetail/LocalDetail'
import { obterLocalPorId as getLocationById } from '../../services/locais'
import type { Local } from '../../types/Local'

export default function DetalheLocalPage() {
  const { id } = useParams<{ id: string }>()

  const [local, setLocal] = useState<Local | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    async function carregarLocal() {
      if (!id) {
        setErro('ID do local não informado.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setErro(null)

        const { data, error } = await getLocationById(Number(id))

        if (error) {
          setErro(error.message || 'Erro ao carregar o local.')
          return
        }

        if (!data) {
          setErro('Local não encontrado.')
          return
        }

        setLocal(data)
      } catch {
        setErro('Erro inesperado ao carregar as informações do local.')
      } finally {
        setLoading(false)
      }
    }

    carregarLocal()
  }, [id, tentativa])

  if (loading) {
    return <Loading />
  }

  if (erro || !local) {
    return (
      <div tabIndex={-1} aria-live="polite" className="container mx-auto p-4">
        <ErrorMessage
          message={erro || 'Local não encontrado.'}
          onRetry={() => setTentativa((prev) => prev + 1)}
        />
        <Link
          to="/locais"
          className="mt-4 inline-flex min-h-11 items-center text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Voltar para a lista
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-w-0 p-4">
      <nav aria-label="Caminho de navegação" className="mb-6">
        <ol className="flex flex-wrap gap-x-2 break-words text-sm">
          <li><Link to="/" className="text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Início</Link><span aria-hidden="true"> / </span></li>
          <li><Link to="/locais" className="text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Locais</Link><span aria-hidden="true"> / </span></li>
          <li className="min-w-0 break-words" aria-current="page">{local.nome}</li>
        </ol>
      </nav>
      <LocalDetail local={local} />
      <Link to="/locais" className="mt-6 inline-flex min-h-11 items-center text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
        Voltar para a lista de locais
      </Link>
    </div>
  )
}
