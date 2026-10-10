import { useEffect, useMemo, useState } from 'react'
import { listarLocais } from '../../services/locais'
import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import CampoBusca from '../../components/CampoBusca/CampoBusca'
import FiltrosLocais from '../../components/FiltrosLocais/FiltrosLocais'

function descreverFiltrosAtivos(busca: string, categoria: string, recursos: string[]) {
  const partes: string[] = []

  if (busca.trim()) partes.push(`busca "${busca.trim()}"`)
  if (categoria) partes.push(`categoria "${categoria}"`)
  if (recursos.length > 0) partes.push(`${recursos.length} recurso(s) marcado(s)`)

  if (partes.length === 0) return 'Tente outros termos de busca.'
  return `Nenhum local corresponde a: ${partes.join(', ')}. Tente remover algum filtro.`
}

function normalizar(texto: string) {
  return texto.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [recursos, setRecursos] = useState<string[]>([])

  const categorias = useMemo(
    () => [...new Set(locais.map((local) => local.categoria))].sort(),
    [locais],
  )
  const recursosDisponiveis = useMemo(
    () => [...new Set(locais.flatMap((local) => local.tiposAcessibilidade))].sort(),
    [locais],
  )
  const locaisVisiveis = useMemo(() => {
    const texto = normalizar(busca.trim())
    return locais.filter((local) =>
      (!texto || normalizar(local.nome).includes(texto)) &&
      (!categoria || local.categoria === categoria) &&
      recursos.every((recurso) => local.tiposAcessibilidade.includes(recurso)),
    )
  }, [locais, busca, categoria, recursos])

  const limparFiltros = () => {
    setBusca('')
    setCategoria('')
    setRecursos([])
  }

  useEffect(() => {
    let active = true
    listarLocais()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setErrorMessage(error.message)
        else setLocais(data ?? [])
      })
      .catch(() => {
        if (active) setErrorMessage('Erro inesperado ao carregar os locais.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [retryKey])

  const loadLocais = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRetryKey((key) => key + 1)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

      <section aria-labelledby="lista-locais" className="mt-8">
        <h2 id="lista-locais" className="sr-only">
          Lista de locais cadastrados
        </h2>

        {!isLoading && !errorMessage && locais.length > 0 && (
          <div className="space-y-4">
            <CampoBusca valor={busca} onChange={setBusca} />
            <FiltrosLocais
              categorias={categorias}
              recursosDisponiveis={recursosDisponiveis}
              categoria={categoria}
              recursos={recursos}
              buscaAtiva={busca.trim().length > 0}
              onCategoriaChange={setCategoria}
              onRecursosChange={setRecursos}
              onLimpar={limparFiltros}
            />
            <p role="status" aria-live="polite">
              {locaisVisiveis.length} {locaisVisiveis.length === 1 ? 'local encontrado' : 'locais encontrados'}
            </p>
          </div>
        )}

        {isLoading && <Loading />}

        {!isLoading && errorMessage && (
          <ErrorMessage message={errorMessage} onRetry={loadLocais} />
        )}

       {!isLoading && !errorMessage && locais.length === 0 && (
  <EmptyState
    titulo="Ainda não há locais cadastrados"
    descricao="Conhece um lugar acessível? Ajude outras pessoas cadastrando-o."
    link={{ rotulo: 'Cadastrar o primeiro local', para: '/cadastro' }}
  />
)}
{!isLoading && !errorMessage && locais.length > 0 && locaisVisiveis.length === 0 && (
  <EmptyState
    titulo="Nenhum local encontrado"
    descricao={descreverFiltrosAtivos(busca, categoria, recursos)}
    botao={{ rotulo: 'Mostrar todos os locais', onClick: limparFiltros }}
  />
)}

        {!isLoading && !errorMessage && locaisVisiveis.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locaisVisiveis.map((local) => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
