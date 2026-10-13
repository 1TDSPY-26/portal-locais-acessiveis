import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { Loading } from '../../components/Loading/Loading'
import LocalDetail from '../../components/LocalDetail/LocalDetail'
import { obterLocalPorId as getLocationById } from '../../services/locais'
import type { Local } from '../../types/Local'

type EstadoDaNavegacao = {
  mensagem?: string
}

export default function DetalheLocalPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [local, setLocal] = useState<Local | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)
  // Guardada em estado para continuar na tela depois que o state da navegação for limpo.
  const [avisoSucesso] = useState(
    () => (location.state as EstadoDaNavegacao | null)?.mensagem ?? '',
  )
  const avisoRef = useRef<HTMLParagraphElement>(null)

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

  // Quando a página termina de carregar, leva o foco para o aviso e limpa o state
  // (para a mensagem não voltar a aparecer com F5).
  useEffect(() => {
    if (!avisoSucesso || loading || !local) return
    avisoRef.current?.focus()
    navigate(location.pathname, { replace: true })
  }, [avisoSucesso, loading, local, navigate, location.pathname])

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
      {avisoSucesso && (
        <p
          ref={avisoRef}
          tabIndex={-1}
          role="status"
          className="mb-6 rounded-md bg-green-50 p-3 text-sm text-green-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          <strong>Sucesso:</strong> {avisoSucesso}
        </p>
      )}
      <LocalDetail local={local} />
      <Link to="/locais" className="mt-6 inline-flex min-h-11 items-center text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
        Voltar para a lista de locais
      </Link>
    </div>
  )
}
