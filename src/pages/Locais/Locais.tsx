import { useEffect, useMemo, useState } from 'react'
import { listarLocais, removerLocal } from '../../services/locais'
import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import CampoBusca from '../../components/CampoBusca/CampoBusca'
import FiltrosLocais from '../../components/FiltrosLocais/FiltrosLocais'

function normalizar(texto: string) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [recursos, setRecursos] = useState<string[]>([])
  const [localParaExcluir, setLocalParaExcluir] = useState<Local | null>(null)

  const categorias = useMemo(
    () => [...new Set(locais.map((local) => local.categoria))].sort(),
    [locais],
  )

  const recursosDisponiveis = useMemo(
    () =>
      [...new Set(locais.flatMap((local) => local.tiposAcessibilidade))].sort(),
    [locais],
  )

  const locaisVisiveis = useMemo(() => {
    const texto = normalizar(busca.trim())

    return locais.filter(
      (local) =>
        (!texto || normalizar(local.nome).includes(texto)) &&
        (!categoria || local.categoria === categoria) &&
        recursos.every((recurso) =>
          local.tiposAcessibilidade.includes(recurso),
        ),
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

        if (error) {
          setErrorMessage(error.message)
        } else {
          setLocais(data ?? [])
        }
      })
      .catch(() => {
        if (active) {
          setErrorMessage('Erro inesperado ao carregar os locais.')
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [retryKey])

  const loadLocais = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRetryKey((key) => key + 1)
  }

  const confirmarExclusao = async () => {
    if (!localParaExcluir) return

    const { error } = await removerLocal(localParaExcluir.id)

    if (!error) {
      setLocais((atuais) =>
        atuais.filter((local) => local.id !== localParaExcluir.id),
      )
    }

    setLocalParaExcluir(null)
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
              {locaisVisiveis.length}{' '}
              {locaisVisiveis.length === 1
                ? 'local encontrado'
                : 'locais encontrados'}
            </p>
          </div>
        )}

        {isLoading && <Loading />}

        {!isLoading && errorMessage && (
          <ErrorMessage message={errorMessage} onRetry={loadLocais} />
        )}

        {!isLoading && !errorMessage && locais.length === 0 && (
          <EmptyState message="Nenhum local cadastrado até o momento." />
        )}

        {!isLoading &&
          !errorMessage &&
          locais.length > 0 &&
          locaisVisiveis.length === 0 && (
            <EmptyState message="Nenhum local corresponde à pesquisa e aos filtros selecionados." />
          )}

        {!isLoading && !errorMessage && locaisVisiveis.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locaisVisiveis.map((local) => (
              <LocalCard
                key={local.id}
                local={local}
                onExcluir={setLocalParaExcluir}
              />
            ))}
          </div>
        )}
      </section>

      {localParaExcluir && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmacao-exclusao"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2
              id="titulo-confirmacao-exclusao"
              className="text-xl font-semibold text-gray-900"
            >
              Confirmar exclusão
            </h2>

            <p className="mt-3 text-gray-600">
              Tem certeza que deseja excluir o local{' '}
              <strong>{localParaExcluir.nome}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLocalParaExcluir(null)}
                className="min-h-11 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                className="min-h-11 rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}