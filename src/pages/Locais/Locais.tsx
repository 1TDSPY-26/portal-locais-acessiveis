
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  listarLocais,
  removerLocal,
} from '../../services/locais'
import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
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

  const [localParaExcluir, setLocalParaExcluir] =
    useState<Local | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [avisoExclusao, setAvisoExclusao] = useState('')
  const avisoExclusaoRef = useRef<HTMLParagraphElement>(null)
  const botaoQueAbriuRef = useRef<HTMLElement | null>(null)

  const categorias = useMemo(
    () =>
      [...new Set(
        locais.map((local) => local.categoria),
      )].sort(),
    [locais],
  )

  const recursosDisponiveis = useMemo(
    () =>
      [...new Set(
        locais.flatMap(
          (local) => local.tiposAcessibilidade,
        ),
      )].sort(),
    [locais],
  )

  const locaisVisiveis = useMemo(() => {
    const texto = normalizar(busca.trim())

    return locais.filter(
      (local) =>
        (!texto ||
          normalizar(local.nome).includes(texto)) &&
        (!categoria ||
          local.categoria === categoria) &&
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
          setErrorMessage(
            'Erro inesperado ao carregar os locais.',
          )
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

  // O botão "Excluir" some junto com o card: leva o foco para a confirmação.
  useEffect(() => {
    if (!avisoExclusao) return
    const quadro = requestAnimationFrame(() => avisoExclusaoRef.current?.focus())
    return () => cancelAnimationFrame(quadro)
  }, [avisoExclusao])

  const loadLocais = () => {
    setIsLoading(true)
    setErrorMessage('')
    setRetryKey((key) => key + 1)
  }

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
      const { error } = await removerLocal(
        localParaExcluir.id,
      )

      if (error) {
        setErroExclusao(
          error.message ||
            'Não foi possível excluir este local.',
        )
        return
      }

      const nomeLocal = localParaExcluir.nome
      const idLocal = localParaExcluir.id

      setLocais((atuais) =>
        atuais.filter((local) => local.id !== idLocal),
      )

      setAvisoExclusao(
        `Local "${nomeLocal}" excluído.`,
      )

      setLocalParaExcluir(null)
      setErroExclusao('')
    } catch {
      setErroExclusao(
        'Erro inesperado ao excluir o local.',
      )
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

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
          className="sr-only"
        >
          Lista de locais cadastrados
        </h2>

        {!isLoading &&
          !errorMessage &&
          locais.length > 0 && (
            <div className="space-y-4">
              <CampoBusca
                valor={busca}
                onChange={setBusca}
              />

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
          <ErrorMessage
            message={errorMessage}
            onRetry={loadLocais}
          />
        )}

        {!isLoading &&
          !errorMessage &&
          locais.length === 0 && (
            <EmptyState
              message="Nenhum local cadastrado até o momento."
            />
          )}

        {!isLoading &&
          !errorMessage &&
          locais.length > 0 &&
          locaisVisiveis.length === 0 && (
            <EmptyState
              message="Nenhum local corresponde à pesquisa e aos filtros selecionados."
            />
          )}

        {!isLoading &&
          !errorMessage &&
          locaisVisiveis.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locaisVisiveis.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                  onExcluir={abrirExclusao}
                />
              ))}
            </div>
          )}
      </section>

      <ConfirmDialog
        aberto={localParaExcluir !== null}
        titulo="Confirmar exclusão"
        mensagem={
          localParaExcluir && (
            <p>
              Tem certeza de que deseja excluir o local{' '}
              <strong>{localParaExcluir.nome}</strong>?
              {' '}Esta ação não pode ser desfeita.
            </p>
          )
        }
        textoConfirmar="Excluir local"
        carregando={excluindo}
        erro={erroExclusao}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </div>
  )
}
