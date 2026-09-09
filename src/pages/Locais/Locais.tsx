import { useCallback, useEffect, useState } from 'react'
import { listarLocais } from '../../services/locais'
import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Locais() {
  useDocumentTitle('Locais')

  const [locais, setLocais] = useState<Local[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
