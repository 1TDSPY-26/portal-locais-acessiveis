import { useMemo, useState } from 'react'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import CampoBusca from '../../components/CampoBusca/CampoBusca'
import FiltrosLocais from '../../components/FiltrosLocais/FiltrosLocais'
import { useLocais } from '../../hooks/useLocais'

function normalizar(texto: string) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Locais() {
  const {
    locais,
    isLoading,
    revalidando,
    errorMessage,
    atualizadoEm,
    recarregar: loadLocais,
  } = useLocais()

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] =
    useState('')
  const [recursos, setRecursos] =
    useState<string[]>([])

  const categorias = useMemo(
    () =>
      [
        ...new Set(
          locais.map(
            (local) => local.categoria,
          ),
        ),
      ].sort(),
    [locais],
  )

  const recursosDisponiveis = useMemo(
    () =>
      [
        ...new Set(
          locais.flatMap(
            (local) =>
              local.tiposAcessibilidade,
          ),
        ),
      ].sort(),
    [locais],
  )

  const locaisVisiveis = useMemo(() => {
    const texto = normalizar(
      busca.trim(),
    )

    return locais.filter(
      (local) =>
        (!texto ||
          normalizar(
            local.nome,
          ).includes(texto)) &&
        (!categoria ||
          local.categoria === categoria) &&
        recursos.every((recurso) =>
          local.tiposAcessibilidade.includes(
            recurso,
          ),
        ),
    )
  }, [
    locais,
    busca,
    categoria,
    recursos,
  ])

  const limparFiltros = () => {
    setBusca('')
    setCategoria('')
    setRecursos([])
  }

  const horarioAtualizacao =
    atualizadoEm?.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

      <section
        aria-labelledby="lista-locais"
        className="mt-8"
      >
        <h2
          id="lista-locais"
          className="sr-only"
        >
          Lista de locais cadastrados
        </h2>

        {!isLoading &&
          locais.length > 0 && (
            <div className="space-y-4">
              <CampoBusca
                valor={busca}
                onChange={setBusca}
              />

              <FiltrosLocais
                categorias={categorias}
                recursosDisponiveis={
                  recursosDisponiveis
                }
                categoria={categoria}
                recursos={recursos}
                buscaAtiva={
                  busca.trim().length > 0
                }
                onCategoriaChange={
                  setCategoria
                }
                onRecursosChange={
                  setRecursos
                }
                onLimpar={limparFiltros}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p
                  role="status"
                  aria-live="polite"
                >
                  {locaisVisiveis.length}{' '}
                  {locaisVisiveis.length === 1
                    ? 'local encontrado'
                    : 'locais encontrados'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {atualizadoEm && (
                    <span>
                      Atualizado às{' '}
                      {horarioAtualizacao}
                    </span>
                  )}

                  {revalidando && (
                    <span role="status">
                      Atualizando...
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={loadLocais}
                    disabled={revalidando}
                    className="min-h-11 rounded-md border px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Atualizar lista
                  </button>
                </div>
              </div>
            </div>
          )}

        {isLoading && <Loading />}

        {!isLoading &&
          errorMessage && (
            <div className="mt-6">
              <ErrorMessage
                message={errorMessage}
                onRetry={loadLocais}
              />
            </div>
          )}

        {!isLoading &&
          !errorMessage &&
          locais.length === 0 && (
            <EmptyState message="Nenhum local cadastrado até o momento." />
          )}

        {!isLoading &&
          locais.length > 0 &&
          locaisVisiveis.length === 0 && (
            <EmptyState message="Nenhum local corresponde à pesquisa e aos filtros selecionados." />
          )}

        {!isLoading &&
          locaisVisiveis.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locaisVisiveis.map(
                (local) => (
                  <LocalCard
                    key={local.id}
                    local={local}
                  />
                ),
              )}
            </div>
          )}
      </section>
    </div>
  )
}