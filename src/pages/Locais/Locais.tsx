import { useEffect, useMemo, useRef, useState } from 'react'
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
import TratamentoLocalizacao from '../../components/TratamentoLocalizacao/TratamentoLocalizacao'
import { useGeolocalizacao } from '../../hooks/useGeolocalizacao'
import { obterCoordenadasDoLocal, type Coordenadas } from '../../services/coordenadasLocais'
import { calcularDistanciaKm } from '../../utils/distancia'

import AvisoDadosReserva from '../../components/AvisoDadosReserva/AvisoDadosReserva'
import { estaUsandoServidorReserva } from '../../services/servidorReserva'
import { ordenarLocais } from '../../utils/ordenarLocais'
import { useOrdenacaoNaUrl } from '../../hooks/useOrdenacaoNaUrl'
import Paginacao from '../../components/Paginacao/Paginacao'
import { paginar } from '../../utils/paginar'
import { useTituloDocumento } from '../../hooks/useTituloDocumento'

const DISTANCIA_MAXIMA_KM = 5
const TEXTO_BOTAO_LOCALIZACAO = 'Usar minha localização'
const TEXTO_FILTRO_PROXIMIDADE = 'Até 5 km de mim'

const ITENS_POR_PAGINA = 9

function descreverFiltrosAtivos(busca: string, categoria: string, recursos: string[]): string {
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

// O "<=" faz um local a exatamente 5 km entrar. Sem coordenadas verificadas, o local sai.
function estaAteCincoKm(local: Local, posicao: Coordenadas) {
  const coordenadas = obterCoordenadasDoLocal(local)
  if (!coordenadas) return false
  return calcularDistanciaKm(posicao, coordenadas) <= DISTANCIA_MAXIMA_KM
}

export default function Locais() {
  useTituloDocumento('Locais acessíveis')
  const {
    locais,
    isLoading,
    revalidando,
    errorMessage,
    atualizadoEm,
    recarregar: loadLocais,
  } = useLocais()
  const { ordenacao, setOrdenacao } = useOrdenacaoNaUrl()
  const [pagina, setPagina] = useState(1)
  const tituloListaRef = useRef<HTMLHeadingElement>(null)

  const [localParaExcluir, setLocalParaExcluir] = useState<Local | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [avisoExclusao, setAvisoExclusao] = useState('')
  const avisoExclusaoRef = useRef<HTMLParagraphElement>(null)
  const botaoQueAbriuRef = useRef<HTMLElement | null>(null)

  // O botão "Excluir" some junto com o card: leva o foco para a confirmação.
  useEffect(() => {
    if (!avisoExclusao) return
    const quadro = requestAnimationFrame(() => avisoExclusaoRef.current?.focus())
    return () => cancelAnimationFrame(quadro)
  }, [avisoExclusao])

  function abrirExclusao(local: Local) {
    // Guarda quem tinha o foco para devolvê-lo se a pessoa cancelar.
    botaoQueAbriuRef.current = document.activeElement as HTMLElement | null
    setLocalParaExcluir(local)
  }

  function cancelarExclusao() {
    if (excluindo) return
    setLocalParaExcluir(null)
    setErroExclusao('')

    // requestAnimationFrame espera o <dialog> terminar de fechar;
    // sem isso, ele pega o foco de volta.
    requestAnimationFrame(() => {
      botaoQueAbriuRef.current?.focus()
    })
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
  const { estado, posicao, solicitarLocalizacao } = useGeolocalizacao()
  const [proximidadeLigada, setProximidadeLigada] = useState(false)
  const posicaoDoFiltro = proximidadeLigada ? posicao : null
  const chaveFiltros = JSON.stringify([busca, categoria, [...recursos].sort(), posicaoDoFiltro])
  const filtrosAnteriores = useRef(chaveFiltros)

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
    const texto = normalizar(busca.trim())
    return locais.filter((local) =>
      (!texto || normalizar(local.nome).includes(texto)) &&
      (!categoria || local.categoria === categoria) &&
      recursos.every((recurso) => local.tiposAcessibilidade.includes(recurso)) &&
      (!posicaoDoFiltro || estaAteCincoKm(local, posicaoDoFiltro)),
    )
  }, [locais, busca, categoria, recursos, posicaoDoFiltro])

  // Cada novo pedido desliga o filtro: a pessoa marca de novo quando a nova posição chegar.
  const usarMinhaLocalizacao = () => {
    setProximidadeLigada(false)
    solicitarLocalizacao()
  }

  const desligarProximidade = () => {
    setProximidadeLigada(false)
  }

  const locaisOrdenados = useMemo(
    () => ordenarLocais(locaisVisiveis, ordenacao),
    [locaisVisiveis, ordenacao],
  )
  const resultado = paginar(locaisOrdenados, pagina, ITENS_POR_PAGINA)

  useEffect(() => {
    if (filtrosAnteriores.current !== chaveFiltros) {
      filtrosAnteriores.current = chaveFiltros
      setPagina(1)
      return
    }
    setPagina(resultado.paginaAtual)
  }, [chaveFiltros, resultado.paginaAtual])

  function mudarPagina(novaPagina: number) {
    setPagina(novaPagina)
    tituloListaRef.current?.focus()
    tituloListaRef.current?.scrollIntoView?.({ block: 'start' })
  }

  const horarioAtualizacao =
    atualizadoEm?.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    )

  const mostrarAvisoReserva =
    estaUsandoServidorReserva() && locais.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

      {mostrarAvisoReserva && <AvisoDadosReserva />}

      {avisoExclusao && (
        <p
          ref={avisoExclusaoRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          {avisoExclusao}
        </p>
      )}

      <section
        aria-labelledby="lista-locais"
        className="mt-8"
      >
        <h2
          id="lista-locais"
          ref={tituloListaRef}
          tabIndex={-1}
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

              <div className="flex flex-wrap items-center gap-4 rounded-md border border-gray-200 p-4">
                <button
                  type="button"
                  onClick={usarMinhaLocalizacao}
                  className="inline-flex min-h-11 items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {TEXTO_BOTAO_LOCALIZACAO}
                </button>
                <label className="inline-flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={posicaoDoFiltro !== null}
                    disabled={!posicao}
                    onChange={(evento) => setProximidadeLigada(evento.target.checked)}
                    className="h-5 w-5 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  />
                  {TEXTO_FILTRO_PROXIMIDADE}
                </label>
              </div>

              <TratamentoLocalizacao
                estado={estado}
                onSolicitar={usarMinhaLocalizacao}
                onDesligarProximidade={desligarProximidade}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <SeletorOrdenacao valor={ordenacao} onChange={setOrdenacao} />
                <p
                  role="status"
                  aria-live="polite"
                >
                  Mostrando {resultado.inicio}–{resultado.fim} de {resultado.total} locais
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
          !errorMessage &&
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
              {resultado.itens.map(
                (local) => (
                  <LocalCard
                    key={local.id}
                    local={local}
                    onExcluir={abrirExclusao}
                  />
                ),
              )}
            </div>
          )}

        {!isLoading && locaisOrdenados.length > 0 && (
          <Paginacao
            paginaAtual={resultado.paginaAtual}
            totalPaginas={resultado.totalPaginas}
            onMudarPagina={mudarPagina}
          />
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
