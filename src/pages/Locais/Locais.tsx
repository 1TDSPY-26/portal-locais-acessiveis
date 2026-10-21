import { useMemo, useState } from 'react'
import LocalCard from '../../components/LocalCard/LocalCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { removerLocal } from '../../services/locais'
import type { Local } from '../../types/Local'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import CampoBusca from '../../components/CampoBusca/CampoBusca'
import FiltrosLocais from '../../components/FiltrosLocais/FiltrosLocais'
import { useLocais } from '../../hooks/useLocais'
import { useFiltrosNaUrl } from '../../hooks/useFiltrosNaUrl'
import SeletorOrdenacao from '../../components/SeletorOrdenacao/SeletorOrdenacao'
import { ordenarLocais, type CriterioOrdenacao } from '../../utils/ordenarLocais'

function descreverFiltrosAtivos(busca: string, categoria: string, recursos: string[]) {
  const partes: string[] = []

  if (busca.trim()) partes.push(`busca "${busca.trim()}"`)
  if (categoria) partes.push(`categoria "${categoria}"`)
  if (recursos.length > 0) partes.push(`${recursos.length} recurso(s) marcado(s)`)

  if (partes.length === 0) return 'Tente outros termos de busca.'
  return `Nenhum local corresponde a: ${partes.join(', ')}. Tente remover algum filtro.`
}

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
  const [ordenacao, setOrdenacao] = useState<CriterioOrdenacao>('nome-asc')

  const [localParaExcluir, setLocalParaExcluir] = useState<Local | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [avisoExclusao, setAvisoExclusao] = useState('')

  function cancelarExclusao() {
    if (excluindo) return
    setLocalParaExcluir(null)
    setErroExclusao('')
  }

  async function confirmarExclusao() {
    if (!localParaExcluir || excluindo) return
    setExcluindo(true)
    setErroExclusao('')
    setAvisoExclusao('')
    try {
      const { error } = await removerLocal(localParaExcluir.id)
      if (error) {
        setErroExclusao(error.message || 'Não foi possível excluir este local.')
        return
      }
      setAvisoExclusao(`Local "${localParaExcluir.nome}" excluído.`)
      setLocalParaExcluir(null)
      loadLocais()
    } catch {
      setErroExclusao('Erro inesperado ao excluir o local.')
    } finally {
      setExcluindo(false)
    }
  }

  const { busca, categoria, recursos, setBusca, setCategoria, setRecursos, limpar: limparFiltros } = useFiltrosNaUrl()

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

  const locaisOrdenados = useMemo(
    () => ordenarLocais(locaisVisiveis, ordenacao),
    [locaisVisiveis, ordenacao],
  )

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

      {avisoExclusao && (
        <p role="status" aria-live="polite" className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {avisoExclusao}
        </p>
      )}

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
                <SeletorOrdenacao valor={ordenacao} onChange={setOrdenacao} />
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
            <EmptyState
              titulo="Ainda não há locais cadastrados"
              descricao="Conhece um lugar acessível? Ajude outras pessoas cadastrando-o."
              link={{ rotulo: 'Cadastrar o primeiro local', para: '/cadastro' }}
            />
          )}

        {!isLoading &&
          locais.length > 0 &&
          locaisVisiveis.length === 0 && (
            <EmptyState
              titulo="Nenhum local encontrado"
              descricao={descreverFiltrosAtivos(busca, categoria, recursos)}
              botao={{ rotulo: 'Mostrar todos os locais', onClick: limparFiltros }}
            />
          )}

        {!isLoading &&
          locaisOrdenados.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locaisOrdenados.map(
                (local) => (
                  <LocalCard
                    key={local.id}
                    local={local}
                    onExcluir={setLocalParaExcluir}
                  />
                ),
              )}
            </div>
          )}
      </section>

      <ConfirmDialog
        aberto={localParaExcluir !== null}
        titulo="Confirmar exclusão"
        mensagem={localParaExcluir && (
          <p>Tem certeza de que deseja excluir o local <strong>{localParaExcluir.nome}</strong>? Esta ação não pode ser desfeita.</p>
        )}
        textoConfirmar="Excluir local"
        carregando={excluindo}
        erro={erroExclusao}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </div>
  )
}
