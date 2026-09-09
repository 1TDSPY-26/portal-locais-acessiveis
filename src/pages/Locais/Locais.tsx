import { useCallback, useEffect, useState } from 'react'
import { listarLocais, removerLocal } from '../../services/locais'

import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [localParaExcluir, setLocalParaExcluir] = useState<Local | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  const loadLocais = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await listarLocais()

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setLocais(data ?? [])
    } catch {
      setErrorMessage('Erro inesperado ao carregar os locais.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLocais()
  }, [loadLocais])

  const handleExcluir = async () => {
    if (!localParaExcluir) return

    try {
      setExcluindo(true)
      setErroExclusao('')

      const { error } = await removerLocal(localParaExcluir.id)

      if (error) {
        setErroExclusao(error.message)
        return
      }

      setLocais((locaisAtuais) =>
        locaisAtuais.filter((local) => local.id !== localParaExcluir.id)
      )

      setLocalParaExcluir(null)
    } catch {
      setErroExclusao('Erro inesperado ao excluir o local.')
    } finally {
      setExcluindo(false)
    }
  }

  
  return (
    <div className="mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

      <section aria-labelledby="lista-locais" className="mt-8">
        <h2 id="lista-locais" className="sr-only">
          Lista de locais cadastrados
        </h2>

        {isLoading && <Loading />}

        {!isLoading && errorMessage && (
          <ErrorMessage message={errorMessage} onRetry={loadLocais} />
        )}

        {!isLoading && !errorMessage && locais.length === 0 && (
          <EmptyState message="Nenhum local cadastrado até o momento." />
        )}

        {!isLoading && !errorMessage && locais.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locais.map((local) => (
              <LocalCard
                key={local.id}
                local={local}
                onExcluir={() => setLocalParaExcluir(local)}
              />
            ))}
          </div>
        )}
      </section>
      {localParaExcluir && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmacao"
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 id="titulo-confirmacao" className="text-xl font-bold">
              Confirmar exclusão
            </h2>

            <p className="mt-4">
              Tem certeza que deseja excluir{' '}
              <strong>{localParaExcluir.nome}</strong>?
            </p>

            {erroExclusao && (
              <p role="alert" className="mt-4">
                {erroExclusao}
              </p>
            )}

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setLocalParaExcluir(null)
                  setErroExclusao('')
                }}
                disabled={excluindo}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExcluir}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
